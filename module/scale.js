const scale = (parent) => {
        let runningPrograms = 0;
        for (let [name, monitor] of parent.monitor) {
            if (monitor.status === "running") {
                runningPrograms++;
            }
        }
        if (runningPrograms > parent.maxPrograms) {
                       parent.alerts.add("Too many programs are running. Scaling down...");
            for (let [name, monitor] of parent.monitor) {
                if (monitor.status === "running") {
                    parent.stop(name);
                    runningPrograms--;
                    if (runningPrograms <= parent.minPrograms) {
                        break;
                    }
                }
            }
        } else if (runningPrograms < parent.minPrograms) {
            parent.alerts.add("Too few programs are running. Scaling up...");
            for (let [name, program] of parent.programs) {
                if (!parent.monitor.has(name) || parent.monitor.get(name).status === "stopped") {
                    parent.add(name, program.program, program.dependencies);
                    parent.run(name);
                    runningPrograms++;
                    if (runningPrograms >= parent.maxPrograms) {
                        break;
                    }
                }
            }
        }
    }
module.exports = scale