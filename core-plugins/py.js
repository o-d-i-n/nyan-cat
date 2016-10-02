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
    let keywords = ["import" , "in"]
    let builtin = ["def" , "range"] 	
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
        else if( c.charAt(c.length-1) == '(' || c.charAt(c.length-1) == ')' || builtin.indexOf(c) > -1){
            let appendString
            if(c.charAt(c.length-1) == '(' || c.charAt(c.length-1) == ')'){
                bracketFlag = true;
                if(c.charAt(c.length-1) == '('){
                    c = c.substring(0,c.length-1)
                    appendString = "("
                    bracketOpenFlag = true
                }
                else if(!bracketOpenFlag){
                    c = c.substring(0,c.length-2)
                    appendString = "()"
                }


            }
            buildWord += c;
            if(bracketFlag && builtin.indexOf(c) > -1){
                
                buildPython+= chalk.blue(buildWord);
                
                buildPython += chalk.white(appendString);
            }
            else if(bracketFlag && bracketOpenFlag){
                buildPython += chalk.green(buildWord);
                buildWord += chalk.white(appendString);
                functionName.push(buildWord)
            }
            else if( builtin.indexOf(c)>-1){
                buildPython += chalk.blue(buildWord);
            }
            buildWord = ''
            bracketFlag = false

        }
        else if(bracketOpenFlag){
            bracketOpenFlag = false
            let words = []
            if(c.charAt(c.length-1) == ')')
            {
                c = c.substring(0,c.length-1)
                bracketFlag = true;
            }
            let whileFlag = true
            while(whileFlag){
                let commaIndex = -1
                if(c.includes(",")){
                    commaIndex = c.indexOf(",")
                    words.push(c.substring(0,commaIndex))
                    c = c.substring(commaIndex+1, c.length);

                }
                else{
                    whileFlag = false
                }
            }
            let lastWord = words[words.length-1]
            for (x in words){
                buildWord += x
                buildPython+= chalk.orange(buildWord);
                buildWord = ''
                if(x != lastWord){
                    buildPython += chalk.white(",");
                }
            }
            if(bracketFlag){
                buildPython += chalk.white(")");
            }
        }
        else if(keywords.indexOf(c) > -1){
            buildWord += 'c'
            buildPython += chalk.red(buildWord);
            buildWord = '' 
        }
        
    	else {   
			buildWord += c
    	}
    }
	buildPython+=buildWord
    resolve(buildPython)
  })
);
