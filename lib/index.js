'use strict';

var async = require('async');
var moment = require('moment');
var config = require('config');
var meta = require('./meta');
var PlacesImporter = require('./importer/places').PlacesImporter;
var CategoriesImporter = require('./importer/categories').CategoriesImporter;
var NewsImporter = require('./importer/news').NewsImporter;
var EventsImporter = require('./importer/events').EventsImporter;
var FestivalsApi = require('festivals-client').FestivalsApi;
var Festivals = require('festivals-client').Festivals;

var createClient = function createClient(token) {

  var options = {
    domain: config.client.host
  };

  var client = new FestivalsApi(options);
  client.setBearerToken(token);
  return new Festivals(client);
};

var getFestival = function getFestival(festivalsClient, name, callback) {
  var query = {
    name: name
  };

  return festivalsClient.getFestivals(query, function (errGet, responseGet, bodyGet) {

    if (errGet) {
      return callback(errGet);
    }

    if (responseGet.statusCode !== 200 || bodyGet.total === 0) {
      var now = moment();

      var data = {
        name: name,
        description: name,
        type: 'FANTASY',
        tags: [],
        duration: {
          startAt: now.toISOString(),
          finishAt: moment(now).add(2, 'days').toISOString()
        },
        locations: [
          {
            name: 'Międzynarodowe targi Poznańskie',
            state: 'wielkopolskie',
            country: 'PL',
            street: 'street',
            zip: 'zip',
            openingTimes: [
              {
                startAt: now.toISOString(),
                finishAt: moment(now).add(8, 'hours').toISOString()
              }
            ]
          }
        ],
        images: [
          {
            url: 'http://podgk.pl/wp-content/uploads/2011/06/dni_fantastyki_podgk.jpg',
            order: 0
          }
        ]
      };

      return festivalsClient.createFestival(data, function (errCreate, responseCreate, bodyCreate) {

        if (errCreate) {
          return callback(errCreate);
        }

        if (responseCreate.statusCode === 201 && bodyCreate) {
          return callback(null, bodyCreate);
        }

        return callback(new Error('Failed to create festival: ' + data));
      });
    }
    else {
      return callback(null, bodyGet.festivals[0]);
    }

  });
};

var importFestival = function importFestival(name, template, data, token, callback) {
  var festivalsClient = createClient(token);
  var placesImporter = new PlacesImporter(festivalsClient);
  var categoriesImporter = new CategoriesImporter(festivalsClient);

  return getFestival(festivalsClient, name, function (errGet, festival) {

    if (errGet) {
      return callback(errGet);
    }

    return template.handle(data, function (errHandle, templateData) {
      if (errHandle) {
        return callback(errHandle);
      }

      var festivalId = festival.id;

      return async.parallel({
          categories: function (cb) {
            categoriesImporter.importCategories(festivalId, templateData, function (errImportCat, resultCategories) {
              if (errImportCat) {
                return cb(errImportCat);
              }

              return cb(null, resultCategories);
            });
          },
          places: function (cb) {
            placesImporter.importPlaces(festivalId, templateData, function (errImportPlaces, resultPlaces) {
              if (errImportPlaces) {
                return cb(errImportPlaces);
              }

              return cb(null, resultPlaces);
            });
          }
        },
        function (err, results) {
          if (err) {
            return callback(err);
          }

          var eventsImporter = new EventsImporter(
            festivalsClient,
            festivalId,
            results.categories,
            results.places
          );

          return eventsImporter.importEvents(templateData, function (errImport, events) {
            if (errImport) {
              return callback(errImport);
            }

            //console.dir(events, {depth: null});
            return callback(null, events);
          });
        });
    });
  });
};

var importNews = function importNews(name, template, data, token, callback) {
  var festivalsClient = createClient(token);
  var newsImporter = new NewsImporter(festivalsClient);

  return getFestival(festivalsClient, name, function (errGet, festival) {

    if (errGet) {
      return callback(errGet);
    }

    return template.handle(data, function (errHandle, templateData) {
      if (errHandle) {
        return callback(errHandle);
      }

      var festivalId = festival.id;
      return newsImporter.importNews(festivalId, templateData, function (errImport, result) {
        if (errImport) {
          return callback(errImport);
        }

        //console.dir(result, {depth: null});
        return callback(null, result);
      });
    });
  });
};

module.exports = {
  VERSION: meta.VERSION,
  importFestival: importFestival,
  importNews: importNews
};