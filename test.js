const axios = require('axios');

// number of requests to send
const requests = 100;

// URL of the load balancer
const url = 'http://localhost:8080/';

// send requests
for (let i = 0; i < requests; i++) {
    axios.get(url)
        .then((response) => {
            console.log(`Request ${i} sent to ${response.request._headers.host}`);
            
          console.log(`Response: ${response.data}`);
        })
        .catch((error) => {
            console.log(error);
        });
}
