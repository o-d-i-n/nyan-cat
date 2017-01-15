'use strict';
const chalk = require('chalk');

module.exports = (text) => (
  new Promise((resolve, reject) => {
	let buildWord = ''
    let buildPython = ''
    let stringStart = false
    let doubleQuotes = false
    let commentStart = false
    let functionName = false
    let functionList = []
    let keywords = ["import" , "in", "for","from","if","else","try","except","not","return"]
    let builtin = ["def" , "range","print"] 	
    let bracketFlag = false
    let bracketOpenFlag = false
    for (let c of text) {
    	let a = c.trim()
        
    	if(c==="#" && !stringStart) {
    		buildPython += buildWord
    		buildWord = ''
    		buildWord += c
    		commentStart = true
    	}
    	else if(commentStart) {
    		buildWord += c
    		if(c=='\n') {
    			buildPython += chalk.grey(buildWord)
    			buildWord = ''
    			commentStart = false
    		}
    	}
    	// else if(a==='' && !stringStart) {
    	// 	if(keywords.indexOf(buildWord)>=0)
    	// 		buildPython += chalk.red(buildWord)
    	// 	else if(builtin.indexOf(buildWord)>=0)
    	// 		buildPython += chalk.blue(buildWord)	
    	// 	else
    	// 		buildPython += buildWord
    	// 	buildPython += c
    	// 	buildWord = ''
    	// }
    	else if (c === "\"" || c === "\'") {	
    		if(!stringStart) {
    			stringStart = true
    			if (c === "\"")
    				doubleQuotes = true
    			buildPython += buildWord
    			buildWord = ''
    			buildWord += c
    		}
    		else {
    			if(doubleQuotes) {
    				if (c === "\"") {
    					buildWord += c
    				    buildPython += chalk.yellow(buildWord)
    				    buildWord = ''
    				    doubleQuotes = false
    				    stringStart = false
    				}
    				else
    					buildWord += c
    			}
    			else {
    				if (c === "\'") {
    					buildWord += c
    				    buildPython += chalk.yellow(buildWord)
    				    buildWord = ''
    				    stringStart = false
    				}
    				else
    					buildWord += c	
    			}
    		}
    	}
        else if (builtin.indexOf(buildWord)>-1 && (c == " " || c == "(")){
            buildPython += chalk.blue(buildWord)
            
            buildPython += chalk.white(c)
            buildWord = ''
            if ( c === "("){
                bracketOpenFlag = true
            }

        }
        else if(keywords.indexOf(buildWord)> -1 && (c == " " || c == "(" || c == ":")){
            buildPython += chalk.red(buildWord)
            // console.log(buildWord);
            buildPython += chalk.white(c)
            buildWord = ''
            if ( c === "("){
                bracketOpenFlag = true
            }
        }
        else if (!isNaN(c) && buildWord === ''){
            buildPython += chalk.cyan(c)
            buildWord = ''
        }
        else if (c==='('){
            if(builtin.indexOf(buildWord) == -1){
                buildPython += chalk.green(buildWord);
            }
            
            buildPython += chalk.white(c)
            buildWord = ''
            bracketOpenFlag = true
        }
        else if (c === ',' && bracketOpenFlag){
            buildPython += chalk.magenta(buildWord)
            buildWord = ''
            buildPython += chalk.white(c)
        } 
        else if(c === ')'){
            if(buildWord != ''){
                buildPython += chalk.magenta(buildWord)
                buildWord = ''
                buildPython += chalk.white(c)
                bracketOpenFlag = false
            } else{
                buildPython += chalk.white(c)
                bracketOpenFlag = false
            }
        }
        
        else if(c === ':'){
            buildPython += chalk.white(c);
        }
        else if((c === " " || c === '\n') && !stringStart && !doubleQuotes && !commentStart && !bracketOpenFlag){
            buildPython += chalk.white(buildWord)
            buildPython += c
            buildWord = ''
        }
        
    	else {   
			buildWord += c

    console.log(buildWord);
    	}
    }
	buildPython+=buildWord
    resolve(buildPython)
  })
);
