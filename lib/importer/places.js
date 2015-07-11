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

      festivalsClient.getPlaces(festivalId, query, function (err, response, body) {

        if (response.statusCode !== 200 || body.total === 0) {

          var data = {
            name: place.name
          };

          if (place.parent) {
            var parent = _this.getPlace(place.parent);

            if (parent) {
              data.parent = parent.id;
            }
          }

          festivalsClient.createPlace(festivalId, data, function (err, response, body) {

            if (err) {
              logger.warn(err, body);
              return cb(err);
            }

            if (response.statusCode === 201 && body) {
              _this.addPlace(place.name, body);
              return cb(null, body);
            }

            logger.warn('Failed to create place: ', data, body);
            return cb(new Error('Failed to create place: ' + data.name));
          });
        }
        else {
          _this.addPlace(place.name, body.places[0]);
          return cb(null, body.places[0]);
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

        (function (place, festivalId) {
          var func = function (callback) {
            logger.debug('Initiated ' + j + ' place: ' + place);
            PlaceResolver.resolve(place, festivalId, callback);
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

    extractPlaces(templateData, function (err, data) {
      if (err) {
        return callback(err);
      }

      syncPlaces(data, festivalId, callback);
    });
  };

  return {
    importPlaces: importPlaces
  };
};

module.exports = {
  PlacesImporter: PlacesImporter
};