#!/usr/bin/env node
'use strict';

var fs = require('fs');
var config = require('config');
var program = require('commander');
var meta = require('./lib/meta');
var index = require('./lib/index');
var moment = require('moment-timezone');
var template = function () {
  throw new Error('Template not set');
};

program
  .version(meta.VERSION)
  .usage('[options] -f <swagger file> -o <output>')
  .option('-f, --file [file]', 'Path to json data file', 'data.json')
  .option('-t, --template [template]', 'template file name', './lib/templates/template01.js')
  .option('-n, --name [name]', 'festival name', 'festival-name')
  .option('-tz, --timezone [timezone]', 'timezone for dates import', 'Europe/Warsaw')
  .option('-tp, --type [type]', 'type of import', 'festival')
  .option('-u, --user [user]', 'user name')
  .option('-p, --password [password]', 'user name')
  .parse(process.argv);

if (!program.file) {
  throw new Error('Invalid json file path: ' + program.file);
}

if (!program.template) {
  throw new Error('Invalid template path: ' + program.template);
}

if (!program.name) {
  throw new Error('Invalid festival name: ' + program.name);
}

if (!program.user || !program.password) {
  throw new Error('user and password are required to import festival');
}

if (!config.token) {
  throw new Error('Missing config.token value');
}

template = require(program.template);

moment.tz.setDefault(program.timezone);

fs.readFile(program.file, function (err, data) {
  if (err) {
    throw err;
  }

  if (!data) {
    throw new Error('Invalid json data file: ' + program.file);
  }

  var json = JSON.parse(data);

  //console.dir(json, {depth: null});

  var func = function () {
  };

  switch (program.type) {
    case 'festival':
      func = index.importFestival;
      break;
    case 'news':
      func = index.importNews;
      break;
    default:
      throw new Error('Unsupported program.type: ' + program.type);
  }

  func(program.name, template, json, config.token, function (funcErr, result) {

    if (funcErr) {
      console.log('err', funcErr);
      throw funcErr;
    }

    console.log('result');
    console.dir(result, {depth: null});
  });
});