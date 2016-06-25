var fs = require('fs');
var async = require('async');
var request = require('request');
var moment = require('moment-timezone');
var logger = require('../logger/logger').logger;

var dateTimeParser = function startAtParser(from) {

  if (from) {
    if (from.length < 5) {
      from = '0' + from;
    }

    var date = '2016-10-22 ' + from + ':00';

    // console.log('date', date);
    return moment(date);
  }

  return null;
};

var minutesParser = function minutesParser(start, end) {
  var diff = end.diff(start);
  var duration = moment.duration(diff);
  return duration.asMinutes();
};

var durationParser = function durationParser(from, to) {
  const start = dateTimeParser(from);
  const endAt = dateTimeParser(to);

  return {
    startAt: start.toISOString(),
    finishAt: endAt.toISOString(),
    minutes: minutesParser(start, endAt)
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

var findBreak = function findBreak(key, data) {
  if (data.hasOwnProperty(key)) {
    var breakData = data[key];

    //TODO html!

    return {
      name: breakData.title,
      description: breakData.description_html
    };
  }

  return null;
};

var findTalkByKey = function findTalkByKey(talkKey, talksData) {
  if (talksData.hasOwnProperty(talkKey)) {
    var talk = talksData[talkKey];

    //TODO html!

    //TODO speakers_keys
    return {
      name: talk.title,
      description: talk.description_html
    };
  }

  return null;
};

var findVenueTitleByKey = function findVenueTitleByKey(key, data) {
  if (data.hasOwnProperty(key)) {
    var venueData = data[key];
    return venueData.title;
  }

  return null;
};

var findVenueEvents = function findVenueEvents(duration, slotVenues, venuesData, talksData, callback) {
  var venueEvents = [];
  async.forEachOf(slotVenues, function parseVenue(venueValue, venueKey, cb) {

    // console.log('venueValue: ', venueValue);
    // console.log('venueKey: ', venueKey);

    var event = {};
    event.duration = duration;
    event.minutes = duration.minutes;

    if (venueValue.hasOwnProperty('talk_key')) {
      var data = findTalkByKey(venueValue.talk_key, talksData);

      if (data) {
        event.name = data.name;
        event.description = data.description;
      }
    }

    var venueName = findVenueTitleByKey(venueKey, venuesData);

    if (venueName) {
      event.categories = categoriesParser(venueName);
      event.places = placesParser(venueName);
    }

    // console.log('event', event);

    venueEvents.push(event);
    return cb();
  }, function onresult(err) {
    if (err) {
      console.log(err);
      throw err;
    }

    // console.log('venueEvents', venueEvents);
    return callback(null, venueEvents);
  });
};

var findSlot = function findSlot(key, data) {
  if (data.hasOwnProperty(key)) {
    var slotData = data[key];
    return durationParser(slotData.from, slotData.to);
  }

  return null;
};

var parseSlotEvents = function parseSlotEvents(slotKey, slotValue, results, callback) {
  // console.log('slotKey: ', slotKey);
  // console.log('slotValue: ', slotValue);

  var duration = findSlot(slotKey, results.slots);

  if (slotValue.hasOwnProperty('break_key')) {
    var event = findBreak(slotValue['break_key'], results.breaks);
    if (event) {
      // event.startAt = duration.startAt;
      event.duration = duration;
      event.minutes = duration.minutes;

      return callback(null, [event]);
    }
    return callback('Missing break_key value in map')
  }
  else {
    return findVenueEvents(duration, slotValue, results.venues, results.talks, callback);
  }
};

var importEvents = function importEvents(results, callback) {
  // console.log(results.schedule);
  var events = [];

  async.forEachOf(results.schedule, function parse(slotValue, slotKey, cb) {
    return parseSlotEvents(slotKey, slotValue, results, function (err, slotEvents) {
      if (err) {
        console.log(err);
        return cb(err);
      }

      events = events.concat(slotEvents);
      return cb();
    });
  }, function onresult(err) {
    if (err) {
      console.log(err);
      throw err;
    }

    // console.log(events);
    return callback(null, {events: events});
  });

};


var loadJsonFile = function loadJsonFile(path, callback) {
  return fs.readFile(path, function (err, binary) {

    if (err) {
      console.log(err);
      throw err;
    }
    return callback(null, JSON.parse(binary));
  });

};

var handle = function handle(data, callback) {

  async.map({
    breaks: 'mobilization2016/breaks.json',
    event: 'mobilization2016/event.json',
    schedule: 'mobilization2016/schedule.json',
    slots: 'mobilization2016/slots.json',
    speakers: 'mobilization2016/speakers.json',
    talks: 'mobilization2016/talks.json',
    venues: 'mobilization2016/venues.json'

  }, loadJsonFile, function (err, results) {
    if (err) {
      console.log(err);
      throw err;
    }

    // console.log(results);
    return importEvents(results, callback);

  });
};

module.exports = {
  parseSlotEvents: parseSlotEvents,
  importEvents: importEvents,
  handle: handle
};
