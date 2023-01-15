class Cardinal {
    constructor() {
        this.programs = new Map();
        this.monitor = new Map();
        this.alerts = new Set();
        this.maxAllowedMemory = 1000000;
        this.maxAllowedPerformance = 1000;
        this.minPrograms = 1;
        this.maxPrograms = 10;
    }

    // Function to add a program to Cardinal
    add(name, program, dependencies) {
        if (typeof program !== "function") {
            throw new Error("Invalid program. Must be a function.");
        }
        this.programs.set(name, { program: program, dependencies: dependencies });
        this.monitor.set(name, { status: "stopped", resourceUsage: 0, performance: 0, errors: 0 });
    }

    // Function to run a program
    run(name) {
        if (!this.programs.has(name)) {
            throw new Error(`Program "${name}" not found.`);
        }
        let program = this.programs.get(name);
        let programFn = program.program;
        let dependencies = program.dependencies;
        let monitor = this.monitor.get(name);
        monitor.status = "running";
        monitor.startTime = Date.now();
        try {
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

    // Function to automatically recover from errors
    recover(name) {
        if (this.monitor.get(name).errors > 5) {
            // Restart the program
            this.remove(name);
            this.add(name, this.programs.get(name).program, this.programs.get(name).dependencies);
            this.run(name);
            this.alerts.add(`Program "${name}" has been automatically recovered.`);
        }
    }

    // Function to automatically scale the number of program instances
    scale() {
        let runningPrograms = 0;
        for (let [name, monitor] of this.monitor) {
            if (monitor.status === "running") {
                runningPrograms++;
            }
        }
        if (runningPrograms > this.maxPrograms) {
                       this.alerts.add("Too many programs are running. Scaling down...");
            for (let [name, monitor] of this.monitor) {
                if (monitor.status === "running") {
                    this.stop(name);
                    runningPrograms--;
                    if (runningPrograms <= this.minPrograms) {
                        break;
                    }
                }
            }
        } else if (runningPrograms < this.minPrograms) {
            this.alerts.add("Too few programs are running. Scaling up...");
            for (let [name, program] of this.programs) {
                if (!this.monitor.has(name) || this.monitor.get(name).status === "stopped") {
                    this.add(name, program.program, program.dependencies);
                    this.run(name);
                    runningPrograms++;
                    if (runningPrograms >= this.maxPrograms) {
                        break;
                    }
                }
            }
        }
    }

    // Function to remove a program
    remove(name) {
        this.programs.delete(name);
        this.monitor.delete(name);
    }

    // Function to stop a program
    stop(name) {
        let monitor = this.monitor.get(name);
        if (monitor && monitor.status === "running") {
            monitor.status = "stopped";
            monitor.endTime = Date.now();
        } else {
            throw new Error(`Program "${name}" is not running.`);
        }
    }

    // Function to get the status of a program
    getStatus(name) {
        if (!this.monitor.has(name)) {
            throw new Error(`Program "${name}" not found.`);
        }
        return this.monitor.get(name).status;
    }
    
    // Function to get Monitored Data
    getUsage(name) {
      if (!this.monitor.has(name)) {
            throw new Error(`Program "${name}" not found.`);
        }
        return this.monitor.get(name);
    }
}

module.exports = Cardinal;
