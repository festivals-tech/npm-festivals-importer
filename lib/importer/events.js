var async = require('async');
var logger = require('../logger/logger').logger;

var EventsImporter = function EventsImporter(festivalsClient, festivalId, categories, places) {
  var events = {};

  var EventResolver = {
    addEvent: function (name, event) {
      events[name] = event;
    },
    getEvent: function (name) {
      if (events.hasOwnProperty(name)) {
        return events[name];
      }

      return null;
    },
    getPlaceId: function (eventPlaces) {
      if (eventPlaces && eventPlaces.length) {
        var place = eventPlaces.slice(-1)[0];

        if (places.hasOwnProperty(place.name)) {
          return places[place.name].id;
        }
      }

      return null;
    },
    getCategoryId: function (eventCategories) {

      if (eventCategories && eventCategories.length) {
        var category = eventCategories.slice(-1)[0];

        if (categories.hasOwnProperty(category.name)) {
          return categories[category.name].id;
        }
      }

      return null;
    },
    resolve: function (event, cb) {
      var _this = this;

      if (_this.getEvent(event.name)) {
        return cb(null, _this.getEvent[event.name]);
      }

      var query = {
        name: event.name
      };

      festivalsClient.getEvents(festivalId, query, function (err, response, body) {

        if (err) {
          logger.warn(err, body);
          return cb(err);
        }

        if (response.statusCode !== 200 || body.total === 0) {

          if (event.duration) {

            var categoryId = _this.getCategoryId(event.categories);
            var placeId = _this.getPlaceId(event.places);

            var data = {
              name: event.name,
              description: event.description,
              tags: event.tags,
              duration: {
                startAt: event.duration.startAt,
                finishAt: event.duration.finishAt
              },
              images: event.images,
              place: placeId,
              category: categoryId,
              authors: event.authors,
              metadata: event.metadata
            };

            festivalsClient.createEvent(festivalId, data, function (err, response, body) {

              if (err) {
                logger.warn(err, body);
                return cb(err);
              }

              if (response.statusCode === 201 && body) {
                _this.addEvent(event.name, body);
                return cb(null, body);
              }

              logger.warn('Failed to create event: ', data, body);
              return cb(new Error('Failed to create event: ' + data.name));
            });
          }
          else {
            logger.info('Missing required parameters - skipped event: ', event.name);
            return cb(null, null);
          }
        }
        else {
          _this.addEvent(event.name, body.events[0]);
          return cb(null, body.events[0]);
        }

      });
    }
  };

  var createTasksForEvents = function createTasksForEvents(events) {
    var tasks = {};

    for (var j in events) {
      if (events.hasOwnProperty(j)) {
        var event = events[j];

        logger.debug('Prepare event task ' + j + ': ' + event.name);

        (function (event) {
          var func = function (callback) {
            logger.debug('Initiated ' + j + ' event: ' + event);
            EventResolver.resolve(event, callback);
          };

          tasks[event.name] = func;
        }(event));
      }
    }

    return tasks;
  };

  var extractEvents = function extractEvents(templateData, callback) {
    var events = {};

    templateData.events.map(function (event) {
      events[event.name] = event;
    });

    return callback(null, events);
  };

  var syncEvents = function syncEvents(eventsData, callback) {
    var tasks = createTasksForEvents(eventsData);
    async.series(tasks, callback);
  };

  var importEvents = function importEvents(templateData, callback) {

    extractEvents(templateData, function (err, data) {
      if (err) {
        return callback(err);
      }

      syncEvents(data, callback);
    });
  };

  return {
    importEvents: importEvents
  };
};

module.exports = {
  EventsImporter: EventsImporter
};