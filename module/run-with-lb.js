const lb = require('./lb');


    // Function to set the load balancer options
   const setLoadBalancerOptions = (options) => {
        this.loadBalancer = lb.createLoadBalancer(options);
    }

    // Function to run a program with load balancing
   const runWithLoadBalancer = (name, req, res) => {
        if (!this.programs.has(name)) {
            throw new Error(`Program "${name}" not found.`);
        }
        if (!this.loadBalancer) {
            throw new Error(`Load balancer options not set.`);
        }
        let program = this.programs.get(name);
        let programFn = program.program;
        let dependencies = program.dependencies;
        let monitor = this.monitor.get(name);
        monitor.status = "running";
        monitor.startTime = Date.now();
        try {
            lb.handleRequest(req, res, this.loadBalancer.balancer);
            let resourcesStart = process.memoryUsage().heapUsed;
            let programResult = programFn(...dependencies);
            let resourcesEnd = process.memoryUsage().heapUsed;
            monitor.resourceUsage = resourcesEnd - resourcesStart;
            monitor.status = "success";
            monitor.endTime = Date.now();
            if (monitor.resourceUsage > this.maxAllowedMemory) {
                this.alerts.add(`Program "${name}" exceeded the maximum allowed memory usage threshold`);
            }
            return programResult;
        } catch (err) {
            monitor.status = "error";
            monitor.errors++;
            console.error(`Error running program "${name}": ${err}`);
            this.alerts.add(`Error running program "${name}": ${err}`);
// Function to automatically recover from errors
this.recover(name);
        // Function to automatically scale the number of program instances
        this.scale();
    }
}


module.exports = {
  runWithLoadBalancer,
  setLoadBalancerOptions
}
