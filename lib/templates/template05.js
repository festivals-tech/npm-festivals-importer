'use strict';

var GoogleSpreadsheet = require('google-spreadsheet');
var creds = require('../../google-generated-creds.json');
var moment = require('moment-timezone');

var days = [
  '2015-09-05',
  '2015-09-06'
];

var durationParser = function durationParser(x, y, map) {

  var day = days[0];

  if (x > 36) {
    day = days[1];
  }

  var start = moment(day + ' ' + map[x][1]);
  var endAt = '';

  if (map[x + 2][y] || !map[x + 4][1]) {
    endAt = moment(day + ' ' + map[x + 2][1]);
  }
  else {
    endAt = moment(day + ' ' + map[x + 4][1]);
  }

  return {
    startAt: start.toISOString(),
    finishAt: endAt.toISOString()
  };
};


var categoriesParser = function categoriesParser(val) {
  var categories = [];

  if (val) {
    const category = {
      parent: null,
      name: val
    };

    categories.push(category);
  }
  return categories;
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

    var authors = val.split(',');

    for (var i in authors) {
      if (authors.hasOwnProperty(i)) {
        var el = {
          name: authors[i].trim(),
          organization: null
        };
        result.push(el);
      }
    }
  }
  return result;
};


var parseEvent = function parseEvent(x, y, map) {
  //console.log('parseEvent', x, y);

  if (!map[x][y]) {
    console.log('skip parseEvent', x, y);
    return null;
  }

  return {
    name: map[x][y],
    description: map[x + 1][y] || 'TODO',
    duration: durationParser(x, y, map),
    authors: authorsParser(map[x][y + 1]),
    places: placesParser(map[4][y]),
    categories: categoriesParser(map[4][y]),
    metadata: [],
    images: [],
    tags: []
  };

};

var parseEvents = function parseEvents(map, callback) {
  //console.dir(map, {depth: null});

  var events = [];

  var event = null;

  for (var x = 8; x < 31; x += 2) {
    for (var y = 2; y < 9; y += 2) {
      event = parseEvent(x, y, map);
      if (event) {
        events.push(event);
      }
    }
  }

  for (var xx = 37; xx < 56; xx += 2) {
    for (var yy = 2; yy < 7; yy += 2) {
      event = parseEvent(xx, yy, map);

      if (event) {
        events.push(event);
      }
    }
  }

  return callback(null, events);
};

var getEventsContent = function getEventsContent(callback) {
  var my_sheet = new GoogleSpreadsheet('1Zt-mVPGRB-j93ID-Xr4-7cUplj_t-yv7PE9_3aOd93M');

  return my_sheet.useServiceAccountAuth(creds, function (errAuth) {
    if (errAuth) {
      return callback(errAuth);
    }

    var map = {};

    return my_sheet.getCells(1, {
      'min-row': 4,
      'max-row': 59,
      'min-col': 1,
      'max-col': 11,
      'return-empty': true
    }, function (err, cells) {
      //console.dir(err, {depth: null});
      //console.dir(cells, {depth: null});
      if (err) {
        return callback(err);
      }

      for (var i in cells) {
        if (cells.hasOwnProperty(i)) {
          var cell = cells[i];

          if (!map.hasOwnProperty(cell.row)) {
            map[cell.row] = {};
          }

          map[cell.row][cell.col] = cell.value;
        }
      }

      //console.dir(map, {depth: null});
      return parseEvents(map, callback);
    });
  });

};

var importEvents = function importEvents(callback) {
  return getEventsContent(callback);
};

var handle = function handle(data, callback) {

  return importEvents(function (err, results) {
    if (err) {
      return callback(err);
    }

    return callback(null, {events: results});
  });
};

module.exports = {
  parseEvent: parseEvent,
  parseEvents: parseEvents,
  getEventsContent: getEventsContent,
  importEvents: importEvents,
  handle: handle
};

//
//importEvents(function (err, results) {
//  //fs.writeFile('gakkon2015.json', JSON.stringify(results), function (err) {
//  //  if (err) {
//  //    throw err;
//  //  }
//  //
//  //  console.log('It\'s saved!');
//  //console.log(err, results);
//  console.dir(results, {depth: null});
//  //console.dir(results[0], {depth: null});
//  //});
//
//});