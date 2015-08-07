var chai = require('chai');
var expect = chai.expect;
var should = chai.should();

describe('polcon importer test', function () {

  var polconImporter = require('../polconImporter');

  it('should import null values', function (done) {
    var body = '<div class="content"><H1>Otwarcie konwentu Polcon 2015</H1> <strong style="margin-left:20px;">Organizatorzy Polconu 2015</strong><br />		<p style="margin-left: 65px; ">			<b>termin: </b> <br />			<b>czas trwania: </b>0:50 min.<BR />			<b>blok: </b>Inne<br />			<b>miejsce: </b><br />			<b>opis:</b> <br />Spotkaj organizatorów tej imprezy! <br />		</p>        </div> </div>'
    polconImporter.parseEvent(body, function (err, result) {
        //console.log(result);
        result.should.have.deep.property('author', 'Organizatorzy Polconu 2015');
        result.should.have.deep.property('name', 'Otwarcie konwentu Polcon 2015');
        result.should.have.deep.property('startAt', null);
        result.should.have.deep.property('duration', '0:50 min.');
        result.should.have.deep.property('category', 'Inne');
        result.should.have.deep.property('place', null);
        result.should.have.deep.property('description', 'Spotkaj organizatorów tej imprezy!');

        done();
      }
    );
  });

  it('should import null values', function (done) {
    var body = '<div class="content"><h1>Studio Gibberling Press - publikacje, założenia i plany wydawnicze</h1> <strong style="margin-left:20px;">Maciej "Aureus" Gajzlerowicz</strong><br>		<p style="margin-left: 65px; ">			<b>termin: </b> czw 18:00<br>			<b>czas trwania: </b>0:50 min.<br>			<b>blok: </b>RPG<br>			<b>miejsce: </b>RPG 1<br>			<b>opis:</b> <br>Rok 2015 to czas, gdy członkowie studia Gibberling Press stworzyli i stworzą szereg nowych RPG-ów adresowanych do najróżniejszych odbiorców: od mainstreamu do awangardy. Zapraszamy do zapoznania się z naszymi celami, spojrzeniem na polski rynek gier i demonstracją naszych gier, takich jak: Agonia, Chimera, Etos, Fajerbol, Kuroliszki, Krzyżowiec, Horyzont, Salsa czy Wiatyk.<br>		</p>        </div>'
    polconImporter.parseEvent(body, function (err, result) {
        //console.log(result);
        result.should.have.deep.property('author', 'Maciej "Aureus" Gajzlerowicz');
        result.should.have.deep.property('name', 'Studio Gibberling Press - publikacje, założenia i plany wydawnicze');
        result.should.have.deep.property('startAt', 'czw 18:00');
        result.should.have.deep.property('duration', '0:50 min.');
        result.should.have.deep.property('category', 'RPG');
        result.should.have.deep.property('place', 'RPG 1');
        result.should.have.deep.property('description', 'Rok 2015 to czas, gdy członkowie studia Gibberling Press stworzyli i stworzą szereg nowych RPG-ów adresowanych do najróżniejszych odbiorców: od mainstreamu do awangardy. Zapraszamy do zapoznania się z naszymi celami, spojrzeniem na polski rynek gier i demonstracją naszych gier, takich jak: Agonia, Chimera, Etos, Fajerbol, Kuroliszki, Krzyżowiec, Horyzont, Salsa czy Wiatyk.');

        done();
      }
    );
  });

});