'use strict';
const chalk = require('chalk');

module.exports = (text) => (
  new Promise((resolve, reject) => {
	let buildWord = ''
    let buildPython = ''
    let stringStart = false
    let doubleQuotes = false
    let commentStart = false

    let keywords = ["import" , "in"]
    let builtin = ["def" , "range"] 	

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
    	else if(a==='' && !stringStart) {
    		if(keywords.indexOf(buildWord)>=0)
    			buildPython += chalk.red(buildWord)
    		else if(builtin.indexOf(buildWord)>=0)
    			buildPython += chalk.blue(buildWord)	
    		else
    			buildPython += buildWord
    		buildPython += c
    		buildWord = ''
    	}
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
    	else {   
			buildWord += c
    	}
    }
	buildPython+=buildWord
    resolve(buildPython)
  })
);
