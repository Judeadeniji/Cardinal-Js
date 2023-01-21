const http = require('http');
const serviceDiscovery = {
  services: [],
  register: function(name, url) {
    this.services.push({ name, url });
    console.log(`Service ${name} has been registered with url ${url}`);
  },
  deregister: function(name) {
    this.services = this.services.filter(service => service.name !== name);
    console.log(`Service ${name} has been deregistered`);
  },
  getService: function(name) {
    return this.services.find(service => service.name === name);
  },
  healthCheck: function (serviceName, checkInterval) {
  setInterval(() => {
    serviceDiscovery.getService(serviceName, (err, service) => {
      if (err) {
        console.log(`Error getting service ${serviceName}: ${err.message}`);
      } else if (!service) {
        console.log(`Service ${serviceName} not found`);
      } else {
        http.get(getService(serviceName).url, (res) => {
          if (res.statusCode !== 200) {
            console.log(`Service ${serviceName} is unhealthy`);
            serviceDiscovery.removeService(serviceName, (err) => {
              if (err) {
                console.log(`Error removing unhealthy service ${serviceName}: ${err.message}`);
              } else {
                console.log(`Successfully removed unhealthy service ${serviceName}`);
              }
            });
          } else {
            console.log(`Service ${serviceName} is healthy`);
          }
        });
      }
    });
  }, checkInterval);
}

};

// Example usage:
serviceDiscovery.register("service1", "http://localhost:3000");
serviceDiscovery.register("service2", "http://localhost:8080");
console.log(serviceDiscovery.getService("service1"));
// Output: { name: "service1", url: "http://localhost:3000" }
serviceDiscovery.deregister("service1");
console.log(serviceDiscovery.getService("service1"));
// Output: undefined
serviceDiscovery.healthCheck("service2", 10);
// Output: Health check for service service2 returned healthy
