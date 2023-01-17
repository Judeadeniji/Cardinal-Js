const http = require('http');
const Cardinal = require('../lib/cardinal');
// Create an instance of Cardinal
const manager = new Cardinal();

// Define some programs
const program1 = (param1, param2) => {
    console.log("Running program 1 with parameters:", param1, param2);
    return "Program 1 result";
};
const program2 = (param1, param2) => {
    console.log("Running program 2 with parameters:", param1, param2);
    return "Program 2 result";
};

// Add programs to Cardinal
manager.add("program1", program1, ["hello", "world"]);
manager.add("program2", program2, ["foo", "bar"]);

// Create an instance of LoadBalancer
const options = {
    targets: [
        {target: 'http://localhost:3001'},
        {target: 'http://localhost:3002'}
    ],
    ports: [3001, 3002]
};

// Start the load balancer
manager.useLoadBalancer(options);

const lb = new manager.lb(options);

// Run programs
manager.run("program1");
manager.run("program2");

// Create a simple HTTP server to display the results
http.createServer((req, res) => {
    if (req.url === '/program1') {
        lb.proxy.web(req, res, { target: 'http://localhost:3001', path: req.url });
        res.writeHead(200, { 'Content-Type': 'text/html' });
        res.write('<h1>CardinalZ Load Balancer Example Program 1</h1>');
        res.write('<p>Program 1 Result: ' + manager.getStatus("program1") + '</p>');
        res.end();
    } else if (req.url === '/program2') {
        lb.proxy.web(req, res, { target: 'http://localhost:3002', path: req.url });
        res.writeHead(200, { 'Content-Type': 'text/html' });
        res.write('<h1>Cardinal Load Balancer Example Program 2</h1>');
        res.write('<p>Program 2 Result: ' + manager.getStatus("program2") + '</p>');
        res.end();
    } else {
        res.writeHead(200, { 'Content-Type': 'text/html' });
        res.write('<h1>CardinalZ Load Balancer Example</h1>');
        res.write('<p>Program 1 Result: ' + manager.getStatus("program1") + '</p>');
        res.write('<p>Program 2 Result: ' + manager.getStatus("program2") + '</p>');
        res.end();
    }
}).listen(3000);
console.log('Server running at http://localhost:3000/');
