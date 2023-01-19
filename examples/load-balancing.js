const express = require('express');
const Cardinal = require('../lib/cardinal');
const cardinal = new Cardinal();
// Configuration object
const config = {
    proxyServer: {
        port: 8000,
        count: 5
    }
};

const loadBalancer = cardinal.useLoadBalancer(config);

const server = () => {
  return express();
};

cardinal.add("server", server, []);

const app = cardinal.run("server");

app.get('/', (req, res) => {
    res.write("home page");
    res.end();
    loadBalancer.loadBalancer(req, res);
});

app.get('/about', (req, res) => {
    res.write("about page");
    res.end();
    loadBalancer.loadBalancer(req, res);
});

app.listen(8080, () => {
    console.log('App listening on port 8080');
});
