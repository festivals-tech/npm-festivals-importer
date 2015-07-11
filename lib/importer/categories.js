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

      festivalsClient.getCategories(festivalId, query, function (err, response, body) {

        if (response.statusCode !== 200 || body.total === 0) {

          var data = {
            name: category.name
          };

          if (category.parent) {
            var parent = _this.getCategory(category.parent);

            if (parent) {
              data.parent = parent.id;
            }
          }

          festivalsClient.createCategory(festivalId, data, function (err, response, body) {

            if (err) {
              logger.warn(err, body);
              return cb(err);
            }

            if (response.statusCode === 201 && body) {
              _this.addCategory(category.name, body);
              return cb(null, body);
            }

            logger.warn('Failed to create category: ', data, body);
            return cb(new Error('Failed to create category: ' + data.name));
          });
        }
        else {
          _this.addCategory(category.name, body.categories[0]);
          return cb(null, body.categories[0]);
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

        (function (category, festivalId) {
          var func = function (callback) {
            logger.debug('Initiated ' + j + ' category: ' + category);
            CategoryResolver.resolve(category, festivalId, callback);
          };

          tasks[category.name] = func;
        }(category, festivalId));
      }
    }

    return tasks;
  };

  var extractCategories = function extractCategories(templateData, callback) {
    var categories = {};

    templateData.events.map(function (event) {
      event.categories.map(function (category) {
        categories[category.name] = category;
      });
    });
    //console.dir(categories, {depth: null});

    return callback(null, categories);
  };

  var syncCategories = function syncCategories(categoriesData, festivalId, callback) {
    var tasks = createTasksForCategories(categoriesData, festivalId);
    async.series(tasks, callback);
  };

  var importCategories = function importCategories(festivalId, templateData, callback) {

    extractCategories(templateData, function (err, data) {
      if (err) {
        return callback(err);
      }

      syncCategories(data, festivalId, callback);
    });
  };

  return {
    importCategories: importCategories
  };
};

module.exports = {
  CategoriesImporter: CategoriesImporter
};