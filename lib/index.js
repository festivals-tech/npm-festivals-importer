var async = require('async');
var moment = require('moment');
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

var getFestival = function getFestival(festivalsClient, name, callback) {
  var query = {
    name: name
  };

  festivalsClient.getFestivals(query, function (err, response, body) {

    if (err) {
      return callback(err);
    }

    if (response.statusCode !== 200 || body.total === 0) {
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

      festivalsClient.createFestival(data, function (err, response, body) {

        if (err) {
          return callback(err);
        }

        if (response.statusCode === 201 && body) {
          return callback(null, body);
        }

        return callback(new Error('Failed to create festival: ' + data));
      });
    }
    else {
      return callback(null, body.festivals[0]);
    }

  });
};

var importFestival = function importFestival(name, template, data, callback) {
  var festivalsClient = createClient();
  var placesImporter = new PlacesImporter(festivalsClient);
  var categoriesImporter = new CategoriesImporter(festivalsClient);

  getFestival(festivalsClient, name, function (err, festival) {

    if (err) {
      return callback(err);
    }

    var templateData = template.handle(data);
    var festivalId = festival.id;

    //console.dir(data, {depth: null});
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
        if (err) {
          return callback(err);
        }

        var eventsImporter = new EventsImporter(
          festivalsClient,
          festivalId,
          results.categories,
          results.places
        );
        eventsImporter.importEvents(templateData, function (err, events) {
          if (err) {
            return callback(err);
          }

          //console.dir(events, {depth: null});
          return callback(null, events);
        });
      });
  });
};

module.exports = {
  VERSION: meta.VERSION,
  importFestival: importFestival
};