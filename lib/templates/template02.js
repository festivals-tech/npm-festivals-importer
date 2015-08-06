var JM = require('json-mapper');
var moment = require('moment-timezone');

var map = {
  name: ['namePl', function (name) {
    return name.trim();
  }],
  description: ['descriptionPl', function (description) {
    return description;
  }],
  authors: function (elem) {
    return [];
  },
  categories: ['typePl', function (categoryName) {

    const category = {
      parent: null,
      name: categoryName
    };

    return [category];
  }],
  duration: function (elem) {
    const startAt = moment(elem.date.iso);
    const endAt = moment(startAt).add(elem.duration, 'minutes');

    return {
      startAt: startAt.toISOString(),
      finishAt: endAt.toISOString()
    };
  },
  places: ['placePl', function (name) {
    var place = {
      parent: null,
      name: name,
      openingTimes: []
    };
    return [place];
  }],
  metadata: function (elem) {
    return [elem.eventId + '', elem.objectId];
  },
  images: function (elem) {
    var images = [];

    if (elem.image && elem.image.hasOwnProperty('url')) {
      images.push(
        {
          url: elem.image.url,
          order: 0
        }
      );
    }

    return images;
  },
  tags: ['tags', function (tags) {
    return tags;
  }]
};

var handle = function handle(data) {

  var converter = JM.makeConverter({
    events: JM.ch(
      function (arr) {
        const con = JM.makeConverter(map);

        var events = [];

        if (arr && arr.length) {
          events = arr.map(function (item) {
            return con(item);
          });
        }

        return events;
      }
    )
  });

  return converter(data.results);
};

module.exports = {
  handle: handle
};