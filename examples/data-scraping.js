const Cardinal = require('../lib/cardinal');
const http = require('http');
const url = require('url');

// Create a new instance of Cardinal
let cardinal = new Cardinal();

// Define the target servers for the load balancer
let options = {
    port: 3001,
    targets: [
        { host: 'localhost', port: 3000 },
    ]
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

// Create the HTTP server
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
}).listen(3000);
console.log("Server running at http://localhost:3000/");
