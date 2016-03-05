'use strict';
const chalk = require('chalk');

module.exports = (text) => (
  new Promise((resolve, reject) => {

    text = JSON.stringify(JSON.parse(text), null, 2);
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
          } else {
            doubleQuotesUsed = false;
          }
        } else {
          buildWord += c;
          if (escaped) {
            escaped = false;
          } else if ((c === "'" && !doubleQuotesUsed)||(c === "\"" && doubleQuotesUsed)) {
            if (keyReset) {
              buildJSON += chalk.red(buildWord);
            } else {
              buildJSON += chalk.green(buildWord);
            }
            buildWord = '';
            wordStart = false;
          }
        }
      } else if (c === "\\") {
        if (wordStart) {
          buildWord += c;
          if (escaped) {
            escaped = false;
          } else {
            escaped = true;
          }
        } else {
          buildJSON += c;
        }
      } else if (c === ':') {
        if (!wordStart) {
          buildJSON += c;
          keyReset = false;
        } else {
          buildWord += c;
          if (escaped) {
            escaped = false;
          }
        }
      } else if (c === '{') {
        if (!wordStart) {
          keyReset = true;
          buildJSON += c;
          bracketStack.push(c);
        } else {
          buildWord += c;
          if (escaped) {
            escaped = false;
          }
        }
      } else if (c === '}') {
        if (!wordStart) {
          if (bracketStack[bracketStack.length - 1] === '{') {
            bracketStack.pop();
          }
          buildJSON += c;
        } else {
          buildWord += c;
          if (escaped) {
            escaped = false;
          }
        }
      } else if (c === '[') {
        if (!wordStart) {
          buildJSON += c;
          bracketStack.push(c);
        } else {
          buildWord += c;
          if (escaped) {
            escaped = false;
          }
        }
      } else if (c === ']') {
        if (!wordStart) {
          if (bracketStack[bracketStack.length - 1] === '[') {
            bracketStack.pop();
          }
          buildJSON += c;
        } else {
          buildWord += c;
          if (escaped) {
            escaped = false;
          }
        }
      } else if (c === ',') {
        if (!wordStart) {
          if (bracketStack[bracketStack.length - 1] === '[') {
            keyReset = false;
          } else {
            keyReset = true;
          }
          buildJSON += c;
        } else {
          buildWord += c;
          if (escaped) {
            escaped = false;
          }
        }
      } else {
        if (!wordStart) {
          buildJSON += c;
        } else {
          buildWord += c;
          if (escaped) {
            escaped = false;
          }
        }
      }
    }

    resolve(buildJSON);
  })
);
