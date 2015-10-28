var chai = require('chai');
var expect = chai.expect;
var should = chai.should();

describe('template07 importer test', function () {

  var template07 = require('../../lib/templates/template07');

  it('should import single event', function (done) {
    var body = '<div class="table"><div class="line hour"><p><span>09:00</span></p></div><div class="event arenad star-wars" data-time-start="17" data-time-end="18" data-id="933" style="top: 801px; height: 99px; color: rgb(255, 255, 255); background-color: rgb(58, 130, 35);"><div class="event-header"><img class="clock" src="http://komiksfestiwal.com/wp-content/themes/template/img/time.svg" width="10" height="10"><span>17:00-18:00</span></div> <div class="title">Stary i Nowy Kanon - zło ostateczne czy nadzieja na przyszłość? - Mich... </div> </div></div>';
    template07.parseEvents(body, '2015-10-03', function (err, results) {
        //console.dir(err, {depth: null});
        //console.dir(results, {depth: null});
        var result = results[0];
        result.should.have.deep.property('name', 'Stary i Nowy Kanon - zło ostateczne czy nadzieja na przyszłość?');
        result.should.have.deep.property('description', 'Minęło już sporo czasu od anulowania Starego Kanonu SW, lecz dyskusje na ten temat nie ustają w gronie fanów Sagi. O co tak naprawdę chodzi i jakie skutki przyniesie nam ta decyzja? I najważniejsze: Stary czy Nowy Kanon? Zapraszam serdecznie do dyskusji!');
        result.should.have.deep.property('duration.startAt', '2015-10-03T15:00:00.000Z');
        result.should.have.deep.property('duration.finishAt', '2015-10-03T16:00:00.000Z');
        result.should.have.deep.property('authors[0].name', 'Michał „Komisarz Sev” Ogrodowicz');
        result.should.have.deep.property('categories[0].name', 'star wars');
        result.should.have.deep.property('places[0].name', 'Atlas Arena Sala D');
        done();
      }
    );
  });

  it('should import single event with time', function (done) {
    var body = '<div class="table"><div class="line hour"><p><span>09:00</span></p></div><div class="event arenad star-wars" data-time-start="13.25" data-time-end="14.5" data-id="925" style="top: 801px; height: 99px; color: rgb(255, 255, 255); background-color: rgb(58, 130, 35);"><div class="event-header"><img class="clock" src="http://komiksfestiwal.com/wp-content/themes/template/img/time.svg" width="10" height="10"><span>17:00-18:00</span></div> <div class="title">Stary i Nowy Kanon - zło ostateczne czy nadzieja na przyszłość? - Mich... </div> </div></div>';
    template07.parseEvents(body, '2015-10-03', function (err, results) {
        //console.dir(err, {depth: null});
        //console.dir(results, {depth: null});
        var result = results[0];
        result.should.have.deep.property('name', 'Gwiezdne Wojny - modelarstwo w grach');
        result.should.have.deep.property('description', 'O dostępnych na rynku modelach postaci i pojazdów w grach planszowych z naszego ulubionego uniwersum. Na podstawie produktów Fantasy Flight Games, największego aktualnie producenta gier marki Star Wars.');
        result.should.have.deep.property('duration.startAt', '2015-10-03T11:15:00.000Z');
        result.should.have.deep.property('duration.finishAt', '2015-10-03T12:30:00.000Z');
        result.should.have.deep.property('authors[0].name', 'Nathaniel „Fisto” Cook');
        result.should.have.deep.property('categories[0].name', 'star wars');
        result.should.have.deep.property('places[0].name', 'Atlas Arena Sala D');
        done();
      }
    );
  });

});