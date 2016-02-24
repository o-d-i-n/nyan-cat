#!/usr/bin/env node
'use strict';

const fs = require('fs');
const usage = `Usage: billi [filename]`;
const availablePlugins = ['json'];

const ext = filename => filename.split('.').splice(-1)[0];
const billi = (filename, cb) => {

  if (typeof cb === 'undefined') { cb = console.log; }

  fs.readFile(filename, 'utf8', (err, text) => {
    if (err) throw err;

    let output = '';
    let plugin = require(`${__dirname}/core-plugins`);

    if (availablePlugins.indexOf(ext(filename)) > -1) { plugin = require(`${__dirname}/core-plugins/${ext(filename)}`); }

    plugin(text)
    .then(cb)
    .catch(e => console.log('Error: ', e));
  });

};

if (process.argv.length < 3) { console.log(usage); } else { billi(process.argv[2]); }
