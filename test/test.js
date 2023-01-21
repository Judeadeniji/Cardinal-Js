const axios = require('axios');

// number of requests to send
const requests = 100;

// URL of the load balancer
const urls = ['http://localhost:3000/', 'http://localhost:3000/'];

// send requests

  for (let i = 0; i < requests; i++) {
urls.forEach(url => {
    axios.get(url)
        .then((response) => {
            console.log(`Request ${i} sent to ${response.request._headers.host}`);
            
          console.log(`Response: ${response.data}`);
        })
        .catch((error) => {
            console.log(error);
        });
});
}
