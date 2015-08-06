var chai = require('chai');
var expect = chai.expect;
var should = chai.should();
var moment = require('moment-timezone');
moment.tz.setDefault('Europe/Warsaw');  //set for tests

var template02 = require('../../lib/templates/template02');

describe('template02 test', function () {

  const testData = {
    results: [
      {
        "createdAt": "2015-07-24T10:08:27.717Z",
        "date": {
          "__type": "Date",
          "iso": "2015-08-01T17:30:00.000Z"
        },
        "descriptionEn": "Zapraszamy na pokaz archiwalnych koncertów i materiałów przygotowanych przez TVP Gorzów Wielkopolski.",
        "descriptionPl": "Zapraszamy na pokaz archiwalnych koncertów i materiałów przygotowanych przez TVP Gorzów Wielkopolski.",
        "duration": 150,
        "eventId": 1734,
        "image": {
          "__type": "File",
          "name": "tfss-35c0b83c-b507-469e-aa1f-a39931906ee0-1658.jpg",
          "url": "http://files.parsetfss.com/9fd463ad-e07a-4a21-bdc6-283d608677ba/tfss-35c0b83c-b507-469e-aa1f-a39931906ee0-1658.jpg"
        },
        "imageBlurred": {
          "__type": "File",
          "name": "tfss-6fe89d4c-0266-47c8-9de6-8d68af2f2398-1658b.jpg",
          "url": "http://files.parsetfss.com/9fd463ad-e07a-4a21-bdc6-283d608677ba/tfss-6fe89d4c-0266-47c8-9de6-8d68af2f2398-1658b.jpg"
        },
        "image_big": {
          "__type": "File",
          "name": "tfss-4ddb6d7f-3326-4f45-b1aa-4dcbc9602abf-1658_big.jpg",
          "url": "http://files.parsetfss.com/9fd463ad-e07a-4a21-bdc6-283d608677ba/tfss-4ddb6d7f-3326-4f45-b1aa-4dcbc9602abf-1658_big.jpg"
        },
        "nameEn": "Przystanek Woodstock sprzed lat ",
        "namePl": "Przystanek Woodstock sprzed lat ",
        "objectId": "CDbyVRH2yt",
        "placeEn": "AFA workshops",
        "placePl": "Warsztaty ASP",
        "removed": false,
        "sceneId": 46,
        "tags": [
          "film"
        ],
        "tagsEn": [
          "movie"
        ],
        "tagsPl": [
          "film"
        ],
        "typeEn": "Other",
        "typeId": 43,
        "typePl": "Inne",
        "updatedAt": "2015-07-24T10:08:27.717Z",
        "youtube": ""
      },
      {
        "createdAt": "2015-07-31T19:08:11.109Z",
        "date": {
          "__type": "Date",
          "iso": "2015-08-01T10:15:00.000Z"
        },
        "descriptionEn": "Przystanek Woodstock to niezwykła energia krążąca między zespołami a festiwalową publicznością. W tym roku po raz kolejny Woodstockowicze będą mieć okazję z artystami grającymi na naszych scenach:  spotkać się, podpisach ich płyty czy po prostu powiedzieć, jak ważna jest ich muzyka.\n\nNamiot spotkań znajdziecie przy Małej Scenie. O każdym ze spotkań będziemy też przypominać na woodstockowym Twitterze (www.twitter.com/WoodstockPoland).",
        "descriptionPl": "Przystanek Woodstock to niezwykła energia krążąca między zespołami a festiwalową publicznością. W tym roku po raz kolejny Woodstockowicze będą mieć okazję z artystami grającymi na naszych scenach:  spotkać się, podpisach ich płyty czy po prostu powiedzieć, jak ważna jest ich muzyka.\n\nNamiot spotkań znajdziecie przy Małej Scenie. O każdym ze spotkań będziemy też przypominać na woodstockowym Twitterze (www.twitter.com/WoodstockPoland).",
        "duration": 15,
        "eventId": 1735,
        "nameEn": "Spotkanie z zespołem Jamaram ",
        "namePl": "Spotkanie z zespołem Jamaram ",
        "objectId": "GfHGUTXG5s",
        "placeEn": "Second Stage",
        "placePl": "Mała Scena",
        "removed": false,
        "sceneId": 35,
        "tags": [
          "rock"
        ],
        "tagsEn": [
          "rock"
        ],
        "tagsPl": [
          "rock"
        ],
        "typeEn": "Other",
        "typeId": 43,
        "typePl": "Inne",
        "updatedAt": "2015-07-31T19:08:11.109Z",
        "youtube": ""
      }
    ]
  };

  var result = template02.handle(testData);
  //console.dir(result, {depth: null});

  it('should import example', function (done) {

    result.should.have.deep.property('events[0].name', 'Przystanek Woodstock sprzed lat');
    result.should.have.deep.property('events[0].description', 'Zapraszamy na pokaz archiwalnych koncertów i materiałów przygotowanych przez TVP Gorzów Wielkopolski.');
    result.should.have.deep.property('events[0].metadata[0]', '1734');
    result.should.have.deep.property('events[0].metadata[1]', 'CDbyVRH2yt');
    result.should.have.deep.property('events[0].duration.startAt', '2015-08-01T17:30:00.000Z');
    result.should.have.deep.property('events[0].duration.finishAt', '2015-08-01T20:00:00.000Z');
    result.should.have.deep.property('events[0].places[0].name', 'Warsztaty ASP');
    result.should.have.deep.property('events[0].categories[0].name', 'Inne');
    result.should.have.deep.property('events[0].categories[0].parent', null);
    result.should.have.deep.property('events[0].images[0].url', 'http://files.parsetfss.com/9fd463ad-e07a-4a21-bdc6-283d608677ba/tfss-35c0b83c-b507-469e-aa1f-a39931906ee0-1658.jpg');
    result.should.have.deep.property('events[0].tags[0]', 'film');
    expect(result.events[0].authors).to.be.empty;

    done();
  });

  it('should import without image', function (done) {

    result.should.have.deep.property('events[1].name', 'Spotkanie z zespołem Jamaram');
    result.should.have.deep.property('events[1].description', 'Przystanek Woodstock to niezwykła energia krążąca między zespołami a festiwalową publicznością. W tym roku po raz kolejny Woodstockowicze będą mieć okazję z artystami grającymi na naszych scenach:  spotkać się, podpisach ich płyty czy po prostu powiedzieć, jak ważna jest ich muzyka.\n\nNamiot spotkań znajdziecie przy Małej Scenie. O każdym ze spotkań będziemy też przypominać na woodstockowym Twitterze (www.twitter.com/WoodstockPoland).');
    result.should.have.deep.property('events[1].metadata[0]', '1735');
    result.should.have.deep.property('events[1].metadata[1]', 'GfHGUTXG5s');
    result.should.have.deep.property('events[1].duration.startAt', '2015-08-01T10:15:00.000Z');
    result.should.have.deep.property('events[1].duration.finishAt', '2015-08-01T10:30:00.000Z');
    result.should.have.deep.property('events[1].places[0].name', 'Mała Scena');
    result.should.have.deep.property('events[1].categories[0].name', 'Inne');
    result.should.have.deep.property('events[1].categories[0].parent', null);
    result.should.have.deep.property('events[1].tags[0]', 'rock');
    expect(result.events[1].images).to.be.empty;
    expect(result.events[1].authors).to.be.empty;
    done();
  });

});