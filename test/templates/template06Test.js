var chai = require('chai');
var expect = chai.expect;
var should = chai.should();

describe('template06 importer test', function () {

  var template06 = require('../../lib/templates/template06');

  it('should import single event', function (done) {
    var body = '<div id="events"> <h3>Piątek, 16:00</h3> <div id="line251600"> <div class="line-dummy" id="hour251600"></div> <div class="event" id="event571"> <div onclick="$(\'#event-body571\').toggle(duration=400);$(this).toggleClass(\'shown\')" class="toggler"> <div class="event-title"> <h4 class="event-name"> Co to jest Indie RPG? </h4> <h4 class="event-line"> (Dunwich)</h4> </div> </div> <div class="event-body" id="event-body571" style="display: none;"> <div class="room"> <strong>Sala:</strong> Dunwich (113) </div> <div class="authors"> <strong>Prowadzący:</strong> Orient Express </div> <div class="event-description"> <p>Na tej Prelekcji opowiemy wam o grach RPG, które zna niewiele osób. Szkoda, bo są świetne Czasem lepsze niż te, które możecie znaleźć na stoiskach czy w sklepach. Powiemy wam o różnicach między "tradycyjnymi" grami, a indie. Wyjaśnię, czym jest koncept gmfull oraz nano. Przede wszystkim zarzucimy was jednak tytułami, które można dostać w Polsce i innymi, które łatwo kupić (a czasem dostać za darmo!) w Internecie. Chętnie też podyskutuję z wami i poznam systemy, o których być może nie słyszałem, a powinienem."</p> <p>&nbsp;</p> </div> </div> </div> </div></div>';
    template06.parseEvents(body, function (err, results) {
        //console.dir(results, {depth: null});
        var result = results[0];
        result.should.have.deep.property('name', 'Co to jest Indie RPG?');
        result.should.have.deep.property('description', 'Na tej Prelekcji opowiemy wam o grach RPG, które zna niewiele osób. Szkoda, bo są świetne Czasem lepsze niż te, które możecie znaleźć na stoiskach czy w sklepach. Powiemy wam o różnicach między "tradycyjnymi" grami, a indie. Wyjaśnię, czym jest koncept gmfull oraz nano. Przede wszystkim zarzucimy was jednak tytułami, które można dostać w Polsce i innymi, które łatwo kupić (a czasem dostać za darmo!) w Internecie. Chętnie też podyskutuję z wami i poznam systemy, o których być może nie słyszałem, a powinienem."');
        result.should.have.deep.property('authors[0].name', 'Orient Express');
        result.should.have.deep.property('duration.startAt', '2015-09-25T14:00:00.000Z');
        result.should.have.deep.property('duration.finishAt', '2015-09-25T14:50:00.000Z');
        result.should.have.deep.property('categories[0].name', 'Blok RPG');
        result.should.have.deep.property('places[0].name', 'Dunwich (113)');
        done();
      }
    );
  });

  it('should import events in different time', function (done) {
    var body = '<div id="events"> <h3>Piątek, 16:00</h3> <div id="line251600"> <div class="line-dummy" id="hour251600"></div> <div class="event" id="event571"> <div onclick="$(\'#event-body571\').toggle(duration=400);$(this).toggleClass(\'shown\')" class="toggler"> <div class="event-title"> <h4 class="event-name"> Co to jest Indie RPG? </h4> <h4 class="event-line"> (Dunwich)</h4> </div> </div> <div class="event-body" id="event-body571" style="display: none;"> <div class="room"> <strong>Sala:</strong> Dunwich (113) </div> <div class="authors"> <strong>Prowadzący:</strong> Orient Express </div> <div class="event-description"> <p>Na tej Prelekcji opowiemy wam o grach RPG, które zna niewiele osób. Szkoda, bo są świetne Czasem lepsze niż te, które możecie znaleźć na stoiskach czy w sklepach. Powiemy wam o różnicach między "tradycyjnymi" grami, a indie. Wyjaśnię, czym jest koncept gmfull oraz nano. Przede wszystkim zarzucimy was jednak tytułami, które można dostać w Polsce i innymi, które łatwo kupić (a czasem dostać za darmo!) w Internecie. Chętnie też podyskutuję z wami i poznam systemy, o których być może nie słyszałem, a powinienem."</p> <p>&nbsp;</p> </div> </div> </div> </div> <h3>Piątek, 16:30</h3> <div id="line251630"> <div class="line-dummy" id="hour251630"></div> <div class="event" id="event486"> <div onclick="$(\'#event-body486\').toggle(duration=400);$(this).toggleClass(\'shown\')" class="toggler"> <div class="event-title"> <h4 class="event-name"> His name... Merlin </h4> <h4 class="event-line"> (Transylvania)</h4> </div> </div> <div class="event-body" id="event-body486" style="display: none;"> <div class="authors"> <strong>Prowadzący:</strong> Marysia Olczyk </div> <div class="event-description"> <p>"In a land of myth, and a time of magic…" Poznajesz ten cytat? A może Tobie też nie spodobało się zakończenie najsłynniejszego serialu o Merlinie? Razem napiszmy nowy finał "Przygód Merlina".</p> </div> </div> </div> </div> <h3>Piątek, 17:00</h3> <div id="line251700"> <div class="line-dummy" id="hour251700"></div> <div class="event" id="event587"> <div onclick="$(\'#event-body587\').toggle(duration=400);$(this).toggleClass(\'shown\')" class="toggler"> <div class="event-title"> <h4 class="event-name"> Sztuczna Inteligencja w RPG </h4> <h4 class="event-line"> (Dunwich)</h4> </div> </div> <div class="event-body" id="event-body587" style="display: none;"> <div class="room"> <strong>Sala:</strong> Dunwich 113 </div> <div class="authors"> <strong>Prowadzący:</strong> Maciej "Gorki" Wojciechowski </div> <div class="event-description"> <p>Sztuczna Inteligencja w RPG zwykle sprowadza się do tych wielkich, złych robotów, co to chcą wybić ludzkość. Ewentualnie małpy na sznurku, co to nas zabawi i wesprze, gdy jej każemy. Jak to właściwie z tą SI powinno być?</p> <p>&nbsp;</p> </div> </div> </div> </div></div>';
    template06.parseEvents(body, function (err, results) {
        //console.dir(results, {depth: null});
        var first = results[0];
        first.should.have.deep.property('name', 'Co to jest Indie RPG?');
        first.should.have.deep.property('description', 'Na tej Prelekcji opowiemy wam o grach RPG, które zna niewiele osób. Szkoda, bo są świetne Czasem lepsze niż te, które możecie znaleźć na stoiskach czy w sklepach. Powiemy wam o różnicach między "tradycyjnymi" grami, a indie. Wyjaśnię, czym jest koncept gmfull oraz nano. Przede wszystkim zarzucimy was jednak tytułami, które można dostać w Polsce i innymi, które łatwo kupić (a czasem dostać za darmo!) w Internecie. Chętnie też podyskutuję z wami i poznam systemy, o których być może nie słyszałem, a powinienem."');
        first.should.have.deep.property('duration.startAt', '2015-09-25T14:00:00.000Z');
        first.should.have.deep.property('duration.finishAt', '2015-09-25T14:50:00.000Z');
        first.should.have.deep.property('authors[0].name', 'Orient Express');
        first.should.have.deep.property('categories[0].name', 'Blok RPG');
        first.should.have.deep.property('places[0].name', 'Dunwich (113)');

        var second = results[1];
        second.should.have.deep.property('name', 'His name... Merlin');
        second.should.have.deep.property('description', '"In a land of myth, and a time of magic…" Poznajesz ten cytat? A może Tobie też nie spodobało się zakończenie najsłynniejszego serialu o Merlinie? Razem napiszmy nowy finał "Przygód Merlina".');
        second.should.have.deep.property('duration.startAt', '2015-09-25T14:30:00.000Z');
        second.should.have.deep.property('duration.finishAt', '2015-09-25T15:20:00.000Z');
        second.should.have.deep.property('authors[0].name', 'Marysia Olczyk');
        second.should.have.deep.property('categories[0].name', 'Blok popkulturowy');
        second.should.have.deep.property('places[0].name', 'Transylvania (211)');

        var third = results[2];
        third.should.have.deep.property('name', 'Sztuczna Inteligencja w RPG');
        third.should.have.deep.property('description', 'Sztuczna Inteligencja w RPG zwykle sprowadza się do tych wielkich, złych robotów, co to chcą wybić ludzkość. Ewentualnie małpy na sznurku, co to nas zabawi i wesprze, gdy jej każemy. Jak to właściwie z tą SI powinno być?');
        third.should.have.deep.property('duration.startAt', '2015-09-25T15:00:00.000Z');
        third.should.have.deep.property('duration.finishAt', '2015-09-25T15:50:00.000Z');
        third.should.have.deep.property('authors[0].name', 'Maciej "Gorki" Wojciechowski');
        third.should.have.deep.property('categories[0].name', 'Blok RPG');
        third.should.have.deep.property('places[0].name', 'Dunwich (113)');

        done();
      }
    );
  });


});