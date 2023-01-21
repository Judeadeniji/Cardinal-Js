const http = require("http");
const httpProxy = require("http-proxy");

let loadServers = [];
let currentServer = 0;

const loadBalancer = {
  createloadServers: function (config) {
    for (let i = 0; i < config.loadServer.count; i++) {
      loadServers.push(`http://localhost:${config.loadServer.port + i}`);
      console.log(
        `Created ${i + 1} load servers on ports ${config.loadServer.port} to ${
          config.loadServer.port + i
        }`
      );
    }
  },
  startloadServers: function (config, callback) {
    loadServers.forEach((server, index) => {
      http
        .createServer((req, res) => {
          callback(req, res);
        })
        .listen(config.loadServer.port + index);
    });
    console.log(
      `Started ${config.loadServer.count} load servers on ports ${
        config.loadServer.port
      } to ${config.loadServer.port + config.loadServer.count - 1}`
    );
  },
  // Create a proxy server with custom application logic
  proxy: httpProxy.createProxyServer({}),
  // Load balancing algorithms
  roundRobin: function (req, res) {
    this.proxy.web(req, res, { target: loadServers[currentServer] });
    currentServer = (currentServer + 1) % loadServers.length;
    console.log(
      `Request ${req.url} was handled by server ${currentServer + 1}`
    );
  },
  leastConnections: function (req, res) {
    // Keep track of the number of connections for each load server
    let connections = Array(loadServers.length).fill(0);
    // Increase the number of connections for the selected load server
    connections[currentServer]++;
    // Select the load server with the least number of connections
    let minConnections = Infinity;
    let targetServer;
    for (let i = 0; i < connections.length; i++) {
      if (connections[i] < minConnections) {
        minConnections = connections[i];
        targetServer = loadServers[i];
      }
    }
    this.proxy.web(req, res, { target: targetServer });
    currentServer = loadServers.indexOf(targetServer);
    console.log(`Request ${req.url} was handled by ${targetServer}`);
  },
  ipHash: function (req, res) {
    const crypto = require("crypto");
    // Get the client's IP address
    const clientIp =
      req.headers["x-forwarded-for"] || req.connection.remoteAddress;
    // Generate a hash of the IP address
    const hash = crypto.createHash("md5").update(clientIp).digest("hex");
    // Select a load server based on the hash of the IP address
    const targetServer = loadServers[parseInt(hash, 16) % loadServers.length];
    this.proxy.web(req, res, { target: targetServer });
    console.log(`The server handle request ${req.url} is ${targetServer}`);
  },
  // Create your load balancer function
  balance: function (req, res) {
    // Choose which load balancing algorithm to use
    this.roundRobin(req, res);
    // this.leastConnections(req, res);
    // this.ipHash(req, res);
  },
  // function that starts the load balancer
  start: function (config, callback) {
    this.createloadServers(config);
    this.startloadServers(config, callback);
    http
      .createServer((req, res) => {
        // Handling requests and responses from actual application
        this.loadBalancer(req, res);
        // forwarding the request to the load servers
        this.proxy.web(req, res, { target: loadServers[currentServer] });
      })
      .listen(3001);
    console.log("Load balancer running on port 3001");
  },
};

module.exports = loadBalancer;
