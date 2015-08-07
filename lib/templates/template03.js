var fs = require('fs');
var async = require('async');
var request = require('request');
var cheerio = require('cheerio');
var moment = require('moment-timezone');

var dataMapper = {
  termin: 'startAt',
  'czas trwania': 'minutes',
  blok: 'categories',
  miejsce: 'places'
};

var startAtMapper = {
  czw: '2015-08-20',
  pt: '2015-08-21',
  sob: '2015-08-22',
  nd: '2015-08-23'
};

var startAtParser = function startAtParser(val) {
  if (val) {
    val = val.replace('  ', ' ');

    for (var day in startAtMapper) {
      val = val.replace(day, startAtMapper[day]);
    }
    return moment(val).toISOString();
  }

  return null;
};

var minutesParser = function minutesParser(val) {
  var time = moment(val, 'HH:mm min');
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
  var result = [];
  if (val) {
    var re = /(, | i | oraz )/;
    var authors = val.split(re).filter(function (el) {
      return el !== ', ' && el !== ' i ' && el !== ' oraz ';
    });

    for (var i in authors) {
      var author = authors[i];
      var organization = null;


      var split = author.split(' - ');

      if (split.length > 1) {
        author = split[1];
        organization = split[0];
      }

      var el = {
        name: author.trim(),
        organization: organization
      };
      result.push(el);
    }
  }
  return result;
};

var parseEvent = function parseEvent(id, body, callback) {
  var $ = cheerio.load(body);

  var data = {
    name: $('h1', 'div.content').text(),
    description: '',
    duration: null,
    authors: [],
    places: [],
    categories: [],
    metadata: [],
    images: [],
    tags: [id + '']
  };

  var authors = $('strong', 'div.content').text();

  data.authors = authorsParser(authors);

  var children = $('p', 'div.content').children();

  children.each(function (i, elem) {
    var text = $(this).text();
    text = text.replace(':', '').trim();

    var val = '';

    var el = $(this)[0];
    if (el.hasOwnProperty('next') && el.next && el.next.hasOwnProperty('data')) {
      val = el.next.data;
    }

    if (undefined === val) {
      val = '';
    }

    val = val.trim();

    if (!val) {
      val = null;
    }

    if (text) {
      var key = dataMapper[text];

      switch (key) {
        case 'startAt':
          val = startAtParser(val);
          break;
        case 'minutes':
          val = minutesParser(val);
          break;
        case 'categories':
          val = categoriesParser(val);
          break;
        case 'places':
          val = placesParser(val);
          break;
      }

      data[key] = val;
    }
  });

  var prev = children.last()[0].prev;

  if (prev.prev.prev.data) {
    data.description = prev.prev.prev.data.trim();
  }

  if (prev.prev.data) {
    data.description += prev.prev.data.trim();
  }

  if (prev.data) {
    data.description += prev.data.trim();
  }

  if (data.startAt && data.minutes) {
    data.duration = durationParser(data.startAt, data.minutes);
  }

  return callback(null, data);
};

var getEventContent = function getEventContent(id, callback) {
  request('http://polcon2015.org/index.php?go2=event&id=' + id, function (error, response, body) {
    if (!error && response.statusCode == 200) {
      return parseEvent(id, body, callback);
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

  importEvents(Array.range(1, 485), function (err, results) {
    return callback(null, {events: results});
  });
};

module.exports = {
  parseEvent: parseEvent,
  getEventContent: getEventContent,
  importEvents: importEvents,
  handle: handle
};

//importEvents(Array.range(1, 485), function (err, results) {
//  fs.writeFile('polcon2015.json', JSON.stringify(results), function (err) {
//    if (err) {
//      throw err;
//    }
//
//    console.log('It\'s saved!');
//    //console.log(err, results);
//  });
//
//});