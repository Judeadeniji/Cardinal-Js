const express = require('express');
const Cardinal = require('../lib/cardinal');
const cardinal = new Cardinal();
// Configuration object
const config = {
    backendServer: {
        port: 8000,
        count: 5
    }
};

const loadBalancer = cardinal.useLoadBalancer(config);

const app = express();

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
