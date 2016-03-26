var fs = require('fs');
var async = require('async');
var request = require('request');
var cheerio = require('cheerio');
var moment = require('moment-timezone');

var startAtMapper = {
  'Pt, 8 kwietnia,': '2016-04-08',
  'So, 9 kwietnia,': '2016-04-09',
  'Nd, 10 kwietnia,': '2016-04-10'
};

var startAtParser = function startAtParser(val) {
  if (val) {
    for (var day in startAtMapper) {
      val = val.replace(day, startAtMapper[day]);
    }

    return moment(val).toISOString();
  }

  console.log('return default start date');
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

  console.log(id + ', ' + data.name);

  var children = $('div.program-point__details table tr', parent).children();

  var startAt = null;
  var duration = null;

  children.each(function (i, elem) {
    //console.log(i);
    var val = $(this).text().trim();
    //console.log(val);

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

        $('li', this).each(function (j, li) {
          var author = $(this).text().trim();
          data.authors.push(authorsParser(author))
        });

        break;
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
  request('http://pyrkon.pl/2016/program/details/' + id, function (error, response, body) {
    if (!error && response && response.statusCode == 200) {
      return parseEvent(id, body, callback);
    }
    else {
      console.log('error getEventContent: ', id, error, response ? response.statusCode : null);
    }
  });
};

var importEvents = function importEvents(ids, callback) {
  async.map(ids, getEventContent, callback);
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

var handle = function handle(data, callback) {

  importEvents(Array.range(134, 200), function (err, results) {
    return callback(null, {events: results});
  });
};

module.exports = {
  parseEvent: parseEvent,
  getEventContent: getEventContent,
  importEvents: importEvents,
  handle: handle
};
