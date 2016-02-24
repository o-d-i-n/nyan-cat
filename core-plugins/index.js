'use strict';

const chalk = require('chalk')
const digitsIn = number => String(number).length;
const lineNumber = (number, maxDigits) => chalk.grey((' '.repeat(maxDigits) + number).substr(-maxDigits));

module.exports = (text) => (
  new Promise((resolve, reject) => {

    let output = text.split('\n')

    output = output.slice(0, output.length - 1)
    .map((line, number, d) => lineNumber(++number, digitsIn(d.length)) + ' ' + line)
    .join('\n');

    resolve(output);
  })
);
