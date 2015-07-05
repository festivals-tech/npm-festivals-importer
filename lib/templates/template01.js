var JM = require('json-mapper');
var moment = require('moment');

var map = {
  name: ['kp_tytul', function (name) {
    return name;
  }],
  description: ['kp_opis', function (description) {
    return description;
  }],
  authors: function (elem) {
    var authorName = elem.kp_prowadzacy;
    var organization = null;
    var authors = [];

    var regex = /^(.+) ?\((.+)\)$/;
    var result = authorName.match(regex);

    if (result) {
      authorName = result[1];
      organization = result[2].trim();
    }

    var authorList = authorName.split(',');

    if (authorList && authorList.length > 0) {
      authors = authorList.map(function (author) {
        return {
          name: author.trim(),
          organization: organization
        };
      });
    }

    return authors;
  },
  categories: ['kp_blok', function (categoryName) {

    var category = {
      parent: null,
      name: categoryName
    };

    return [category];
  }],
  duration: function (elem) {
    var startAt = moment(elem.kp_data);
    var endAt = moment(startAt).add(elem.kp_dlugosc, 'minutes');

    return {
      startAt: startAt.toISOString(),
      finishAt: endAt.toISOString()
    };
  },
  places: function (elem) {
    var placeName = elem.kp_sala;
    var places = [];

    var regex = /^(.+) ?\((.+)\)$/;
    var result = placeName.match(regex);

    if (!result) {
      places.push(placeName);
    }
    else {
      var parents = result[2].trim();
      var parentList = parents.split(',');

      if (parentList && parentList.length > 0) {
        places = parentList.map(function (parent) {
          return parent.trim();
        });
      }

      places.push(result[1].trim());
    }

    var result = [];
    var parent = null;

    if (places && places.length > 0) {
      result = places.map(function (place) {
        var place = {
          parent: parent,
          name: place,
          openingTimes: []
        };

        parent = place;
        return place;
      });
    }

    return result;
  },
  metadata: function (elem) {
    var metadata = [];
    metadata.push(elem.kp_id);
    metadata.push(elem.kp_key);

    return metadata;
  },
  tags: function (elem) {
    var tags = [];

    if (elem.kp_tytul.indexOf('[Panel]') > -1) {
      tags.push('panel');
    }

    return tags;
  }
};

var handle = function handle(data) {

  var converter = JM.makeConverter({
    events: JM.ch(
      function (arr) {
        var con = JM.makeConverter(map);

        var events = [];

        if (arr && arr.length > 0) {
          events = arr.map(function (item) {
            return con(item);
          });
        }

        return events;
      }
    )
  });

  return converter(data);
};

module.exports = {
  handle: handle
};