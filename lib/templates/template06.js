'use strict';

var request = require('request');
var cheerio = require('cheerio');
var moment = require('moment-timezone');

var startAtMapper = {
  'Piątek': '2015-09-25',
  'Sobota': '2015-09-26',
  'Niedziela': '2015-09-27'
};

var categoryMapper = {
  'Dunwich': 'Blok RPG',
  'Salem': 'Blok literacki',
  'Ikebukuro': 'Blok mangi i anime',
  'Carcosa': 'Blok LARP',
  'Niewidoczny Uniwersytet': 'Blok popularnonaukowy',
  'Transylvania': 'Blok popkulturowy',
  'Whitechapel': 'Blok popkulturowy',
  'Ishimura': 'Blok komputerowy',
  'Pracownia Pickmana': 'Sala Kreatywna',
  'Sala turniejowa': 'Blok turniejowy'
};

var placesMapper = {
  'Dunwich': 'Dunwich (113)',
  'Salem': 'Salem (226)',
  'Ikebukuro': 'Ikebukuro (127)',
  'Carcosa': 'Carcosa (Piwnica)',
  'Niewidoczny Uniwersytet': 'Niewidoczny Uniwersytet (213)',
  'Transylvania': 'Transylvania (211)',
  'Whitechapel': 'Whitechapel (212)',
  'Ishimura': 'Ishimura (118)',
  'Pracownia Pickmana': 'Pracownia Pickmana (66)',
  'Laboratorium Frankensteina': 'Laboratorium Frankensteina (64)',
  'Sala turniejowa': 'Sala turniejowa (68)',
  'Blok dziecięcy': 'Sala dziecięca (132)',
  'Elizjum': 'Elizjum (Aula)',
  'Leng': 'Leng (Dziedziniec)'
};

var removeTags = function removeTags(val) {
  var regex = /(<([^>]+)>)/ig;
  return val.replace(regex, '');
};

var descriptionParser = function descriptionParser(html) {

  html = removeTags(html);
  html = html.trim();

  return html;
};

var startAtParser = function startAtParser(val) {
  if (val) {
    for (var day in startAtMapper) {
      if (startAtMapper.hasOwnProperty(day)) {
        val = val.replace(day, startAtMapper[day]);
      }
    }

    if (val) {
      val = val.replace(',', '');
      return moment(val).toISOString();
    }
  }

  return null;
};

var durationParser = function durationParser(val, minutes) {
  var startAt = startAtParser(val);

  const start = moment(startAt);
  const endAt = moment(start).add(minutes, 'minutes');

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
  val = val.replace('(', '');
  val = val.replace(')', '');

  for (var cat in categoryMapper) {
    if (categoryMapper.hasOwnProperty(cat)) {
      val = val.replace(cat, categoryMapper[cat]);
    }
  }

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
  val = val || '';
  val = val.trim();
  val = val.replace('Sala: ', '');
  val = val.replace('(', '');
  val = val.replace(')', '');
  val = val.trim();


  for (var loc in placesMapper) {
    if (placesMapper.hasOwnProperty(loc)) {
      val = val.replace(loc, placesMapper[loc]);
    }
  }

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
  val = val || '';
  val = val.trim();
  val = val.replace('Prowadzący: ', '');
  val = val.trim();

  var result = [];

  if (val) {

    var el = {
      name: val,
      organization: null
    };
    result.push(el);
  }
  return result;
};

var parseEvent = function parseEvent($, elem) {
  var data = {
    name: $('.event-name', elem).text().trim(),
    description: '',
    duration: null,
    authors: [],
    places: [],
    categories: [],
    metadata: [],
    images: [],
    tags: []
  };

  if ($(elem).parents().prev('h3').text()) {
    data.duration = durationParser($(elem).parents().prev('h3').text(), 50);
  }

  data.categories = categoriesParser($('.event-line', elem).text());

  //if ($('.room', elem).text()) {
  //  data.places = placesParser($('.room', elem).text());
  //}
  //else {
  data.places = placesParser($('.event-line', elem).text());
  //}

  data.description = descriptionParser($('.event-description', elem).html());
  data.authors = authorsParser($('.authors', elem).text());

  if ($(elem).attr('id')) {
    data.metadata.push($(elem).attr('id'));
  }

  return data;
};

var parseEvents = function parseEvents(body, callback) {
  body = entitiesParser(body);

  var $ = cheerio.load(body, {decodeEntities: false});
  var html = $('div#events');

  var events = [];

  $('div.event', html).each(function (i, elem) {
    var event = parseEvent($, elem);
    if (event) {
      events.push(event);
    }
  });

  return callback(null, events);
};

var getEventsContent = function getEventsContent(callback) {
  return request('http://kapitularz.pl/program/pelen-program-festiwalu/', function (error, response, body) {
    if (!error && response.statusCode === 200) {
      return parseEvents(body, callback);
    }

    console.log('error getEventsContent: ', error, response ? response.statusCode : null);
    return callback(error ? error : new Error('getEventsContent error'), null);
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
//  fs.writeFile('kapitularz2015.json', JSON.stringify(results), function (err) {
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