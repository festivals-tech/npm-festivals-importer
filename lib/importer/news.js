'use strict';

var async = require('async');
var logger = require('../logger/logger').logger;

var NewsImporter = function NewsImporter(festivalsClient) {
  var news = {};

  var NewsResolver = {
    addNews: function (name, news) {
      news[name] = news;
    },
    getNews: function (name) {
      if (news.hasOwnProperty(name)) {
        return news[name];
      }

      return null;
    },
    resolve: function (news, festivalId, cb) {
      var _this = this;

      if (_this.getNews(news.name)) {
        return cb(null, _this.getNews[news.name]);
      }

      var query = {
        name: news.name
      };

      return festivalsClient.getFestivalNewsCollection(festivalId, query, function (errGet, responseGet, bodyGet) {

        if (errGet) {
          logger.warn(errGet, bodyGet);
          return cb(errGet);
        }

        if (responseGet.statusCode !== 200 || bodyGet.total === 0) {

          var data = {
            name: news.name,
            description: news.description,
            tags: news.tags,
            authors: news.authors,
            images: news.images,
            publishedAt: news.publishedAt
          };

          return festivalsClient.createNews(festivalId, data, function (errCreate, responseCreate, bodyCreate) {

            if (errCreate) {
              logger.warn(errCreate, bodyCreate);
              return cb(errCreate);
            }

            if (responseCreate.statusCode === 201 && bodyCreate) {
              _this.addNews(news.name, bodyCreate);
              return cb(null, bodyCreate);
            }

            logger.warn('Failed to create news: ', data, bodyCreate);
            return cb(new Error('Failed to create news: ' + data.name));
          });
        }
        else {
          _this.addNews(news.name, bodyGet.news[0]);
          return cb(null, bodyGet.news[0]);
        }

      });
    }
  };

  var createTasksForNews = function createTasksForNews(newsCollection, festivalId) {
    var tasks = {};

    for (var j in newsCollection) {
      if (newsCollection.hasOwnProperty(j)) {
        var news = newsCollection[j];

        logger.debug('Prepare news task ' + j + ': ' + news.name);

        (function (news, fid) {
          var func = function (callback) {
            logger.debug('Initiated ' + j + ' news: ' + news);
            NewsResolver.resolve(news, fid, callback);
          };

          tasks[news.name] = func;
        }(news, festivalId));
      }
    }

    return tasks;
  };

  var extractNews = function extractNews(templateData, callback) {
    var newsCollection = {};

    templateData.news.map(function (news) {
      newsCollection[news.name] = news;
    });

    return callback(null, newsCollection);
  };

  var syncNews = function syncNews(newsData, festivalId, callback) {
    var tasks = createTasksForNews(newsData, festivalId);
    async.series(tasks, callback);
  };

  var importNews = function importNews(festivalId, templateData, callback) {

    return extractNews(templateData, function (err, data) {
      if (err) {
        return callback(err);
      }

      return syncNews(data, festivalId, callback);
    });
  };

  return {
    importNews: importNews
  };
};

module.exports = {
  NewsImporter: NewsImporter
};