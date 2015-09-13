var querystring = require('querystring');
var config = require('config');
var http = require('https');

var authorize = function authorize(user, password, callback) {

  var postData = querystring.stringify({
    'username': user,
    'password': password,
    'client_id': config.credentials.clientId,
    'grant_type': 'password'
  });


  var req = http.request(config.credentials.clientOptions, function (res) {
    if (res.statusCode !== 200) {
      console.log('unexpected status for token: ' + res.statusCode);
    }

    res.setEncoding('utf8');

    var data = '';

    res.on('end', function () {

      var json = JSON.parse(data);

      if (json.access_token) {
        var token = json.access_token;
        callback(null, token);
      } else {
        callback(new Error('Unable to get token'));
      }
    });

    res.on('data', function (d) {
      data += d;
    });

  });

  req.on('error', function (e) {
    console.log('problem with auth token request: ' + e.message);
    return callback(e);
  });

  req.write(postData);
  req.end();
};

module.exports = {
  authorize: authorize
};