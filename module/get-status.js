const getStatus = (parent, name) => {
        if (!parent.monitor.has(name)) {
            throw new Error(`Program "${name}" not found.`);
        }
        return parent.monitor.get(name).status;
    }
 
 module.exports = getStatus