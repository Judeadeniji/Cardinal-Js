const recover = (parent, name) => {
        if (parent.monitor.get(name).errors > 5) {
            // Restart the program
            parent.remove(name);
            parent.add(name, parent.programs.get(name).program, parent.programs.get(name).dependencies);
            parent.run(name);
            parent.alerts.add(`Program "${name}" has been automatically recovered.`);
        }
    }
    
module.exports = recover;