'use strict';

var fs = require('fs');
var async = require('async');
var request = require('request');
var cheerio = require('cheerio');
var moment = require('moment-timezone');
var logger = require('../logger/logger').logger;

var startAtMapper = {
  'Pt, 8 kwietnia,': '2016-04-08',
  'So, 9 kwietnia,': '2016-04-09',
  'Nd, 10 kwietnia,': '2016-04-10'
};

var startAtParser = function startAtParser(val) {
  if (val) {
    for (var day in startAtMapper) {
      if (startAtMapper.hasOwnProperty(day)) {
        val = val.replace(day, startAtMapper[day]);
      }
    }

    return moment(val).toISOString();
  }

  return '2016-04-08T10:00:00.000Z';
};

var minutesParser = function minutesParser(val) {
  val = val.replace('godziny', '');
  val = val.replace(', ', ':');
  val = val.replace('minut', '');

  if (val.indexOf(':') < 0) {
    val = '00:' + val;
  }

  var time = moment(val, 'HH:mm');
  return time.hours() * 60 + time.minutes();
};

var durationParser = function durationParser(startAt, minutes) {
  const start = moment(startAt);
  const endAt = moment(start).add(minutes, 'minutes');

  return {
    startAt: start.toISOString(),
    finishAt: endAt.toISOString()
  };
};

var categoriesParser = function categoriesParser(val) {
  const category = {
    parent: null,
    name: val
  };

  return [category];
};

var placesParser = function placesParser(val) {
  var places = [];

  if (val) {
    const place = {
      parent: null,
      name: val,
      openingTimes: []
    };

    places.push(place);
  }
  return places;
};

var authorsParser = function authorsParser(val) {
  if (val) {

    var author = val;
    var organization = null;

    return {
      name: author.trim(),
      organization: organization
    };
  }

  return null;
};

var parseEvent = function parseEvent(id, body, callback) {
  var $ = cheerio.load(body);

  var main = 'div.main';
  var parent = 'div.program-point';
  var data = {
    name: $('h1', main).text(),
    description: '',
    duration: null,
    authors: [],
    places: [],
    categories: [],
    metadata: [],
    images: [],
    tags: [id + '']
  };

  var children = $('div.program-point__details table tr', parent).children();

  var startAt = null;
  var duration = null;

  children.each(function (i) {
    var val = $(this).text().trim();

    switch (i) {
      case 1 :
        startAt = startAtParser(val);
        break;
      case 3 :
        duration = val;
        break;
      case 5 :
        data.places = placesParser(val);
        break;
      case 7 :
        data.categories = categoriesParser(val);
        break;
      case 9 :
        data.description = val;
        break;
      case 11 :

        $('li', this).each(function () {
          var author = $(this).text().trim();
          data.authors.push(authorsParser(author));
        });

        break;
      default:
    }

  });

  var minutes = minutesParser(duration);
  data.duration = durationParser(startAt, minutes);

  fs.appendFile('pyrkon2016.json', JSON.stringify(data) + ',', function (err) {
    if (err) {
      console.log(err);
      throw err;
    }

    //console.log('It\'s saved!');
    //console.log(err, results);
    //console.dir(data, {depth: null});
    //return callback(null, {events: results});
    return callback(null, data);
  });

  //return callback(null, data);
};

var getEventContent = function getEventContent(id, callback) {
  return request('http://pyrkon.pl/2016/program/details/' + id, function (error, response, body) {
    if (!error && response && response.statusCode === 200) {
      return parseEvent(id, body, callback);
    }

    console.log('error getEventContent: ', id, error, response ? response.statusCode : null);
    return callback(error ? error : new Error('getEventContent error'), null);
  });
};

//var importEvents = function importEvents(ids, callback) {
//  async.map(ids, getEventContent, callback);
//};

var createTasksForData = function createTasksForData(ids) {
  var tasks = {};

  for (var j in ids) {
    if (ids.hasOwnProperty(j)) {
      logger.debug('Prepare task ' + j);

      (function (id) {
        var func = function (callback) {
          logger.debug('Initiated ' + j);
          getEventContent(id, function (err, res) {

            return setTimeout(callback(err, res), 1000);

          });
        };

        tasks[id] = func;
      }(ids[j]));
    }
  }

  return tasks;
};

var importEvents = function importEvents(ids, callback) {
  var tasks = createTasksForData(ids);
  async.series(tasks, callback);
};

Array.range = function (a, b, step) {
  var A = [];
  A[0] = a;
  step = step || 1;
  while (a + step <= b) {
    A[A.length] = a += step;
  }

  return A;
};
//
//var handle = function handle(data, callback) {
//
//  importEvents(Array.range(1, 1300), function (err, results) {
//    //return callback(null, {events: results});
//  });
//};

var handle = function handle(data, callback) {

  return fs.readFile('pyrkon2016.json', function (err, content) {
    if (err) {
      console.log(err);
      throw err;
    }

    var json = JSON.parse(content);
    //console.log(json);
    //
    return callback(null, {events: json});
  });
};

module.exports = {
  parseEvent: parseEvent,
  getEventContent: getEventContent,
  importEvents: importEvents,
  handle: handle
};
