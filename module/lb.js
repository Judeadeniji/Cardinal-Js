const http = require('http');

class LoadBalancer {
    constructor(options) {
        this.options = options;
        this.targets = options.targets;
        this.currentTargetIndex = 0;
    }

    start() {
        http.createServer((req, res) => {
            this.handleRequest(req, res);
        }).listen(this.options.port);
    }

    handleRequest(req, res) {
        let target = this.targets[this.currentTargetIndex];
        let proxy = http.request({
            host: target.host,
            port: target.port,
            path: req.url,
            method: req.method
        }, proxyRes => {
            res.writeHead(proxyRes.statusCode, proxyRes.headers);
            proxyRes.pipe(res);
        });

        req.pipe(proxy);

        // Increment the current target index for the next request
        this.currentTargetIndex = (this.currentTargetIndex + 1) % this.targets.length;
    }
}

module.exports = LoadBalancer;