'use strict';
const chalk = require('chalk');

module.exports = (text) => (
  new Promise((resolve, reject) => {
    let checkScript = ''
    let scriptStart = false;
    let meowmeow = ''
    let checkContent = ''
    let buildWord = ''
    let buildML = ''
    let buildTag = ''
    let wordStart = false
    let styleStart = false
    let tagStart = false
    let commentStart = false
    let first = false
    let escaped = false
    let doubleQuotesUsed = false;

    for (let c of text) {
        if (c === "<" ) {
          tagStart = true
          first = true
      } else if (c === ">") {
          
          if(buildWord && !scriptStart)
          {
            buildTag += chalk.green(buildWord)
            buildWord = ''
          }

          if(commentStart && !scriptStart) {
            buildTag = chalk.stripColor(buildTag)
            buildTag = chalk.grey(buildTag)
          }

          buildML += buildTag

          if(checkScript==="script"){
            scriptStart = true
          }
          if(checkScript==="/script"){
            scriptStart =false
            
          }
          checkScript = ''
          
          
          tagStart = false
          commentStart = false
          wordStart = false
          buildTag = ''
      }

      if(tagStart && c!= "<" && c!=">" && !scriptStart) {
        if (c === "\"" || c === "'") {
          if (!wordStart) {
            buildWord += c
            wordStart = true
            if (c === "\"") {
              doubleQuotesUsed = true
            } else {
              doubleQuotesUsed = false
            }
          } 
          else {
            buildWord += c
            if (escaped) {
              escaped = false
            } else if ((c == "'" && !doubleQuotesUsed)||(c == "\"" && doubleQuotesUsed)) {
              if (styleStart) {
                buildTag += chalk.blue(buildWord)
                styleStart = false
              } else {
              buildTag += chalk.yellow(buildWord)
              }
              buildWord = ''
              wordStart = false
            }
          }
        } else if (c === "\\") {
          if (wordStart) {
            buildWord += c
            if (escaped) {
              escaped = false
            } 
            else {
              escaped = true
            }
          } 
          else {
            buildTag += c
           }
        } else if (c === "=") {
            if(wordStart) {
                buildWord +=c
                if (escaped)
                  escaped = false
              } else {
                buildTag += chalk.green(buildWord)
                buildTag += chalk.white(c)
                wordStart=false
                if(buildWord==="style")
                  styleStart=true
                buildWord=''
              }
        } else if (c == ' ') {
          if(wordStart)
            buildWord += c
          else {
            if (first) {
              buildTag += c
              first = false
              wordStart = true
            } else
                buildWord += c
                buildTag += chalk.green(buildWord)
                buildWord = ''
                wordStart = false
            }
        } else if (c === "!") {
            if(first){
              buildTag += c
              commentStart = true  
            } else {
              buildWord += c
            }
        } else {
          if (first) {
              buildTag += chalk.red(c)
              checkScript+=c
          } else {
            buildWord += c
            if (escaped) {
              escaped = false
            }
          }
        }

      }
      
      else if(scriptStart)
      {
        if(c==='<' || c==='>')
          {buildML+= chalk.magenta(c)
            checkContent = ''
          }
        
        else
         { buildML += chalk.white(c)
          if(c===' '|| c==='\n')
              checkContent = ''
          else
            checkContent +=c
          if(checkContent == "/script"){
              scriptStart = false;
              buildML = buildML.slice(0,-82)
              buildML+= chalk.red(checkContent)
              meowmeow = "MEOWMOFOMEOW"
              checkContent = ''}

         }
        

      }
      else{
        
          buildML += chalk.magenta(c)
      }
    }
    buildML += "\n"
    buildML += meowmeow;
    buildML += checkContent;

    resolve(buildML)
  })
);