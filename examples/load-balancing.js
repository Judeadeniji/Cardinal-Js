const express = require("express");
const Cardinal = require("../lib/cardinal");
const cardinal = new Cardinal();
// Configuration object
const config = {
  loadServer: {
    port: 8000,
    count: 5,
  },
};

const loadBalancer = cardinal.loadBalancer;

const server = () => {
  return express();
};

cardinal.add("server", server, []);

const app = cardinal.run("server");

const requestHandler = (req, res) => {
  res.write(`You're now at ${req.url}`);
  res.end();
};

app.get("/", (req, res) => {
  loadBalancer.balance(req, res);
});

app.get("/about", (req, res) => {
  loadBalancer.balance(req, res);
});

app.listen(8080, () => {
  console.log("App listening on port 8080");
  loadBalancer.start(config, requestHandler);
});
