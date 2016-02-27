'use strict';

const chalk = require('chalk');

module.exports = (text) => (
  new Promise((resolve, reject) => {
    
    let bracketStack = [];
    let buildWord = '';
    let buildJSON = '';
    let wordStart = false;
    let keyReset = true;
    let escaped = false;
    let doubleQuotesUsed = false;

    for (let c of text) {
      if (c === "\"" || c === "'") {
        if (!wordStart) {
          buildWord += c;
          wordStart = true;
          if (c === "\"") {
            doubleQuotesUsed = true;
          }
          else {
            doubleQuotesUsed = false;
          }
        }
        else {
          buildWord += c;
          if (escaped) {
            escaped = false;
          }
          else if ((c === "'" && !doubleQuotesUsed)||(c === "\"" && doubleQuotesUsed)) {
            if (keyReset) {
              buildJSON += chalk.red(buildWord);
            }
            else {
              buildJSON += chalk.green(buildWord);
            }
            buildWord = '';
            wordStart = false;
          }
        }
      }
      else if (c === "\\") {
        if (wordStart) {
          buildWord += c;
          escaped = true;
        }
        else {
          buildJSON += c;
        }
      }
      else if (c === ':') {
        if (!wordStart) {
          buildJSON += c;
          keyReset = false;
        }
        else {
          buildWord += c;
        }
      }
      else if (c === '{') {
        keyReset = true;
        buildJSON += c;
        bracketStack.push(c);
      }
      else if (c === '}') {
        if (bracketStack[bracketStack.length - 1] === '{') {
          bracketStack.pop();
        }
        buildJSON += c;
      }
      else if (c === '[') {
        buildJSON += c;
        bracketStack.push(c);
      }
      else if (c === ']') {
        if (bracketStack[bracketStack.length - 1] === '[') {
          bracketStack.pop();
        }
        buildJSON += c;
      }
      else if (c === ',') {
        if (bracketStack[bracketStack.length - 1] === '[') {
          keyReset = false;
        }
        else {
          keyReset = true;
        }
        buildJSON += c;
      }
      else {
        if (!wordStart) {
          buildJSON += c;
        }
        else {
          buildWord += c;
        }
      }
    }

    resolve(buildJSON);

  })
);
