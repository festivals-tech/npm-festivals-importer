'use strict';

var async = require('async');
var request = require('request');
var cheerio = require('cheerio');
var moment = require('moment-timezone');

var days = {
  day1: '2015-10-03',
  day2: '2015-10-04'
};

var categoriesMapper = {
  'spotkania': 'http://komiksfestiwal.com/wp-content/uploads/2015/08/prelekcje.svg',
  'inne': 'http://komiksfestiwal.com/wp-content/uploads/2015/08/other_events.svg',
  'warsztaty': 'http://komiksfestiwal.com/wp-content/uploads/warsztaty_black.svg',
  'star wars': 'http://komiksfestiwal.com/wp-content/uploads/2015/08/star_wars.svg',
  'autografy': 'http://komiksfestiwal.com/wp-content/uploads/2015/08/strefa_autografow.svg',
  'strefa dziecieca': 'http://komiksfestiwal.com/wp-content/uploads/2015/08/strefa_dziecieca_dziewczynka.svg',
  'gry planszowe': 'http://komiksfestiwal.com/wp-content/uploads/2015/08/gry_planszowe.svg'
};

var loadedEvents = {};

var removeTags = function removeTags(val) {
  var regex = /(<([^>]+)>)/ig;
  return val.replace(regex, '');
};

var descriptionParser = function descriptionParser(html) {

  html = removeTags(html);
  html = html.trim();

  return html;
};

var getHour = function getHour(val) {

  if (val) {

    var integerVal = parseInt(val, 10);
    var floatVal = parseFloat(val);
    var diff = parseFloat(floatVal - integerVal);

    if (diff) {
      return integerVal + ':' + diff * 60;
    }
  }

  return val;
};

var durationParser = function durationParser(day, timeStart, timeEnd) {
  var startAt = day + ' ' + getHour(timeStart);
  var finishAt = day + ' ' + getHour(timeEnd);

  const start = moment(startAt);
  const endAt = moment(finishAt);

  return {
    startAt: start.toISOString(),
    finishAt: endAt.toISOString()
  };
};

var entitiesParser = function nameParser(val) {
  val = val.replace(/(&lt;p&gt;|&lt;\/p&gt;|&lt;span.+?&gt;|&lt;\/span&gt;|&lt;p.+?\"&gt;)/g, '');
  val = val.replace(/&nbsp;/g, ' ');
  val = val.replace(/&amp;/g, '&');
  val = val.replace(/&oacute;/gi, 'ó');
  val = val.replace(/&#39;/g, "'");
  val = val.replace(/&hellip;/g, '...');
  val = val.replace(/(&ndash;|&mdash;)/g, '-');
  val = val.replace(/(&quot;|&ldquo;|&rdquo;|&bdquo;)/g, '"');
  return val.trim();
};

var categoriesParser = function categoriesParser(val) {
  val = val || '';
  val = val.trim();

  var cat;

  for (var i in categoriesMapper) {
    if (val === categoriesMapper[i]) {
      cat = i;
      break;
    }
  }

  if (!cat) {
    cat = 'inne';
    console.log('couldn\'t find category for ' + val);
  }

  var categories = [];

  if (val) {
    const category = {
      parent: null,
      name: cat
    };

    categories.push(category);
  }
  return categories;
};

var placesParser = function placesParser(val) {
  val = val || '';
  val = val.trim();

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

var authorsParser = function authorsParser(name, description, val) {
  val = val || '';
  val = val.trim();

  var result = [];

  if (val) {

    val = val.replace(name, '');
    val = val.replace('-', '');
    val = val.trim();

    if (val) {

      //console.log('val', val);

      var authorsSplited = val.split(',');

      //console.log('authors', authors);

      for (var ii in authorsSplited) {
        if (authorsSplited.hasOwnProperty(ii)) {

          var author = authorsSplited[ii];

          author = author.replace('prowadzenie ', '');
          author = author.replace('Warsztaty Komiksu: ', '');

          var el = {
            name: author.trim(),
            organization: null
          };
          result.push(el);
        }
      }
    }
  }

  var regex = /.*\–? ?prowadzenie (.+)/;
  var matches = description.match(regex);

  if (matches) {
    var re = /(, | i | oraz )/;
    var authors = matches[1].split(re).filter(function (element) {
      return element !== ', ' && element !== ' i ' && element !== ' oraz ';
    });

    for (var i in authors) {
      if (authors.hasOwnProperty(i)) {
        var authorName = authors[i];
        var authorEl = {
          name: authorName.trim(),
          organization: null
        };
        result.push(authorEl);
      }
    }
  }
  return result;
};

var nameParser = function nameParser(val) {
  val = val || '';
  val = val.trim();

  if (val) {
    var nameSplit = val.split('-');

    if (nameSplit.length > 1) {
      var removed = nameSplit.pop();

      if (
        removed.indexOf('Zin Zin Press') === -1 &&
        removed.indexOf('Nowe rzeczywistości') === -1 &&
        removed.indexOf('Warsztaty Komiksu dla') === -1 &&
        removed.indexOf('warsztaty komiksowe z WawaKomiks') === -1 &&
        removed.indexOf('lecie Bitew Komiksowych') === -1 &&
        removed.indexOf('Komiks w sitodruku') === -1 &&
        removed.indexOf('ostatnie lata w największym') === -1 &&
        removed.indexOf('plany wydawnicze') === -1 &&
        removed.indexOf('wręczenie nagród') === -1 &&
        removed.indexOf('rodziny') === -1 &&
        removed.indexOf('Nocny Spacer') === -1
      ) {
        val = nameSplit.join('-');
      }
    }
  }

  return val.trim();
};

var parseEvents = function parseEvents(body, day, callback) {
  body = entitiesParser(body);

  var $ = cheerio.load(body, {decodeEntities: false});
  var html = $('div.table');

  var datas = [];

  $('div.event', html).each(function (i, elem) {

    var data = $(elem).data();

    if (data.hasOwnProperty('id')) {

      if (!loadedEvents.hasOwnProperty(data.id)) {
        loadedEvents[data.id] = true;
        data.day = day;
        datas.push(data);
      }
      else {
        console.log('skip data', data);
      }
    }
    else {
      console.log('missing "id" in data', data);
    }
  });

  async.map(datas, getEventContent, callback);
};

var parseEvent = function parseEvent(body, id, day, timeStart, timeEnd) {
  //console.log('parseEvent:', id, day, timeStart, timeEnd);

  var $ = cheerio.load(body, {decodeEntities: false});
  var data = {
    name: '',
    description: null,
    duration: null,
    authors: [],
    places: [],
    categories: [],
    metadata: [],
    images: [],
    tags: []
  };

  var val = $('.pop-up-bottom-title').text();
  data.name = nameParser(val);
  data.duration = durationParser(day, timeStart, timeEnd);
  data.categories = categoriesParser($('.pop-up-bottom-header p').children('img').last().attr('src'));
  data.places = placesParser($('.pop-up-top-right div p strong').text());
  data.description = descriptionParser($('.pop-up-bottom-content').text());
  data.authors = authorsParser(data.name, data.description, val);
  data.metadata.push(id + '');

  return data;
};

var loadDayContent = function loadDayContent(day, callback) {
  //console.log('loadDayContent: ' + day);

  return request('http://komiksfestiwal.com/program/?event-day=' + day, function (error, response, body) {
    //console.log('loadDayContent resp', error, response.statusCode);

    if (!error && response.statusCode === 200) {
      return parseEvents(body, days[day], callback);
    }

    console.log('error getEventContent: ', error, response ? response.statusCode : null);
    return callback(error ? error : new Error('getEventContent error'), null);
  });
};

var getEventsContent = function getEventsContent(callback) {
  async.map(Object.keys(days), loadDayContent, function (err, results) {

    if (err) {
      return callback(err, null);
    }

    //console.log('getEventsContent', err, results);
    return callback(err, results[0].concat(results[1]));
  });
};

var getEventContent = function getEventContent(data, callback) {
  request.post('http://komiksfestiwal.com/wp-content/themes/template/templates/events-programme/pop-ups/pop-up.php', {
    form: {
      type: 'event',
      ID: data.id
    }
  }, function (error, response, body) {
    //console.log('getEventContent resp', error, response.statusCode);

    if (!error && response.statusCode === 200) {


      var event = parseEvent(body, data.id, data.day, data.timeStart, data.timeEnd);

      //console.log('event ', event);

      if (event) {
        return callback(null, event);
      }

      return callback(null, null);
    }

    return callback(error, null);
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
//  fs.writeFile('komiksfestiwal2015.json', JSON.stringify(results), function (err) {
//    if (err) {
//      throw err;
//    }
//    //
//    //  console.log('It\'s saved!');
//    //console.log(err, results);
//    console.dir(results, {depth: null});
//    //console.dir(results[0], {depth: null});
//  });
//
//});