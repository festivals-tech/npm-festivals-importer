var request = require('request');
var cheerio = require('cheerio');

var mapper = {
  termin: 'startAt',
  'czas trwania': 'duration',
  blok: 'category',
  miejsce: 'place',
  opis: 'description'
};

var parseEvent = function parseEvent(body, callback) {
  $ = cheerio.load(body);

  var data = {};

  data.author = $('strong', 'div.content').text();
  data.name = $('h1', 'div.content').text();
  var children = $('p', 'div.content').children();

  children.each(function (i, elem) {
    var text = $(this).text();
    text = text.replace(':', '').trim();

    //console.log($(this));

    var val = $(this)[0].next.data;

    if (undefined === val) {
      val = '';
    }

    val = val.trim();

    if (!val) {
      val = null;
    }

    if (text) {
      data[mapper[text]] = val;
    }
  });

  if (children.last()[0].prev.data) {
    data.description = children.last()[0].prev.data.trim();
  }

  return callback(null, data);
};


var getEventContent = function getEventContent(id, callback) {
  request('http://polcon2015.org/index.php?go2=event&id=' + id, function (error, response, body) {
    if (!error && response.statusCode == 200) {
      //console.log(body);

      //var content = prepareContent(body + '', prefix);

      parseEvent(body, function (err, result) {

          if (err) {
            //logger.error('unable to parse car data: %s', err);
            //return callback(err);
          }

          console.log(err);
          //console.log(result);
          console.dir(result, {depth: null});

          return callback(err, result);
        }
      );
    }
  });
};

module.exports = {
  parseEvent: parseEvent,
  getEventContent: getEventContent
};