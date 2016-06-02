'use strict';
const chalk = require('chalk');

module.exports = (text) => (
  new Promise((resolve, reject) => {

    let buildWord = '';
    let buildML = '';
    let buildTag = '';
    let wordStart = false;
    let styleStart = false;
    let tagStart = false;
    let commentStart = false;
    let first = false;
    let escaped = false;
    let doubleQuotesUsed = false;

    for (let c of text) {
      if (c === "<") {
          tagStart = true;
          first = true;
      } else if (c === ">") {
          
          if(buildWord)
          {
            buildTag += chalk.green(buildWord);
            buildWord = '';
          }

          if(commentStart) {
            buildTag = chalk.stripColor(buildTag);
            buildTag = chalk.grey(buildTag); 
          }
          buildML += buildTag;
          tagStart = false;
          commentStart = false;
          wordStart = false;
          buildTag = '';
      }

      if(tagStart && c!= "<" && c!=">") {

        if (c === "\"" || c === "'") {
          if (!wordStart) {
            buildWord += c;
            wordStart = true;
            if (c === "\"") {
              doubleQuotesUsed = true;
            } else {
              doubleQuotesUsed = false;
            }
          } 
          else {
            buildWord += c;
            if (escaped) {
              escaped = false;
            } else if ((c == "'" && !doubleQuotesUsed)||(c == "\"" && doubleQuotesUsed)) {
              if (styleStart) {
                buildTag += chalk.blue(buildWord);
                styleStart = false;
              } else {
              buildTag += chalk.yellow(buildWord);
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
            } 
            else {
              escaped = true;
            }
          } 
          else {
            buildTag += c;
           }
        } else if (c === "=") {
            if(wordStart) {
                buildWord +=c;
                if (escaped)
                  escaped = false;
              } else {
                buildTag += chalk.green(buildWord);
                buildTag += chalk.white(c);
                wordStart=false;
                if(buildWord==="style")
                  styleStart=true;
                buildWord='';
              }
        } else if (c == ' ') {
          if(wordStart)
            buildWord += c;
          else {
            if (first) {
              buildTag += c;
              first = false;
              wordStart = true;
            } else
                buildWord += c;
                buildTag += chalk.green(buildWord);
                buildWord = '';
                wordStart = false;
            }
        } else if (c === "!") {
            if(first){
              buildTag += c;
              commentStart = true;  
            } else {
              buildWord += c;
            }
        } else {
          if (first) {
              buildTag += chalk.red(c);
          } else {
            buildWord += c;
            if (escaped) {
              escaped = false;
            }
          }
        }

      }
      else{
        buildML += chalk.magenta(c);
      }

    }

    resolve(buildML);
  })
);
