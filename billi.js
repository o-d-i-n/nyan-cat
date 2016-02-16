#!/usr/bin/env node
'use strict';

const fs = require('fs');
const chalk = require('chalk')
const usage = `Usage: billi [filename]`;

const purr = (filename, cb) => {

  if (typeof cb === 'undefined') { cb = console.log; }

  let output = '';

  fs.readFile(filename, 'utf8', (err, data) => {
    if (err) throw err;

    output = data.split('\n')
    .map((line, number) => chalk.grey(number + 1) + '  ' + line)
    .join('\n');
    
    // Always explain when you use for loop.
    //data = data.split('\n')
    //let spaceCount = "";

    //for(let i = 0; i < String(data.length).length + 2; i++) { spaceCount += " "; }
    //for(let itr in data) {
      //if(itr == data.length - 1)
        //break;
      //output += (chalk.grey(itr) + spaceCount.substr(0,spaceCount.length - String(itr).length) + data[itr]) + (itr === data.length - 2 ? '' : '\n');
    //}

    cb(output);
  });

};

if (process.argv.length < 3) { console.log(usage); } else { purr(process.argv[2]); }
