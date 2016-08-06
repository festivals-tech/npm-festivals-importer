'use strict';

var async = require('async');
var logger = require('../logger/logger').logger;

const CategoriesImporter = function CategoriesImporter(festivalsClient) {
  var categories = {};

  const CategoryResolver = {
    addCategory: function (name, category) {
      categories[name] = category;
    },
    getCategory: function (name) {
      if (categories.hasOwnProperty(name)) {
        return categories[name];
      }

      return null;
    },
    resolve: function (category, festivalId, cb) {
      var _this = this;

      if (_this.getCategory(category.name)) {
        return cb(null, _this.getCategory[category.name]);
      }

      var query = {
        name: category.name
      };

      return festivalsClient.getCategories(festivalId, query, function (errGetCat, responseGetCat, bodyGetCat) {

        if (errGetCat) {
          logger.warn(errGetCat, bodyGetCat);
          return cb(errGetCat);
        }

        if (responseGetCat.statusCode !== 200 || bodyGetCat.total === 0) {

          var data = {
            name: category.name
          };

          if (category.parent) {
            var parent = _this.getCategory(category.parent);

            if (parent) {
              data.parent = parent.id;
            }
          }

          return festivalsClient.createCategory(festivalId, data, function (errCreateCat, responseCreateCat, bodyCreateCat) {

            if (errCreateCat) {
              logger.warn(errCreateCat, bodyCreateCat);
              return cb(errCreateCat);
            }

            if (responseCreateCat.statusCode === 201 && bodyCreateCat) {
              _this.addCategory(category.name, bodyCreateCat);
              return cb(null, bodyCreateCat);
            }

            logger.warn('Failed to create category: ', data, bodyCreateCat);
            return cb(new Error('Failed to create category: ' + data.name));
          });
        }
        else {
          _this.addCategory(category.name, bodyGetCat.categories[0]);
          return cb(null, bodyGetCat.categories[0]);
        }

      });
    }
  };

  var createTasksForCategories = function createTasksForCategories(categories, festivalId) {
    var tasks = {};

    for (var j in categories) {
      if (categories.hasOwnProperty(j)) {
        var category = categories[j];

        logger.debug('Prepare category task ' + j + ': ' + category.name);

        (function (category, fid) {
          var func = function (callback) {
            logger.debug('Initiated ' + j + ' category: ', category, typeof callback);
            // CategoryResolver.resolve(category, festivalId, function (err, res) {
            //   return setTimeout(callback(err, res), 1000);
            // });
            CategoryResolver.resolve(category, fid, callback);
          };

          tasks[category.name] = func;
        }(category, festivalId));
      }
    }

    return tasks;
  };

  var extractCategories = function extractCategories(templateData, callback) {
    var collection = {};

    templateData.events.map(function (event) {
      event.categories.map(function (category) {
        collection[category.name] = category;
      });
    });

    return callback(null, collection);
  };

  var syncCategories = function syncCategories(categoriesData, festivalId, callback) {
    var tasks = createTasksForCategories(categoriesData, festivalId);
    async.series(tasks, callback);
  };

  var importCategories = function importCategories(festivalId, templateData, callback) {

    return extractCategories(templateData, function (err, data) {
      if (err) {
        return callback(err);
      }

      return syncCategories(data, festivalId, callback);
    });
  };

  return {
    importCategories: importCategories
  };
};

module.exports = {
  CategoriesImporter: CategoriesImporter
};