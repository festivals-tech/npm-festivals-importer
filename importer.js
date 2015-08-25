#!/usr/bin/env node
var fs = require('fs');
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
  }

  func(program.name, template, json, function (err, result) {

    if (err) {
      console.log('err', err);
      throw err;
    }

    console.log('result');
    console.dir(result, {depth: null});
  });
});
