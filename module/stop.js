const stop = (parent, name) => {
        let monitor = parent.monitor.get(name);
        if (monitor && monitor.status === "running") {
            monitor.status = "stopped";
            monitor.endTime = Date.now();
        } else {
            throw new Error(`Program "${name}" is not running.`);
        }
    }
module.exports = stop;