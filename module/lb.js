const http = require('http');
const httpProxy = require('http-proxy');

class LoadBalancer {
    constructor(options) {
        this.proxy = httpProxy.createProxyServer();
        this.options = options;
        this.targets = options.targets;
    }

    start() {
        for (let port of this.options.ports) {
            http.createServer((req, res) => {
                console.log(`Port ${port} Received request: ${req.url}`);
                let target;
                // match the request URL with a specific target
                for (let i = 0; i < this.targets.length; i++) {
                    if (req.url.startsWith(this.targets[i].path)) {
                        target = this.targets[i].target;
                        break;
                    }
                }
                if (target) {
                    this.proxy.web(req, res, { target: target });
                } else {
                    res.writeHead(404);
                    res.end();
                }
            }).listen(port);
            console.log(`Load balancer listening on port ${port}`);
        }
    }
}



module.exports = LoadBalancer;
