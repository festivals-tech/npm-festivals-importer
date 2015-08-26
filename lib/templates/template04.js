var fs = require('fs');
var async = require('async');
var request = require('request');
var cheerio = require('cheerio');
var moment = require('moment-timezone');

var currentPlaceText = '';

var startAtMapper = {
  'PIĄTEK': '2015-08-28',
  'SOBOTA': '2015-08-29',
  'NIEDZIELA': '2015-08-30'
};

var removeTags = function removeTags(val) {
  var regex = /(<([^>]+)>)/ig;
  return val.replace(regex, '');
};

var descriptionParser = function descriptionParser(html, removeText) {

  html = html.replace(removeText, '');
  html = html.replace('&nbsp;', ' ');
  html = removeTags(html);

  if (html.indexOf('Prowadzący') > -1) {
    html = html.substring(0, html.indexOf('Prowadzący'));
  }

  if (html.indexOf('Prowadząca') > -1) {
    html = html.substring(0, html.indexOf('Prowadząca'));
  }

  html = html.trim();

  return html;
};

var minutesParser = function minutesParser(start, end) {
  var diff = start.diff(end);
  var duration = moment.duration(diff);
  return duration.asMinutes();
};

var dateParser = function dateParser(val) {
  if (val) {
    val = val.replace('(', '');
    val = val.replace(')', '');
    var dates = val.split(' ');

    if (dates.length) {
      //console.log(dates);

      if (dates.length === 2) {
        var split = dates[1].split('-');
        dates[1] = split[0];
        dates[2] = '-';
        dates[3] = split[1]
      }
      else if (dates.length === 3) {
        dates[3] = dates[2].replace('-', '');
        dates[2] = '-';
      }

      var nextDay = '';

      var from = parseInt(dates[1].replace(':', '').trim());
      var to = parseInt(dates[3].replace(':', '').trim());

      for (var day in startAtMapper) {
        if (dates[0].indexOf(day) > -1) {
          dates[0] = dates[0].replace(day, startAtMapper[day]);

          if (from < to) {
            nextDay = startAtMapper[day];
          }
        }
        else {
          if (!nextDay) {
            nextDay = startAtMapper[day];
          }
        }
      }

      var startAt = moment(dates[0] + ' ' + dates[1]);
      var finishAt = moment(nextDay + ' ' + dates[3]);

      if (startAt.toISOString() === 'Invalid date') {
        startAt = moment();
      }

      return {
        startAt: startAt,
        finishAt: finishAt
      };
    }

    return val;
  }

  return null;
};

var durationParser = function durationParser(val) {
  var regex = /.+(\(.*\))/;
  var result = val.match(regex);

  if (result) {
    var dateStr = result[1];
    return dateParser(dateStr);
  }

  return null;
};

var nameParser = function nameParser(val) {
  var regex = /(.+)\(.*/;
  var result = val.match(regex);

  if (result) {
    return result[1].trim();
  }

  return null;
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

    var regex = /Prowadząc.:(.+)/;

    var matches = val.match(regex);

    if (matches) {
      var author = removeTags(matches[1]);

      var el = {
        name: author.trim(),
        organization: null
      };
      result.push(el);
    }
  }
  return result;
};

var parseEvents = function parseEvents(body, callback) {
  var $ = cheerio.load(body, {decodeEntities: false});
  var html = $('div#main').html();

  //console.log(html);
  //return;

  //var re = '<p><br> &nbsp;</p>';
  var re = '&nbsp;</p>';
  //var re = "&#xA0;</p>";
  //var re = /\((PI&#x104;TEK|SOBOTA|NIEDZIELA)/;
  var events = html
    .split(re)
    .map(function (el) {
      return parseEvent(el)
    });

  return callback(null, events);
};

var parseEvent = function parseEvent(event) {
  var $ = cheerio.load(event, {decodeEntities: false});
  //console.log('event >>', event);

  var data = {
    name: '',
    description: '',
    duration: null,
    minutes: null,
    authors: [],
    places: [],
    categories: [],
    metadata: [],
    images: [],
    tags: []
  };

  var counter = 0;
  var children = $('p').children();

  var removeText = '';

  children.each(function (i, elem) {
    var text = $(this).text().trim();
    var el = $(this);

    if (['MAIN', 'KONKURSOWA I', 'KONKURSOWA II', 'PANELOWA I', 'PANELOWA II', 'KULTUROWA', 'ROCKBAND', 'RPG/LARP'].indexOf(text) > -1) {
      currentPlaceText = text;
    }
    else {
      //console.log('text', '"' + text + '"');
      //console.log('counter', counter);
      switch (counter) {
        case 0:
          //console.dir(el[0], {depth: null});
          removeText = text;
          data.name = nameParser(text);
          var duration = durationParser(text);

          if (duration) {
            data.minutes = minutesParser(duration.finishAt, duration.startAt);
            data.duration = {
              startAt: duration.startAt.toISOString(),
              finishAt: duration.finishAt.toISOString()
            };
          }
          break;
      }

      counter++;
    }
  });

  data.places = placesParser(currentPlaceText);
  data.categories = categoriesParser(currentPlaceText);
  data.description = descriptionParser($.html(), removeText);
  data.authors = authorsParser($.html());

  //console.log('event <<');
  return data;
};

var getEventsContent = function getEventsContent(callback) {
  request('http://gakkon.pl/atrakcje/spis-atrakcji/', function (error, response, body) {
    if (!error && response.statusCode == 200) {
      return parseEvents(body, callback);
    }
  });
};

var importEvents = function importEvents(callback) {
  return getEventsContent(callback);
};

var handle = function handle(data, callback) {

  importEvents(function (err, results) {
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