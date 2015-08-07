var chai = require('chai');
var expect = chai.expect;
var should = chai.should();

describe('template03 importer test', function () {

  var template03 = require('../../lib/templates/template03');

  it('should import null values', function (done) {
    var body = '<div class="content"><H1>Otwarcie konwentu Polcon 2015</H1> <strong style="margin-left:20px;">Organizatorzy Polconu 2015</strong><br />		<p style="margin-left: 65px; ">			<b>termin: </b> <br />			<b>czas trwania: </b>0:50 min.<BR />			<b>blok: </b>Inne<br />			<b>miejsce: </b><br />			<b>opis:</b> <br />Spotkaj organizatorów tej imprezy! <br />		</p>        </div> </div>';
    template03.parseEvent(1, body, function (err, result) {
        //console.log(result);
        result.should.have.deep.property('tags[0]', '1');
        result.should.have.deep.property('authors[0].name', 'Organizatorzy Polconu 2015');
        result.should.have.deep.property('name', 'Otwarcie konwentu Polcon 2015');
        result.should.have.deep.property('startAt', null);
        result.should.have.deep.property('minutes', 50);
        result.should.have.deep.property('categories[0].name', 'Inne');
        expect(result.duration).to.be.null;
        expect(result.places).to.be.empty;
        result.should.have.deep.property('description', 'Spotkaj organizatorów tej imprezy!');

        done();
      }
    );
  });

  it('should import example', function (done) {
    var body = '<div class="content"><h1>Studio Gibberling Press - publikacje, założenia i plany wydawnicze</h1> <strong style="margin-left:20px;">Maciej "Aureus" Gajzlerowicz</strong><br>		<p style="margin-left: 65px; ">			<b>termin: </b> czw 18:00<br>			<b>czas trwania: </b>0:50 min.<br>			<b>blok: </b>RPG<br>			<b>miejsce: </b>RPG 1<br>			<b>opis:</b> <br>Rok 2015 to czas, gdy członkowie studia Gibberling Press stworzyli i stworzą szereg nowych RPG-ów adresowanych do najróżniejszych odbiorców: od mainstreamu do awangardy. Zapraszamy do zapoznania się z naszymi celami, spojrzeniem na polski rynek gier i demonstracją naszych gier, takich jak: Agonia, Chimera, Etos, Fajerbol, Kuroliszki, Krzyżowiec, Horyzont, Salsa czy Wiatyk.<br>		</p>        </div>';
    template03.parseEvent(2, body, function (err, result) {
        //console.log(result);
        result.should.have.deep.property('tags[0]', '2');
        result.should.have.deep.property('authors[0].name', 'Maciej "Aureus" Gajzlerowicz');
        result.should.have.deep.property('name', 'Studio Gibberling Press - publikacje, założenia i plany wydawnicze');
        result.should.have.deep.property('startAt', '2015-08-20T16:00:00.000Z');
        result.should.have.deep.property('minutes', 50);
        result.should.have.deep.property('duration.startAt', '2015-08-20T16:00:00.000Z');
        result.should.have.deep.property('duration.finishAt', '2015-08-20T16:50:00.000Z');
        result.should.have.deep.property('categories[0].name', 'RPG');
        result.should.have.deep.property('places[0].name', 'RPG 1');
        result.should.have.deep.property('description', 'Rok 2015 to czas, gdy członkowie studia Gibberling Press stworzyli i stworzą szereg nowych RPG-ów adresowanych do najróżniejszych odbiorców: od mainstreamu do awangardy. Zapraszamy do zapoznania się z naszymi celami, spojrzeniem na polski rynek gier i demonstracją naszych gier, takich jak: Agonia, Chimera, Etos, Fajerbol, Kuroliszki, Krzyżowiec, Horyzont, Salsa czy Wiatyk.');

        done();
      }
    );
  });

  it('should import long description', function (done) {
    var body = '<div class="content"><h1>Wolsung - sesja</h1> <strong style="margin-left:20px;">Krzysztof  "Kristof" Zięba</strong><br>		<p style="margin-left: 65px; ">			<b>termin: </b> pt  16:00<br>			<b>czas trwania: </b>3:50 min.<br>			<b>blok: </b>RPG<br>			<b>miejsce: </b>RPG 3 - sesje<br>			<b>opis:</b> <br>W Lyonesse odbywa się konferencja naukowa, na której profesor Bartholomew Dashforth prezentuje znalezisko odkryte podczas wykopalisk archeologicznych w Khemre - mumię nieznanego dotychczas faraona, Neheba. Nagle zaczynają dziać się rzeczy, które wytłumaczyć można jedynie działaniem magii...<br>Uwaga: obecność na prelekcji przed sesją może być obowiązkowa do grania.<br>		</p>        </div>';
    template03.parseEvent(3, body, function (err, result) {
        //console.log(result);
        result.should.have.deep.property('tags[0]', '3');
        result.should.have.deep.property('authors[0].name', 'Krzysztof  "Kristof" Zięba');
        result.should.have.deep.property('name', 'Wolsung - sesja');
        result.should.have.deep.property('startAt', '2015-08-21T14:00:00.000Z');
        result.should.have.deep.property('minutes', 230);
        result.should.have.deep.property('duration.startAt', '2015-08-21T14:00:00.000Z');
        result.should.have.deep.property('duration.finishAt', '2015-08-21T17:50:00.000Z');
        result.should.have.deep.property('categories[0].name', 'RPG');
        result.should.have.deep.property('places[0].name', 'RPG 3 - sesje');
        result.should.have.deep.property('description', 'W Lyonesse odbywa się konferencja naukowa, na której profesor Bartholomew Dashforth prezentuje znalezisko odkryte podczas wykopalisk archeologicznych w Khemre - mumię nieznanego dotychczas faraona, Neheba. Nagle zaczynają dziać się rzeczy, które wytłumaczyć można jedynie działaniem magii...Uwaga: obecność na prelekcji przed sesją może być obowiązkowa do grania.');

        done();
      }
    );
  });

  it('should import many authors', function (done) {
    var body = '<div class="content"><h1>Uwe Boll - czy na prawdę taki kiepski z niego reżyser?</h1> <strong style="margin-left:20px;">Katarzyna "QSO" Kozak, Robert "Remus" Kołacki</strong><br>		<p style="margin-left: 65px; ">			<b>termin: </b> sob 10:00<br>			<b>czas trwania: </b>0:50 min.<br>			<b>blok: </b>Filmowy<br>			<b>miejsce: </b>Filmowa<br>			<b>opis:</b> <br>Uwe Boll jest uważany za jednego z najgorszych reżyserów, ale czy słusznie? Dlaczego jego filmy doprowadzają graczy do szału, a krytycy nie zostawiają na nim suchej nitki? I skąd on bierze na to wszystko pieniądze? O naszym bohaterze i o jego twórczości słów kilka.<br>		</p>        </div>';
    template03.parseEvent(4, body, function (err, result) {
        //console.log(result);
        result.should.have.deep.property('tags[0]', '4');
        result.should.have.deep.property('authors[0].name', 'Katarzyna "QSO" Kozak');
        result.should.have.deep.property('authors[1].name', 'Robert "Remus" Kołacki');
        result.should.have.deep.property('name', 'Uwe Boll - czy na prawdę taki kiepski z niego reżyser?');
        result.should.have.deep.property('startAt', '2015-08-22T08:00:00.000Z');
        result.should.have.deep.property('minutes', 50);
        result.should.have.deep.property('duration.startAt', '2015-08-22T08:00:00.000Z');
        result.should.have.deep.property('duration.finishAt', '2015-08-22T08:50:00.000Z');
        result.should.have.deep.property('categories[0].name', 'Filmowy');
        result.should.have.deep.property('places[0].name', 'Filmowa');
        result.should.have.deep.property('description', 'Uwe Boll jest uważany za jednego z najgorszych reżyserów, ale czy słusznie? Dlaczego jego filmy doprowadzają graczy do szału, a krytycy nie zostawiają na nim suchej nitki? I skąd on bierze na to wszystko pieniądze? O naszym bohaterze i o jego twórczości słów kilka.');

        done();
      }
    );
  });

  it('should import many authors with "and"', function (done) {
    var body = '<div class="content"><h1>Dookoła świata z Van Der Bookiem - United States of Popkultura</h1> <strong style="margin-left:20px;">Van Der Book - Michał "Puszon" Stachyra, Simon Zack oraz Jakub Ćwiek</strong><br>		<p style="margin-left: 65px; ">			<b>termin: </b> pt  20:00<br>			<b>czas trwania: </b>0:50 min.<br>			<b>blok: </b>Popkultury<br>			<b>miejsce: </b>Popkulturowa<br>			<b>opis:</b> <br>Popkultura rodem z USA rozlała się szeroką falą po całym świecie. Znamy ją, lubimy ją, potykamy się o nią na każdym filmowym, serialowym, komputerowym, czy komiksowym kroku. Van Der Book zaprasza Was w podróż po Stanach – świata Hollywood i magii kina, krainy zarówno ogromnych konwentów i fandomów, jak i ogromnych kontrastów. Towarzyszył nam będzie Jakub Ćwiek – dobrze Wam znany autor, który ze Stanów przywiózł mnóstwo fantastycznych wspomnień i opowieści.<br>		</p>        </div>';
    template03.parseEvent(5, body, function (err, result) {
        //console.log(result);
        result.should.have.deep.property('tags[0]', '5');
        result.should.have.deep.property('authors[0].name', 'Michał "Puszon" Stachyra');
        result.should.have.deep.property('authors[0].organization', 'Van Der Book');
        result.should.have.deep.property('authors[1].name', 'Simon Zack');
        result.should.have.deep.property('authors[2].name', 'Jakub Ćwiek');
        result.should.have.deep.property('name', 'Dookoła świata z Van Der Bookiem - United States of Popkultura');
        result.should.have.deep.property('startAt', '2015-08-21T18:00:00.000Z');
        result.should.have.deep.property('minutes', 50);
        result.should.have.deep.property('duration.startAt', '2015-08-21T18:00:00.000Z');
        result.should.have.deep.property('duration.finishAt', '2015-08-21T18:50:00.000Z');
        result.should.have.deep.property('categories[0].name', 'Popkultury');
        result.should.have.deep.property('places[0].name', 'Popkulturowa');
        result.should.have.deep.property('description', 'Popkultura rodem z USA rozlała się szeroką falą po całym świecie. Znamy ją, lubimy ją, potykamy się o nią na każdym filmowym, serialowym, komputerowym, czy komiksowym kroku. Van Der Book zaprasza Was w podróż po Stanach – świata Hollywood i magii kina, krainy zarówno ogromnych konwentów i fandomów, jak i ogromnych kontrastów. Towarzyszył nam będzie Jakub Ćwiek – dobrze Wam znany autor, który ze Stanów przywiózł mnóstwo fantastycznych wspomnień i opowieści.');

        done();
      }
    );
  });

  it('should import description', function (done) {
    var body = '<div class="content"><h1>Konkurs: Czy czytaliście powieści, które dostały Hugo?</h1> <strong style="margin-left:20px;">Tomasz Kozłowski</strong><br>		<p style="margin-left: 65px; ">			<b>termin: </b> nd  11:00<br>			<b>czas trwania: </b>0:50 min.<br>			<b>blok: </b>Literacki<br>			<b>miejsce: </b>Literacka 3<br>			<b>opis:</b> <br>Już od ponad sześćdziesięciu lat nagroda Hugo jest uznawana za najbardziej prestiżową nagrodę jaka może zostać przyznana dla powieści fantastycznej. Na liście laureatów możemy znaleźć wybitne dzieła najbardziej znaczących autorów science-fiction. Zapraszam do wzięcia udziału w konkursie sprawdzającym czy rzeczywiście czytaliśmy książki uznane za klasykę literatury.<br><br>		</p>        </div>';
    template03.parseEvent(6, body, function (err, result) {
        //console.log(result);
        result.should.have.deep.property('tags[0]', '6');
        result.should.have.deep.property('authors[0].name', 'Tomasz Kozłowski');
        result.should.have.deep.property('name', 'Konkurs: Czy czytaliście powieści, które dostały Hugo?');
        result.should.have.deep.property('startAt', '2015-08-23T09:00:00.000Z');
        result.should.have.deep.property('minutes', 50);
        result.should.have.deep.property('duration.startAt', '2015-08-23T09:00:00.000Z');
        result.should.have.deep.property('duration.finishAt', '2015-08-23T09:50:00.000Z');
        result.should.have.deep.property('categories[0].name', 'Literacki');
        result.should.have.deep.property('places[0].name', 'Literacka 3');
        result.should.have.deep.property('description', 'Już od ponad sześćdziesięciu lat nagroda Hugo jest uznawana za najbardziej prestiżową nagrodę jaka może zostać przyznana dla powieści fantastycznej. Na liście laureatów możemy znaleźć wybitne dzieła najbardziej znaczących autorów science-fiction. Zapraszam do wzięcia udziału w konkursie sprawdzającym czy rzeczywiście czytaliśmy książki uznane za klasykę literatury.');

        done();
      }
    );
  });

});