#!/usr/bin/env node
var fs = require('fs')
  , chalk = require('chalk')
  , filename = process.argv[2];
fs.readFile(filename, 'utf8', function(err, data) {
  if (err) throw err;
  data = data.split('\n')
  var spaceCount = "";
  for(var i = 0;i < String(data.length).length + 2;i++)
    spaceCount += " ";
  for(itr in data) {
    if(itr == data.length - 1)
      break;
    console.log(chalk.grey(itr) + spaceCount.substr(0,spaceCount.length - String(itr).length) + data[itr]);
  }
});
