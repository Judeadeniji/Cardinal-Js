const Cardinal = require('./lib/cardinal');
const cardinal = new Cardinal();
const os = require('os');
const http = require('http');
const uptime = os.uptime();

// Function to get memory usage
const getMemoryUsage = () => {
    const used = process.memoryUsage().heapUsed / 1024 / 1024;
    const total = os.totalmem() / 1024 / 1024;
    return `${Math.round(used * 100) / 100}MB / ${Math.round(total * 100) / 100}MB`;
};

const getUptime = () => {
    const seconds = Math.floor(uptime % 60);
    const minutes = Math.floor((uptime / 60) % 60);
    const hours = Math.floor((uptime / (60 * 60)) % 24);
    const days = Math.floor(uptime / (60 * 60 * 24));
    return `${days} days ${hours} hours ${minutes} minutes ${seconds} seconds`;
};

// HTTP server function
const serverFunc = (port) => {
    const server = http.createServer((req, res) => {
        res.writeHead(200, { 'Content-Type': 'text/html' });
        res.write(`<h1>Server Details</h1>`);
        res.write(`<p>OS Type: ${os.type()}</p>`);
        res.write(`<p>OS Platform: ${os.platform()}</p>`);
        res.write(`<p>OS Arch: ${os.arch()}</p>`);
        res.write(`<p>OS Release: ${os.release()}</p>`);
        res.write(`<p>CPUs: ${os.cpus().length}</p>`);
               res.write(`<p>Memory usage: ${getMemoryUsage()}</p>`);
        res.write(`<p>Server Uptime: ${getUptime()}</p>`);
        res.write(`<p>Server status: Running</p>`);
        res.end();
    });
    server.listen(port, () => {
        console.log(`Server running on port ${port}`);
    });
};

cardinal.add("server", serverFunc, [3000]);
console.log(cardinal.run("server"));
