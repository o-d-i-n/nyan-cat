'use strict';
const chalk = require('chalk');

module.exports = (text) => (
  new Promise((resolve, reject) => {
	let buildWord = ''
    let buildPython = ''
    let list = ["def" , "in"]
    for (let c of text) {
    	let a = c.trim()
    	if(a==='')
    	{
    		console.log("def" in list)
    		if(list.indexOf(buildWord)>=0)
    			buildPython += chalk.red(buildWord)
    		else
    			buildPython += buildWord
    		buildPython += c
    		buildWord = ''
    	}
    	else 
		{   
			buildWord += c
    	}
    }
	buildPython+=buildWord
    resolve(buildPython)
  })
);
