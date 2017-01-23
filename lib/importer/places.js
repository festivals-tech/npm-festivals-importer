'use strict';

var async = require('async');
var logger = require('../logger/logger').logger;

var PlacesImporter = function PlacesImporter(festivalsClient) {
  var places = {};

  var PlaceResolver = {
    addPlace: function (name, place) {
      places[name] = place;
    },
    getPlace: function (name) {
      if (places.hasOwnProperty(name)) {
        return places[name];
      }

      return null;
    },
    resolve: function (place, festivalId, cb) {
      var _this = this;

      if (_this.getPlace(place.name)) {
        return cb(null, _this.getPlace[place.name]);
      }

      var query = {
        name: place.name
      };

      return festivalsClient.getPlaces(festivalId, query, function (errGetPlace, responseGetPlace, bodyGetPlace) {

        if (errGetPlace) {
          logger.warn(errGetPlace, bodyGetPlace);
          return cb(errGetPlace);
        }

        if (responseGetPlace.statusCode !== 200 || bodyGetPlace.total === 0) {

          var data = {
            name: place.name
          };

          if (place.parent) {
            var parent = _this.getPlace(place.parent);

            if (parent) {
              data.parent = parent.id;
            }
          }

          return festivalsClient.createPlace(festivalId, data, function (errCreatePlace, responseCreatePlace, bodyCreatePlace) {

            if (errCreatePlace) {
              logger.warn(errCreatePlace, bodyCreatePlace);
              return cb(errCreatePlace);
            }

            if (responseCreatePlace.statusCode === 201 && bodyCreatePlace) {
              _this.addPlace(place.name, bodyCreatePlace);
              return cb(null, bodyCreatePlace);
            }

            logger.warn('Failed to create place: ', data, bodyCreatePlace);
            return cb(new Error('Failed to create place: ' + data.name));
          });
        }
        else {
          _this.addPlace(place.name, bodyGetPlace.places[0]);
          return cb(null, bodyGetPlace.places[0]);
        }

      });
    }
  };

  var createTasksForPlaces = function createTasksForPlaces(places, festivalId) {
    var tasks = {};

    for (var j in places) {
      if (places.hasOwnProperty(j)) {
        var place = places[j];

        logger.debug('Prepare place task ' + j + ': ' + place.name);

        (function (place, fid) {
          var func = function (callback) {
            logger.debug('Initiated ' + j + ' place: ' + place);
            // PlaceResolver.resolve(place, festivalId, function (err, res) {
            //   return setTimeout(callback(err, res), 1000);
            // });

            PlaceResolver.resolve(place, fid, callback);
          };

          tasks[place.name] = func;
        }(place, festivalId));
      }
    }

    return tasks;
  };

  var extractPlaces = function extractPlaces(templateData, callback) {
    var places = {};

    templateData.events.map(function (event) {
      event.places.map(function (place) {
        places[place.name] = place;
      });
    });

    return callback(null, places);
  };

  var syncPlaces = function syncPlaces(placesData, festivalId, callback) {
    var tasks = createTasksForPlaces(placesData, festivalId);
    async.series(tasks, callback);
  };

  var importPlaces = function importPlaces(festivalId, templateData, callback) {

    return extractPlaces(templateData, function (err, data) {
      if (err) {
        return callback(err);
      }

      return syncPlaces(data, festivalId, callback);
    });
  };

  return {
    importPlaces: importPlaces
  };
};

module.exports = {
  PlacesImporter: PlacesImporter
};