 const add = (parent, name, program, dependencies) => {
        if (typeof program !== "function") {
            throw new Error("Invalid program. Must be a function.");
        }
        parent.programs.set(name, { program: program, dependencies: dependencies });
        parent.monitor.set(name, { status: "stopped", resourceUsage: 0, performance: 0, errors: 0 });
    }
    
 module.exports = add