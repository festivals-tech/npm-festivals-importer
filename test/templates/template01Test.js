var chai = require('chai');
var should = chai.should();

var template01 = require('../../lib/templates/template01');

describe('template01 test', function () {

  const testData = [
    {
      "kp_id": "437157",
      "kp_tytul": "Wystawa prac Rextorn Metalwork i Trollsky",
      "kp_prowadzacy": "Tomasz \"Rextorn\" Grabarczyk (Rextorn Metalwork i Trollsky)",
      "kp_opis": "Nazywamy się Rextorn, jesteśmy pracownią wyrobów repuserskich i zaprezentujemy przed Wami nasze najbardziej znane prace: godło rodu Starków z Gry o Tron, smocze jajo Daenerys, medalion Wiedźmina z autografem Sapkowskiego oraz wiele innych wyrobów naszego autorstwa. W tym roku towarzyszyć nam będzie znany ze swoich filmów o knifemakingu Trollsky Custom Knives, który zaprezentuje Wam cały arsenał swoich słynnych noży.",
      "kp_data": "2015-04-24 13:30:00",
      "kp_dlugosc": "2880",
      "kp_sala": "Pawilon 7 (7)",
      "kp_kon_id": "18",
      "kp_blok": "Festiwalowy",
      "kp_key": "18_4915",
      "kp_ulubiony": "",
      "step": 0
    },
    {
      "kp_id": "437162",
      "kp_tytul": "Rock Band",
      "kp_prowadzacy": "Marta \"Rekin\" Babacz, Łukasz \"Pacyf\" Pona, Rafał \"Acrith\" Krawczak (Wakou Rock Band)",
      "kp_opis": "Rock Band jest grą muzyczną, w której przy pomocy kontrolerów wzorowanych na prawdziwych instrumentach i mikrofonach, wcielicie się w rolę zespołu muzycznego.Grać możecie w godzinach 9-23.",
      "kp_data": "2015-04-24 13:30:00",
      "kp_dlugosc": "2880",
      "kp_sala": "RockBand (8a)",
      "kp_kon_id": "18",
      "kp_blok": "Gier elektronicznych",
      "kp_key": "18_5016",
      "kp_ulubiony": "",
      "step": 1
    },
    {
      "kp_id": "437090",
      "kp_tytul": "Progresywne elementy kanonu i fandomu Marvela",
      "kp_prowadzacy": "Katarzyna \"kasssumi\" Maciejewska",
      "kp_opis": "Kiedy kolor skóry bohatera jest jego nieodłączną cechą? Czy orientacja seksualna definiuje postać? Czy slash i feminizm wykluczają się wzajemnie? Dlaczego powinniśmy otworzyć się na nowe możliwości?",
      "kp_data": "2015-04-26 15:00:00",
      "kp_dlugosc": "50",
      "kp_sala": "Rejestrowana 1 (14, I p.)",
      "kp_kon_id": "18",
      "kp_blok": "Komiksowy",
      "kp_key": "18_4360",
      "kp_ulubiony": "",
      "step": 7
    },
    {
      "kp_id": "437104",
      "kp_tytul": "[Panel] Czy książka elektroniczna ma przyszłość?",
      "kp_prowadzacy": "Izabela Sadowska, Anna Misztak, Gerard Kościelski, Jeremiasz \"Jerry\" Bremer, Tomasz Fijałkowski (Lubimyczytac.pl, Wydawnictwo Miejskie)",
      "kp_opis": "Podczas tego panelu spróbujemy się dowiedzieć jak, zdaniem pisarzy i wydawców, będziemy czytać książki za kilka, kilkanaście lat. Czy e-booki zdominują rynek, czy znikną z niego całkowicie w miarę ogólnego spadku czytelnictwa... czy może, wykorzystując bogactwo nowych technologii, wyniosą książkę na zupełnie nowy, cyfrowy poziom, tak że niedługo zapomnimy że książki miały zapach?",
      "kp_data": "2015-04-26 15:30:00",
      "kp_dlugosc": "50",
      "kp_sala": "Literacka 1 (15)",
      "kp_kon_id": "18",
      "kp_blok": "Literacki",
      "kp_key": "18_5242",
      "kp_ulubiony": "",
      "step": 9
    }
  ];

  var result = template01.handle(testData);
  //console.dir(result, {depth: null});

  it('should import example', function (done) {

    result.should.have.deep.property('events[0].name', 'Wystawa prac Rextorn Metalwork i Trollsky');
    result.should.have.deep.property('events[0].description', 'Nazywamy się Rextorn, jesteśmy pracownią wyrobów repuserskich i zaprezentujemy przed Wami nasze najbardziej znane prace: godło rodu Starków z Gry o Tron, smocze jajo Daenerys, medalion Wiedźmina z autografem Sapkowskiego oraz wiele innych wyrobów naszego autorstwa. W tym roku towarzyszyć nam będzie znany ze swoich filmów o knifemakingu Trollsky Custom Knives, który zaprezentuje Wam cały arsenał swoich słynnych noży.');
    result.should.have.deep.property('events[0].metadata[0]', '437157');
    result.should.have.deep.property('events[0].metadata[1]', '18_4915');
    result.should.have.deep.property('events[0].authors[0].name', 'Tomasz "Rextorn" Grabarczyk');
    result.should.have.deep.property('events[0].authors[0].organization', 'Rextorn Metalwork i Trollsky');
    result.should.have.deep.property('events[0].duration.startAt', '2015-04-24T11:30:00.000Z');
    result.should.have.deep.property('events[0].duration.finishAt', '2015-04-26T11:30:00.000Z');
    result.should.have.deep.property('events[0].places[0].name', '7');
    result.should.have.deep.property('events[0].places[1].parent.name', '7');
    result.should.have.deep.property('events[0].places[1].parent.parent', null);
    result.should.have.deep.property('events[0].places[1].name', 'Pawilon 7');
//result.should.have.deep.property('events[0].places[0].openingTimes', []);
    result.should.have.deep.property('events[0].categories[0].name', 'Festiwalowy');
    result.should.have.deep.property('events[0].categories[0].parent', null);

    done();
  });

  it('should import example with many authors', function (done) {
    result.should.have.deep.property('events[1].name', 'Rock Band');
    result.should.have.deep.property('events[1].description', 'Rock Band jest grą muzyczną, w której przy pomocy kontrolerów wzorowanych na prawdziwych instrumentach i mikrofonach, wcielicie się w rolę zespołu muzycznego.Grać możecie w godzinach 9-23.');
    result.should.have.deep.property('events[1].metadata[0]', '437162');
    result.should.have.deep.property('events[1].metadata[1]', '18_5016');
    result.should.have.deep.property('events[1].authors[0].name', 'Marta "Rekin" Babacz');
    result.should.have.deep.property('events[1].authors[0].organization', 'Wakou Rock Band');
    result.should.have.deep.property('events[1].authors[1].name', 'Łukasz "Pacyf" Pona');
    result.should.have.deep.property('events[1].authors[1].organization', 'Wakou Rock Band');
    result.should.have.deep.property('events[1].authors[2].name', 'Rafał "Acrith" Krawczak');
    result.should.have.deep.property('events[1].authors[2].organization', 'Wakou Rock Band');
    result.should.have.deep.property('events[1].duration.startAt', '2015-04-24T11:30:00.000Z');
    result.should.have.deep.property('events[1].duration.finishAt', '2015-04-26T11:30:00.000Z');
    result.should.have.deep.property('events[1].places[0].name', '8a');
    result.should.have.deep.property('events[1].places[1].parent.name', '8a');
    result.should.have.deep.property('events[1].places[1].parent.parent', null);
    result.should.have.deep.property('events[1].places[1].name', 'RockBand');
//result.should.have.deep.property('events[1].places.openingTimes', []);
    result.should.have.deep.property('events[1].categories[0].name', 'Gier elektronicznych');
    result.should.have.deep.property('events[1].categories[0].parent', null);

    done();
  });

  it('should import example with many places', function (done) {
    result.should.have.deep.property('events[2].name', 'Progresywne elementy kanonu i fandomu Marvela');
    result.should.have.deep.property('events[2].description', 'Kiedy kolor skóry bohatera jest jego nieodłączną cechą? Czy orientacja seksualna definiuje postać? Czy slash i feminizm wykluczają się wzajemnie? Dlaczego powinniśmy otworzyć się na nowe możliwości?');
    result.should.have.deep.property('events[2].metadata[0]', '437090');
    result.should.have.deep.property('events[2].metadata[1]', '18_4360');
    result.should.have.deep.property('events[2].authors[0].name', 'Katarzyna "kasssumi" Maciejewska');
    result.should.have.deep.property('events[2].authors[0].organization', null);
    result.should.have.deep.property('events[2].duration.startAt', '2015-04-26T13:00:00.000Z');
    result.should.have.deep.property('events[2].duration.finishAt', '2015-04-26T13:50:00.000Z');
    result.should.have.deep.property('events[2].places[0].name', '14');
    result.should.have.deep.property('events[2].places[1].parent.name', '14');
    result.should.have.deep.property('events[2].places[1].name', 'I p.');
    result.should.have.deep.property('events[2].places[2].parent.name', 'I p.');
    result.should.have.deep.property('events[2].places[2].name', 'Rejestrowana 1');
//result.should.have.deep.property('events[2].places.openingTimes', []);
    result.should.have.deep.property('events[2].categories[0].name', 'Komiksowy');
    result.should.have.deep.property('events[2].categories[0].parent', null);

    done();
  });

  it('should import example with panel tag', function (done) {

    result.should.have.deep.property('events[3].name', '[Panel] Czy książka elektroniczna ma przyszłość?');
    result.should.have.deep.property('events[3].description', 'Podczas tego panelu spróbujemy się dowiedzieć jak, zdaniem pisarzy i wydawców, będziemy czytać książki za kilka, kilkanaście lat. Czy e-booki zdominują rynek, czy znikną z niego całkowicie w miarę ogólnego spadku czytelnictwa... czy może, wykorzystując bogactwo nowych technologii, wyniosą książkę na zupełnie nowy, cyfrowy poziom, tak że niedługo zapomnimy że książki miały zapach?');
    result.should.have.deep.property('events[3].metadata[0]', '437104');
    result.should.have.deep.property('events[3].metadata[1]', '18_5242');
    result.should.have.deep.property('events[3].authors[0].name', 'Izabela Sadowska');
    result.should.have.deep.property('events[3].authors[0].organization', 'Lubimyczytac.pl, Wydawnictwo Miejskie');
    result.should.have.deep.property('events[3].authors[1].name', 'Anna Misztak');
    result.should.have.deep.property('events[3].authors[1].organization', 'Lubimyczytac.pl, Wydawnictwo Miejskie');
    result.should.have.deep.property('events[3].authors[2].name', 'Gerard Kościelski');
    result.should.have.deep.property('events[3].authors[2].organization', 'Lubimyczytac.pl, Wydawnictwo Miejskie');
    result.should.have.deep.property('events[3].authors[3].name', 'Jeremiasz "Jerry" Bremer');
    result.should.have.deep.property('events[3].authors[3].organization', 'Lubimyczytac.pl, Wydawnictwo Miejskie');
    result.should.have.deep.property('events[3].authors[4].name', 'Tomasz Fijałkowski');
    result.should.have.deep.property('events[3].authors[4].organization', 'Lubimyczytac.pl, Wydawnictwo Miejskie');
    result.should.have.deep.property('events[3].duration.startAt', '2015-04-26T13:30:00.000Z');
    result.should.have.deep.property('events[3].duration.finishAt', '2015-04-26T14:20:00.000Z');
    result.should.have.deep.property('events[3].places[0].name', '15');
    result.should.have.deep.property('events[3].places[1].parent.name', '15');
    result.should.have.deep.property('events[3].places[1].name', 'Literacka 1');
//result.should.have.deep.property('events[3].places.openingTimes', []);
    result.should.have.deep.property('events[3].categories[0].name', 'Literacki');
    result.should.have.deep.property('events[3].categories[0].parent', null);
    result.should.have.deep.property('events[3].tags[0]', 'panel');

    done();
  });

});