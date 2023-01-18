const http = require('http');
const httpProxy = require('http-proxy');

let backendServers = [];
let currentServer = 0;


const loadBalancer = {
    createBackendServers: function(config) {
        for (let i = 0; i < config.backendServer.count; i++) {
            backendServers.push(`http://localhost:${config.backendServer.port + i}`);
        console.log(`Created ${i + 1} backend servers on ports ${config.backendServer.port} to ${config.backendServer.port + i }`);
        }
    },
    startBackendServers: function(config) {
        backendServers.forEach((server, index) => {
            http.createServer((req, res) => {
                res.writeHead(404, { 'Content-Type': 'text/html' });
//                res.write(`You are connected to backend server ${index + 1}`);
                res.end();
            }).listen(config.backendServer.port + index);
        });
        console.log(`Started ${config.backendServer.count} backend servers on ports ${config.backendServer.port} to ${config.backendServer.port + config.backendServer.count - 1}`);
    },
    // Create a proxy server with custom application logic
    proxy: httpProxy.createProxyServer({}),
    // Load balancing algorithms
    roundRobin: function(req, res) {
        this.proxy.web(req, res, { target: backendServers[currentServer] });
        currentServer = (currentServer + 1) % backendServers.length;
        console.log(`The server handle request ${req.url} is ${currentServer}`);
    },
    leastConnections: function(req, res) {
    // Keep track of the number of connections for each backend server
    let connections = Array(backendServers.length).fill(0);
    // Increase the number of connections for the selected backend server
    connections[currentServer]++;
    // Select the backend server with the least number of connections
    let minConnections = Infinity;
    let targetServer;
    for (let i = 0; i < connections.length; i++) {
        if (connections[i] < minConnections) {
            minConnections = connections[i];
            targetServer = backendServers[i];
        }
    }
    this.proxy.web(req, res, { target: targetServer });
    currentServer = backendServers.indexOf(targetServer);
    console.log(`The server handle request ${req.url} is ${targetServer}`);
},
    ipHash: function(req, res) {
      const crypto = require('crypto');
    // Get the client's IP address
    const clientIp = req.headers['x-forwarded-for'] || req.connection.remoteAddress;
    // Generate a hash of the IP address
    const hash = crypto.createHash('md5').update(clientIp).digest('hex');
    // Select a backend server based on the hash of the IP address
    const targetServer = backendServers[parseInt(hash, 16) % backendServers.length];
    this.proxy.web(req, res, { target: targetServer });
    console.log(`The server handle request ${req.url} is ${targetServer}`);
},
    // Create your load balancer function
    loadBalancer: function(req, res) {
        // Choose which load balancing algorithm to use
      //  this.roundRobin(req, res);
        // this.leastConnections(req, res);
         this.ipHash(req, res);
    },
    // function that starts the load balancer
    start: function(config) {
        this.createBackendServers(config);
        this.startBackendServers(config);
        http.createServer((req, res) => {
            // Handling requests and responses from actual application
            this.loadBalancer(req, res);
            // forwarding the request to the backend servers
            this.proxy.web(req, res, { target: backendServers[currentServer] });
        }).listen(3000);
        console.log('Load balancer running on port 3000');
    }
};

module.exports = loadBalancer;
