var chai = require('chai');
var expect = chai.expect;
var should = chai.should();

describe('template08 importer test', function () {

  var template08 = require('../../lib/templates/template08');

  it('should import', function (done) {
    var body = '<div class="main"> <div class="page-heading page-heading--big page-heading--with-gray-bg"> <h1>Rekonstrukcja - o co w tym chodzi?</h1> </div> <div class="main-content"> <div class="program-point"> <div class="program-point__details"> <div class="table-responsive"> <table> <tbody> <tr> <th>Termin</th> <td>So, 9 kwietnia, 13:30</td> </tr> <tr> <th>Czas trwania prelekcji</th> <td>20&nbsp;minut</td> </tr> <tr> <th>Sala/miejsce</th> <td>Sala dla Początkujących</td> </tr> <tr> <th>Kategoria</th> <td>Blok Dla Początkujących</td> </tr> <tr> <th>Opis</th> <td>"Zabawa w żołnierzyki", "wyrzucanie kasy w błoto", "zabawa dla dzieci" - takie opinie najczęściej słyszy rekonstruktor od osób postronnych. Tymczasem do świata rekonstrukcji napływa coraz większa liczba ludzi, zmęczonych dotychczasowych nauczaniem historii w szkołach. "Rekują" średniowiecznych rycerzy, żołnierzy Napoleona, żołnierzy III Rzeszy czy tych współczesnych, walczących na misjach w Iraku czy Afganistanie. Od kilku lat zajmuję się tym ostatnim, a konkretnie - brytyjskimi jednostkami spadochronowymi. Pasja pociągnęła mnie do spędzenia niezliczonej liczby godzin w książkach i internecie, wydania fortuny na "śmierdzące" (w opinii domowników) fanty, odwiedziny jednostki w UK czy bieg z prawdziwymi weteranami. Opowiem o tym, czym jest rekonstrukcja i na czym polega oraz jak najlepiej zacząć "bawić" się w rekonstruowanie.</td> </tr> <tr> <th>Prowadzący</th> <td> <ul> <li>Agnieszka Emma "Emma" Pawłowska</li> </ul> </td> </tr> </tbody> </table> </div> </div> <div class="program-point__action"> <a href="/2016/program/" title="" class="button button--icon-arrow-right button--icon-right">Wróć do programu</a> </div></div> </div> </div>';
    template08.parseEvent(9, body, function (err, result) {
        //console.log(result);
        result.should.have.deep.property('name', 'Rekonstrukcja - o co w tym chodzi?');
        result.should.have.deep.property('description', '"Zabawa w żołnierzyki", "wyrzucanie kasy w błoto", "zabawa dla dzieci" - takie opinie najczęściej słyszy rekonstruktor od osób postronnych. Tymczasem do świata rekonstrukcji napływa coraz większa liczba ludzi, zmęczonych dotychczasowych nauczaniem historii w szkołach. "Rekują" średniowiecznych rycerzy, żołnierzy Napoleona, żołnierzy III Rzeszy czy tych współczesnych, walczących na misjach w Iraku czy Afganistanie. Od kilku lat zajmuję się tym ostatnim, a konkretnie - brytyjskimi jednostkami spadochronowymi. Pasja pociągnęła mnie do spędzenia niezliczonej liczby godzin w książkach i internecie, wydania fortuny na "śmierdzące" (w opinii domowników) fanty, odwiedziny jednostki w UK czy bieg z prawdziwymi weteranami. Opowiem o tym, czym jest rekonstrukcja i na czym polega oraz jak najlepiej zacząć "bawić" się w rekonstruowanie.');
        result.should.have.deep.property('duration.startAt', '2016-04-09T11:30:00.000Z');
        result.should.have.deep.property('duration.finishAt', '2016-04-09T11:50:00.000Z');
        result.should.have.deep.property('tags[0]', '9');
        result.should.have.deep.property('authors[0].name', 'Agnieszka Emma "Emma" Pawłowska');
        result.should.have.deep.property('categories[0].name', 'Blok Dla Początkujących');
        result.should.have.deep.property('places[0].name', 'Sala dla Początkujących');

        done();
      }
    );
  });

  it('should import null start date', function (done) {
    var body = '<div class="main"> <div class="page-heading page-heading--big page-heading--with-gray-bg"> <h1>Turniej StarCraft 2</h1> </div> <div class="main-content"> <div class="program-point"> <div class="program-point__details"> <div class="table-responsive"> <table> <tbody> <tr> <th>Termin</th> <td></td> </tr> <tr> <th>Czas trwania prelekcji</th> <td>7&nbsp;godzin, 20&nbsp;minut</td> </tr> <tr> <th>Sala/miejsce</th> <td>Scena BGE</td> </tr> <tr> <th>Kategoria</th> <td>Blok Gier Elektronicznych</td> </tr> <tr> <th>Opis</th> <td>StarCraft 2 to najpopularniejszy RTS na świecie. Zmagania Terran, Zergów i Protosów doczekały się tysięcy turniejów na całym świecie, a w Korei Południowej ów hit Blizzarda jest sportem narodowym. To już nie tylko gra komputerowa. To także sport z profesjonalnymi drużynami, trenerami i mistrzostwami. Zmierz się z innymi w rozgrywkach i wygraj tytuł Mistrza SC2 Pyrkonu 2016. Organizatorem turnieju jest Fantasy Expo.</td> </tr> <tr> <th>Prowadzący</th> <td> <ul> <li>Fantasy Expo</li> </ul> </td> </tr> </tbody> </table> </div> </div> <div class="program-point__action"> <a href="/2016/program/" title="" class="button button--icon-arrow-right button--icon-right">Wróć do programu</a> </div></div> </div> </div>';
    template08.parseEvent(21, body, function (err, result) {
        console.log(result);
        result.should.have.deep.property('name', 'Turniej StarCraft 2');
        result.should.have.deep.property('description', 'StarCraft 2 to najpopularniejszy RTS na świecie. Zmagania Terran, Zergów i Protosów doczekały się tysięcy turniejów na całym świecie, a w Korei Południowej ów hit Blizzarda jest sportem narodowym. To już nie tylko gra komputerowa. To także sport z profesjonalnymi drużynami, trenerami i mistrzostwami. Zmierz się z innymi w rozgrywkach i wygraj tytuł Mistrza SC2 Pyrkonu 2016. Organizatorem turnieju jest Fantasy Expo.');
        result.should.have.deep.property('duration.startAt', '2016-04-08T10:00:00.000Z');
        result.should.have.deep.property('duration.finishAt', '2016-04-08T17:20:00.000Z');
        result.should.have.deep.property('tags[0]', '21');
        result.should.have.deep.property('authors[0].name', 'Fantasy Expo');
        result.should.have.deep.property('categories[0].name', 'Blok Gier Elektronicznych');
        result.should.have.deep.property('places[0].name', 'Scena BGE');

        done();
      }
    );
  });

  it('should import many autors', function (done) {
    var body = '<div class="main"> <div class="page-heading page-heading--big page-heading--with-gray-bg"> <h1>Fantastyczny świat seriali</h1> </div> <div class="main-content"> <div class="program-point"> <div class="program-point__details"> <div class="table-responsive"> <table> <tbody> <tr> <th>Termin</th> <td>Nd, 10 kwietnia, 12:00</td> </tr> <tr> <th>Czas trwania prelekcji</th> <td>20&nbsp;minut</td> </tr> <tr> <th>Sala/miejsce</th> <td>Sala dla Początkujących</td> </tr> <tr> <th>Kategoria</th> <td>Blok Dla Początkujących</td> </tr> <tr> <th>Opis</th> <td>Chciałbyś rozpocząć swoją przygodę z serialami sci-fi i fantasy lecz przeraża Cię ilość tytułów i sezonów? Kolejność serii i ilość remaków skutecznie zniechęcają Cię do podjęcia tematu? Nie martw się i przyjdź na nasz subiektywny przegląd seriali z tych gatunków. Postaramy się zaprezentować tytuły, które was nie zniechęcą.</td> </tr> <tr> <th>Prowadzący</th> <td> <ul> <li>Dominika "Ciastek" Nowicka</li> <li>Aleksandra "Rosomak" Kalinowska</li> </ul> </td> </tr> </tbody> </table> </div> </div> <div class="program-point__action"> <a href="/2016/program/" title="" class="button button--icon-arrow-right button--icon-right">Wróć do programu</a> </div></div> </div> </div>';
    template08.parseEvent(29, body, function (err, result) {
        console.log(result);
        result.should.have.deep.property('name', 'Fantastyczny świat seriali');
        result.should.have.deep.property('description', 'Chciałbyś rozpocząć swoją przygodę z serialami sci-fi i fantasy lecz przeraża Cię ilość tytułów i sezonów? Kolejność serii i ilość remaków skutecznie zniechęcają Cię do podjęcia tematu? Nie martw się i przyjdź na nasz subiektywny przegląd seriali z tych gatunków. Postaramy się zaprezentować tytuły, które was nie zniechęcą.');
        result.should.have.deep.property('duration.startAt', '2016-04-10T10:00:00.000Z');
        result.should.have.deep.property('duration.finishAt', '2016-04-10T10:20:00.000Z');
        result.should.have.deep.property('tags[0]', '29');
        result.should.have.deep.property('authors[0].name', 'Dominika "Ciastek" Nowicka');
        result.should.have.deep.property('authors[1].name', 'Aleksandra "Rosomak" Kalinowska');
        result.should.have.deep.property('categories[0].name', 'Blok Dla Początkujących');
        result.should.have.deep.property('places[0].name', 'Sala dla Początkujących');

        done();
      }
    );
  });
});