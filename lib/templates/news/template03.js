'use strict';

var async = require('async');
var request = require('request');
var cheerio = require('cheerio');
var moment = require('moment-timezone');

var publishDateParser = function publishDateParser(val) {
  if (val) {
    var re = /Dodane (.+) przez/;
    var matches = val.match(re);
    if (matches) {
      return moment(matches[1]).toISOString();
    }
  }

  return null;
};

var authorsParser = function authorsParser(val) {
  var result = [];

  if (val) {
    var re = /przez (.+)/;
    var matches = val.match(re);
    if (matches) {
      var el = {
        name: matches[1],
        organization: null
      };
      result.push(el);
    }
  }
  return result;
};

var imagesParser = function imagesParser(val) {

  if (!val) {
    val = 'http://images66.fotosik.pl/1105/7aef4e1ead2e0b50gen.jpg';
  }

  var el = {
    url: val,
    order: 0
  };


  return [el];
};

var parseNews = function parseNews(id, body, callback) {
  var $ = cheerio.load(body);

  var data = {
    name: $('h1', 'div.content').text(),
    description: '',
    publishedAt: null,
    authors: [],
    images: [],
    tags: [id + '']
  };

  var podpis = $('p.podpis', 'div.content').text();

  data.authors = authorsParser(podpis);
  data.publishedAt = publishDateParser(podpis);
  data.images = imagesParser($('img', 'div.content').attr('src'));

  var description = $('p', 'div.content').text();
  const indexOfDodane = description.indexOf('Dodane');
  data.description = indexOfDodane > -1 ? description.substring(0, indexOfDodane) : description;
  data.description = data.description.trim();

  return callback(null, data);
};

var getNewsContent = function getNewsContent(id, callback) {
  return request('http://polcon2015.org/index.php?go2=shownews&id=' + id, function (error, response, body) {
    if (!error && response.statusCode === 200) {
      return parseNews(id, body, callback);
    }

    console.log('error getNewsContent: ', id, error, response ? response.statusCode : null);
    return callback(error ? error : new Error('getNewsContent error'), null);
  });
};

var importNews = function importNews(ids, callback) {
  async.map(ids, getNewsContent, callback);
};

Array.range = function (a, b, step) {
  var A = [];
  A[0] = a;
  step = step || 1;
  while (a + step <= b) {
    A[A.length] = a += step;
  }

  return A;
};

var handle = function handle(data, callback) {

  return importNews(Array.range(6, 41), function (err, results) {

    if (err) {
      return callback(err);
    }

    return callback(null, {news: results});
  });
};

module.exports = {
  parseNews: parseNews,
  getNewsContent: getNewsContent,
  importNews: importNews,
  handle: handle
};