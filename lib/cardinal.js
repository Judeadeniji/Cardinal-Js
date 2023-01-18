const add = require('../module/add');
const run = require('../module/run');
const recover = require('../module/recover');
const remove = require('../module/remove');
const scale = require('../module/scale');
const stop = require('../module/stop');
const getStatus = require('../module/get-status');
const getUsage = require('../module/get-usage');
const lb = require('../module/lb');

class Cardinal {
    constructor(options = {}) {
        this.programs = new Map();
        this.monitor = new Map();
        this.alerts = new Set();
        this.lb = lb;
        this.maxAllowedMemory = options.maxAllowedMemory || 1000000;
        this.maxAllowedPerformance = options.maxAllowedPerformance || 1000;
        this.minPrograms = options.minPrograms || 1;
        this.maxPrograms = options.maxPrograms || 10;
    }
    
    
        // Function to add a program to Cardinal
    add(name, program, dependencies) {
     return add(this, name, program, dependencies);
    }
    
    useLoadBalancer(config) {
      this.lb.start(config);
      return this.lb;
    }
    
    // Function to run a program
    run(name, options = {}) {
     return run(this, name, options);
    }
    
    // Function to automatically recover from errors
    recover(name) {
      recover(this, name);
    }
    
    // Function to automatically scale the number of program instances
    scale() {
      scale(this)
    }
    
    // Function to remove a program
    remove(name) {
      remove(this, name)
    }
    
    // Function to stop a program
    stop(name) {
      stop(this, name)
    }
    
    // Function to get the status of a program
    getStatus(name) {
     return getStatus(this, name);
    }
    
    // Function to get Monitored Data
    getUsage(name) {
      return getUsage(this, name);
    }
}

module.exports = Cardinal;