var async = require('async');
var config = require('config');
var meta = require('./meta');
var PlacesImporter = require('./importer/places').PlacesImporter;
var CategoriesImporter = require('./importer/categories').CategoriesImporter;
var EventsImporter = require('./importer/events').EventsImporter;
var FestivalsApi = require('festivals-client').FestivalsApi;
var Festivals = require('festivals-client').Festivals;

var createClient = function createClient() {

  var options = {
    domain: config.client.host
  };

  var client = new FestivalsApi(options);
  return new Festivals(client);
};

var importFestival = function importFestival(name, template, data, callback) {
  var templateData = template.handle(data);

  var festivalsClient = createClient();
  var placesImporter = new PlacesImporter(festivalsClient);
  var categoriesImporter = new CategoriesImporter(festivalsClient);

  var festivalId = 'cc7b09e3-8ad2-42a8-af40-2f624b54b06b';

  //console.dir(templateData, {depth: null});

  async.parallel({
      categories: function (cb) {
        categoriesImporter.importCategories(festivalId, templateData, function (err, result) {
          if (err) {
            return cb(err);
          }

          return cb(null, result);
        });
      },
      places: function (cb) {
        placesImporter.importPlaces(festivalId, templateData, function (err, result) {
          if (err) {
            return cb(err);
          }

          return cb(null, result);
        });
      }
    },
    function (err, results) {

      var eventsImporter = new EventsImporter(festivalsClient, festivalId, results.categories, results.places);
      eventsImporter.importEvents(templateData, function (err, events) {
        if (err) {
          return cb(err);
        }

        //console.dir(events, {depth: null});
        return callback(null, events);
      });
    });
};

module.exports = {
  VERSION: meta.VERSION,
  importFestival: importFestival
};