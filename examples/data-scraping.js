const Cardinal = require('../lib/cardinal');
const http = require('http');
const url = require('url');

// Create a new instance of Cardinal
let cardinal = new Cardinal();

// Define the target servers for the load balancer
let options = {
    ports: [3001, 3002, 3003],
    targets: ['http://localhost:3000', 'http://localhost:3002', 'http://localhost:3003'],
};

// Start the load balancer
cardinal.useLoadBalancer(options);

// Add a program to Cardinal for scraping a website
cardinal.add("scraper", (url) => {
    return new Promise((resolve, reject) => {
        http.get(url, (res) => {
            let data = '';
            res.on('data', (chunk) => {
                data += chunk;
            });
            res.on('end', () => {
                resolve(data);
            });
        }).on('error', (err) => {
            reject(err);
        });
    });
}, ['http://www.google.com/search?q=websites+that+allow+data+scraping']);

// Create the HTTP server and Containerize it with Cardinal
const serverFunc = (port) => {
  http.createServer((req, res) => {
    let query = url.parse(req.url, true).query;
    let targetUrl = query.url;
    cardinal.run("scraper", [targetUrl])
        .then((data) => {
            res.writeHead(200, { 'Content-Type': 'text/html' });
            res.write(data);
            res.end();
        })
        .catch((err) => {
            console.error(err);
            res.writeHead(500, { 'Content-Type': 'text/plain' });
            res.write("An error occurred while scraping the website.");
            res.end();
        });
}).listen(port);
console.log(`Server running at http://localhost:${port}/`);
}

cardinal.add("server", serverFunc, [3000]);
cardinal.run("server");
