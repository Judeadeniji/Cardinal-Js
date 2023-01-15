const remove = (parent, name) => {
        parent.programs.delete(name);
        parent.monitor.delete(name);
    }
    
 module.exports = remove