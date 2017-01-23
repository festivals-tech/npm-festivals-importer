'use strict';

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

      return festivalsClient.getEvents(festivalId, query, function (errGet, responseGet, bodyGet) {

        if (errGet) {
          logger.warn(errGet, bodyGet);
          return cb(errGet);
        }

        var categoryId = _this.getCategoryId(event.categories);
        var placeId = _this.getPlaceId(event.places);

        var data = {
          name: event.name,
          description: event.description,
          tags: event.tags,
          status: 'PUBLISHED',
          duration: {
            startAt: event.duration.startAt,
            finishAt: event.duration.finishAt
          },
          images: event.images || [],
          place: placeId,
          category: categoryId,
          authors: event.authors,
          metadata: event.metadata
        };

        if (responseGet.statusCode !== 200 || bodyGet.total === 0) {

          if (event.duration) {
            return festivalsClient.createEvent(festivalId, data, function (errCreate, responseCreate, bodyCreate) {

              if (errCreate) {
                logger.warn(errCreate, bodyCreate);
                return cb(errCreate);
              }

              if (responseCreate.statusCode === 201 && bodyCreate) {
                _this.addEvent(event.name, bodyCreate);
                return cb(null, bodyCreate);
              }

              logger.warn('Failed to create event: ', data, bodyCreate);
              return cb(new Error('Failed to create event: ' + data.name));
            });
          }
          else {
            logger.info('Missing required parameters - skipped event: ', event.name);
            return cb(null, null);
          }
        }
        else if (bodyGet.total > 0) {
          var eventToUpdate = bodyGet.events[0];

          return festivalsClient.updateEvent(festivalId, eventToUpdate.id, data, function (errUpdate, responseUpdate, bodyUpdate) {
            if (errUpdate) {
              logger.warn(errUpdate, bodyUpdate);
              return cb(errUpdate);
            }

            _this.addEvent(event.name, bodyUpdate);
            return cb(null, bodyUpdate);
          });
        }

        return cb(new Error('Failed to resolve event: ' + event));
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
            // EventResolver.resolve(event, function (err, res) {
            //
            //   //return setTimeout(callback, 500);
            //   return setTimeout(callback(err, res), 1000);
            //
            // });
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

    return extractEvents(templateData, function (err, data) {
      if (err) {
        return callback(err);
      }

      return syncEvents(data, callback);
    });
  };

  return {
    importEvents: importEvents
  };
};

module.exports = {
  EventsImporter: EventsImporter
};