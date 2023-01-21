#!/data/data/com.termux/files/home/storage/Cardinal-Js/bin/env node

const commander = require("commander");
const Cardinal = require("../lib/cardinal");

const cardinal = new Cardinal();

commander
  .version('1.0.0')
  .description('A tool to manage and run programs in a safe and efficient environment.');

commander
  .command('add <name> <file>')
  .alias('a')
  .description('Add a program to Cardinal')
  .action((name, file) => {
    let program;
    try {
      program = require(file);
    } catch (err) {
      console.error(`Error adding program "${name}": ${err}`);
      process.exit(1);
    }
    cardinal.add(name, program);
    console.log(`Program "${name}" added.`);
  });

commander
  .command('remove <name>')
  .alias('r')
  .description('Remove a program from Cardinal')
  .action((name) => {
    cardinal.remove(name);
    console.log(`Program "${name}" removed.`);
  });

commander
  .command('run <name>')
  .alias('rn')
  .description('Run a program')
  .action((name) => {
    let status = cardinal.status(name);
    if (status === 'running') {
      console.log(`Program "${name}" is already running.`);
    } else {
      cardinal.run(name);
      console.log(`Program "${name}" is running.`);
    }
  });

commander
  .command('status <name>')
  .alias('s')
  .description('Check the status of a program')
  .action((name) => {
    let status = cardinal.status(name);
    console.log(`Program "${name}" is ${status}.`);
  });

commander
  .command('resource-usage <name>')
  .alias('ru')
  .description('Check the resource usage of a program')
  .action((name) => {
    let usage = cardinal.resourceUsage(name);
    console.log(`Program "${name}" is using ${usage} bytes of memory.`);
  });


commander.parse(process.argv);
