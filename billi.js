#!/usr/bin/env node
'use strict';

const fs = require('fs');
const chalk = require('chalk')
const usage = `Usage: billi [filename]`;

const digitsIn = number => String(number).length;
const lineNumber = (number, maxDigits) => chalk.grey((' '.repeat(maxDigits) + number).substr(-maxDigits));

const billi = (filename, cb) => {

  if (typeof cb === 'undefined') { cb = console.log; }

  let output = '';

  fs.readFile(filename, 'utf8', (err, data) => {
    if (err) throw err;

    output = data.split('\n')
    output = output.slice(0,output.length - 1)
    .map((line, number, d) => lineNumber(++number, digitsIn(d.length)) + ' ' + line)
    .join('\n');

    cb(output);
  });

};

if (process.argv.length < 3) { console.log(usage); } else { billi(process.argv[2]); }
