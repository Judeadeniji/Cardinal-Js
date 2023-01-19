const http = require('http');
const httpProxy = require('http-proxy');

let proxyServers = [];
let currentServer = 0;


const loadBalancer = {
    createproxyServers: function(config) {
        for (let i = 0; i < config.proxyServer.count; i++) {
            proxyServers.push(`http://localhost:${config.proxyServer.port + i}`);
        console.log(`Created ${i + 1} backend servers on ports ${config.proxyServer.port} to ${config.proxyServer.port + i }`);
        }
    },
    startproxyServers: function(config) {
        proxyServers.forEach((server, index) => {
            http.createServer((req, res) => {
                res.writeHead(404, { 'Content-Type': 'text/html' });
//                res.write(`You are connected to backend server ${index + 1}`);
                res.end();
            }).listen(config.proxyServer.port + index);
        });
        console.log(`Started ${config.proxyServer.count} backend servers on ports ${config.proxyServer.port} to ${config.proxyServer.port + config.proxyServer.count - 1}`);
    },
    // Create a proxy server with custom application logic
    proxy: httpProxy.createProxyServer({}),
    // Load balancing algorithms
    roundRobin: function(req, res) {
        this.proxy.web(req, res, { target: proxyServers[currentServer] });
        currentServer = (currentServer + 1) % proxyServers.length;
        console.log(`The server handle request ${req.url} is ${currentServer}`);
    },
    leastConnections: function(req, res) {
    // Keep track of the number of connections for each backend server
    let connections = Array(proxyServers.length).fill(0);
    // Increase the number of connections for the selected backend server
    connections[currentServer]++;
    // Select the backend server with the least number of connections
    let minConnections = Infinity;
    let targetServer;
    for (let i = 0; i < connections.length; i++) {
        if (connections[i] < minConnections) {
            minConnections = connections[i];
            targetServer = proxyServers[i];
        }
    }
    this.proxy.web(req, res, { target: targetServer });
    currentServer = proxyServers.indexOf(targetServer);
    console.log(`The server handle request ${req.url} is ${targetServer}`);
},
    ipHash: function(req, res) {
      const crypto = require('crypto');
    // Get the client's IP address
    const clientIp = req.headers['x-forwarded-for'] || req.connection.remoteAddress;
    // Generate a hash of the IP address
    const hash = crypto.createHash('md5').update(clientIp).digest('hex');
    // Select a backend server based on the hash of the IP address
    const targetServer = proxyServers[parseInt(hash, 16) % proxyServers.length];
    this.proxy.web(req, res, { target: targetServer });
    console.log(`The server handle request ${req.url} is ${targetServer}`);
},
    // Create your load balancer function
    loadBalancer: function(req, res) {
        // Choose which load balancing algorithm to use
        this.roundRobin(req, res);
      //   this.leastConnections(req, res);
        // this.ipHash(req, res);
    },
    // function that starts the load balancer
    start: function(config) {
        this.createproxyServers(config);
        this.startproxyServers(config);
        http.createServer((req, res) => {
            // Handling requests and responses from actual application
            this.loadBalancer(req, res);
            // forwarding the request to the backend servers
            this.proxy.web(req, res, { target: proxyServers[currentServer] });
        }).listen(3000);
        console.log('Load balancer running on port 3000');
    }
};

module.exports = loadBalancer;
