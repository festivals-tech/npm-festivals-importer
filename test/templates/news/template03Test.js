var chai = require('chai');
var expect = chai.expect;
var should = chai.should();

describe('template03 news importer test', function () {

  var template03 = require('../../../lib/templates/news/template03');

  //it('should import withput image', function (done) {
  //  var body = '<div class="content"> <h1>Na powitanie!</h1> <p style="margin-bottom: 0cm;">Witajcie na stronie Polconu 2015.</p> <p style="margin-bottom: 0cm;">Do konwentu zostało niecałe siedem miesięcy &ndash; ruszamy więc pełną parą. Spodziewajcie się częstych aktualizacji i wielu atrakcji.&nbsp;Jako organizatorzy zapewniamy, że i dotychczas nie pr&oacute;żnowaliśmy. Dokładamy wszelkich starań, by przygotować dla Was dobry konwent.<br /><br />Zapraszamy serdecznie do przyjazdu do Poznania na Polcon 2015. Impreza odbędzie się w dniach 20-23 sierpnia na terenie Politechniki Poznańskiej. Gł&oacute;wna, prelekcyjna część konwentu odbędzie się w nowoczesnym i reprezentacyjnym Centrum Wykładowym przy ul. Piotrowo 2. Obiekt ten stanowi godne miejsce dla tak znamienitej imprezy, jaką jest jubileuszowy Polcon.<br /><br />Będziemy na bieżąco informować Was o postępie prac nad konwentem &ndash; nie tylko na stronie, lecz także na naszym fanpage na Facebooku. Zachęcamy do regularnych odwiedzin i śledzenia postęp&oacute;w w pracach nad Polconem. Jeśli macie uwagi i propozycje &ndash; piszcie do nas. Jesteśmy otwarci na wszelkie sugestie. Polcon to nasze wsp&oacute;lne święto.&nbsp;<br /><br /></p> <p>Pozdrawiamy serdecznie</p> <p style="margin-bottom: 0cm;">Ekipa pracująca nad Polconem</p> <p>&nbsp;</p><p class="podpis">Dodane 2015-02-01 00:00:00 przez Waldemar</p> <p><b>Komentarze:</b></p> <p>Brak komentarzy dla tego newsa</p> <p><b>Dodaj komentarz</b></p> <p>Musisz być zalogowany, aby dodać komentarz</p> </div> </div>';
  //  template03.parseNews(1, body, function (err, result) {
  //      console.log(result);
  //      //result.should.have.deep.property('tags[0]', '1');
  //      //result.should.have.deep.property('authors[0].name', 'Organizatorzy Polconu 2015');
  //      //result.should.have.deep.property('name', 'Otwarcie konwentu Polcon 2015');
  //      //result.should.have.deep.property('startAt', null);
  //      //result.should.have.deep.property('minutes', 50);
  //      //result.should.have.deep.property('categories[0].name', 'Inne');
  //      //expect(result.duration).to.be.null;
  //      //expect(result.places).to.be.empty;
  //      //result.should.have.deep.property('description', 'Spotkaj organizatorów tej imprezy!');
  //
  //      done();
  //    }
  //  );
  //});

  it('should import with image', function (done) {
    var body = '<div class="content"> <h1>Larpy na Polconie - Sokrates</h1> <p style="text-align: justify;"><span style="color: #ff9900;"><strong>"Sokrates"</strong></span> to jeep form autorstwa Doroty Kaliny Trojanowskiej. Jeepformy&nbsp; z kolei to gry improwizacji, które zakładają aktywny udział publiczności. Zapraszamy wszystkich, którzy chcieliby zagrać jedną z większych ról albo wystąpić w jakimś krótkim epizodzie, albo po prostu popatrzeć i pośmiać się razem z nami. To świetna okazja dla początkujących, którzy do tej pory tylko słyszeli, że larpy to dobra zabawa, ale dotąd nie mieli okazji spróbować. <br><br><img style="display: block; margin-left: auto; margin-right: auto;" src="http://images68.fotosik.pl/1092/1a9b55d482b4ee9agen.jpg" alt="" width="482" height="321"><br><br><strong>"Sokrates"</strong> <br>Stary dowcip mówi, że Piekło jest miejscem, gdzie policjantami są Niemcy, szefami kuchni Brytyjczycy, mechanikami Francuzi, kochankami Szwajcarzy, a wszystko zarządzane jest przez Włochów. Jak więc nazwać segment w akademiku, gdzie grafik sprzątania układa Hiszpan, obiady gotuje Szwed (życzy ktoś śledzika w truskawkach?), kawę robi Anglik, a wszystkim próbuje zarządzać polski student?<br><br>"Sokrates" to politycznie niepoprawna jeepformowa komedia, opierająca się na bezczelnych stereotypach. Wymagane poczucie humoru, dystans do świata i umiejętność śmiania się nie tylko z innych, ale też z samych siebie. Gra z aktywnym uczestnictwem publiczności.</p> <p style="text-align: justify;"><br><strong>Termin: 10:00 Niedziela w Sali LARP</strong></p><p class="podpis">Dodane 2015-08-13 16:00:00 przez Klaudia</p> <p><b>Komentarze:</b></p> <p>Brak komentarzy dla tego newsa</p> <p><b>Dodaj komentarz</b></p> <p>Musisz być zalogowany, aby dodać komentarz</p> </div>';
    template03.parseNews(2, body, function (err, result) {
        console.log(result);
        //result.should.have.deep.property('tags[0]', '2');
        //result.should.have.deep.property('authors[0].name', 'Maciej "Aureus" Gajzlerowicz');
        //result.should.have.deep.property('name', 'Studio Gibberling Press - publikacje, założenia i plany wydawnicze');
        //result.should.have.deep.property('startAt', '2015-08-20T16:00:00.000Z');
        //result.should.have.deep.property('minutes', 50);
        //result.should.have.deep.property('duration.startAt', '2015-08-20T16:00:00.000Z');
        //result.should.have.deep.property('duration.finishAt', '2015-08-20T16:50:00.000Z');
        //result.should.have.deep.property('categories[0].name', 'RPG');
        //result.should.have.deep.property('places[0].name', 'RPG 1');
        //result.should.have.deep.property('description', 'Rok 2015 to czas, gdy członkowie studia Gibberling Press stworzyli i stworzą szereg nowych RPG-ów adresowanych do najróżniejszych odbiorców: od mainstreamu do awangardy. Zapraszamy do zapoznania się z naszymi celami, spojrzeniem na polski rynek gier i demonstracją naszych gier, takich jak: Agonia, Chimera, Etos, Fajerbol, Kuroliszki, Krzyżowiec, Horyzont, Salsa czy Wiatyk.');

        done();
      }
    );
  });

});