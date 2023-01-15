Cardinal-Js
========

Cardinal is a Node.js class that allows you to containerize your Node.js programs, monitor their performance, and handle errors.

Installation
------------

To install Cardinal, you can use npm:

      `npm install cardinal`
    

or, if you prefer yarn:

      `yarn add cardinal`
    

Usage
-----

First, you'll need to import Cardinal:

      `const Cardinal = require('cardinal');`
    

Then, you can create an instance of the Cardinal class:

      `const cardinal = new Cardinal();`
    

You can then add a program to Cardinal using the `add()` method. The method takes three arguments: the name of the program, the program itself (as a function), and an array of dependencies:

      `const myProgram = (arg1, arg2) => {           // program logic         }         cardinal.add('myProgram', myProgram, [arg1,arg2]);`
      
    

You can then run the program using the `run()` method:

            `cardinal.run('myProgram');`
    

You can also remove a program using the `remove()` method:

      `cardinal.remove('myProgram');`
    

The class also includes methods for handling errors and scaling:

*   `recover(name)`: Automatically recover from errors
*   `scale()`: Automatically scale the number of program instances

Additionally, Cardinal keeps track of the status, resource usage, and performance of each program, and it maintains a set of alerts.

Please note that this is a simplified example and the library is not yet available for installation.