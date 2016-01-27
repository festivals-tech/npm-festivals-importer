var chai = require('chai');
var expect = chai.expect;
var should = chai.should();

describe('template04 importer test', function () {

  var template04 = require('../../lib/templates/template04');

  it('should import single event', function (done) {
    var body = '<div id="main"><p><strong>MAIN</strong></p> <p><strong>Fua Fua Rythm (PIĄTEK 20:00 – 01:00)</strong></p> <p>Kitki, zakolanówki, krótkie spódniczki i taniec! Oto składniki potrzebne do stworzenia idealnego show! Zapraszamy na pokaz tańca odottemita w stylu prosto z Kraju Kwitnącej Wiśni~!</p> <p><br> &nbsp;</p> </div>';
    template04.parseEvents(body, function (err, results) {
        var first = results[0];
        //first.should.have.deep.property('tags[0]', '1');
        first.should.have.deep.property('name', 'Fua Fua Rythm');
        first.should.have.deep.property('description', 'MAIN  Kitki, zakolanówki, krótkie spódniczki i taniec! Oto składniki potrzebne do stworzenia idealnego show! Zapraszamy na pokaz tańca odottemita w stylu prosto z Kraju Kwitnącej Wiśni~!');
        //first.should.have.deep.property('authors[0].name', 'Organizatorzy Polconu 2015');
        first.should.have.deep.property('minutes', 300);
        first.should.have.deep.property('duration.startAt', '2015-08-28T18:00:00.000Z');
        first.should.have.deep.property('duration.finishAt', '2015-08-28T23:00:00.000Z');
        first.should.have.deep.property('categories[0].name', 'MAIN');
        first.should.have.deep.property('places[0].name', 'MAIN');
        done();
      }
    );
  });

  it('should import two events', function (done) {
    var body = '<div id="main"><p><strong>MAIN</strong></p> <p><strong>Fua Fua Rythm (PIĄTEK 20:00 – 21:00)</strong></p> <p>Kitki, zakolanówki, krótkie spódniczki i taniec! Oto składniki potrzebne do stworzenia idealnego show! Zapraszamy na pokaz tańca odottemita w stylu prosto z Kraju Kwitnącej Wiśni~!</p> <p><br> &nbsp;</p> <p><strong>Disco (SOBOTA 21:00 – 22:00)</strong></p> <p>Co jest najlepsze pierwszej nocy konwentu? Impreza!</p> <p><br> &nbsp;</p> <p><strong>Śmierć w Edo – LARP (NIEDZIELA 09:00 – 13:00)</strong></p> <p>Ilość osób: ~ 14 (min. 10)</p> <p>Poziom trudności: średni</p> <p>To nie jest LARP o samuraju w łódce! Smaczek dla tych, którzy chcieliby poczuć się jak brawdziwi mieszkańcy Japonii klasycznej (czyli bez mechów, wielkookich lolitek i zboczeńców w pociągach)... a przynajmniej trochę poudawać samurajów.</p> <p>Prowadzący: Marcin Tarka</p> <p><br> &nbsp;</p> </div>';
    template04.parseEvents(body, function (err, results) {
        //console.log(results);

        var first = results[0];
        //first.should.have.deep.property('tags[0]', '1');
        first.should.have.deep.property('name', 'Fua Fua Rythm');
        first.should.have.deep.property('description', 'MAIN  Kitki, zakolanówki, krótkie spódniczki i taniec! Oto składniki potrzebne do stworzenia idealnego show! Zapraszamy na pokaz tańca odottemita w stylu prosto z Kraju Kwitnącej Wiśni~!');
        //first.should.have.deep.property('authors[0].name', 'Organizatorzy Polconu 2015');
        first.should.have.deep.property('minutes', 60);
        first.should.have.deep.property('duration.startAt', '2015-08-28T18:00:00.000Z');
        first.should.have.deep.property('duration.finishAt', '2015-08-28T19:00:00.000Z');
        first.should.have.deep.property('categories[0].name', 'MAIN');
        first.should.have.deep.property('places[0].name', 'MAIN');

        var second = results[1];
        second.should.have.deep.property('name', 'Disco');
        second.should.have.deep.property('description', 'Co jest najlepsze pierwszej nocy konwentu? Impreza!');
        //first.should.have.deep.property('authors[0].name', 'Organizatorzy Polconu 2015');
        second.should.have.deep.property('minutes', 60);
        second.should.have.deep.property('duration.startAt', '2015-08-29T19:00:00.000Z');
        second.should.have.deep.property('duration.finishAt', '2015-08-29T20:00:00.000Z');
        second.should.have.deep.property('categories[0].name', 'MAIN');
        second.should.have.deep.property('places[0].name', 'MAIN');

        done();
      }
    );
  });


});