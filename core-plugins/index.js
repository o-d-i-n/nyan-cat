'use strict';

const chalk = require('chalk');
const digitsIn = number => String(number).length;
const lineNumber = (number, maxDigits) => chalk.dim((' '.repeat(maxDigits) + number).substr(-maxDigits));

module.exports = (text) => (
  new Promise((resolve, reject) => {

    let output = text.trim().split('\n');

    output = output.map((line, number, d) => lineNumber(++number, digitsIn(d.length)) + ' ' + line).join('\n');

    resolve(output);
  })
);
