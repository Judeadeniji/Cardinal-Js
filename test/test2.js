const axios = require("axios");
const async = require("async");

const concurrency = 100;
const requests = 1000;

let successCount = 0;
let failureCount = 0;
let responseTime = 0;

async.times(
  requests,
  (n, next) => {
    axios
      .get("http://localhost:3000/")
      .then((response) => {
        successCount++;
        responseTime += response.headers["x-response-time"];
        next();
      })
      .catch((error) => {
        failureCount++;
        next();
      });
  },
  (err) => {
    if (err) throw err;
    console.log(`Successful Requests: ${successCount}`);
    console.log(`Failed Requests: ${failureCount}`);
    if (successCount !== 0) {
      console.log(`Average Response Time: ${responseTime / successCount}ms`, `\n Response time is: ${responseTime}`);
    } else {
      console.log("No successful requests");
    }
  }
);
