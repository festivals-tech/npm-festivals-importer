var chai = require('chai');
var should = chai.should();
var expect = chai.expect;

var CategoriesImporter = require('../../lib/importer/categories').CategoriesImporter;

describe('categories test', function () {

  const festivalId = 'festivalId';

  const templateData = {
    events: [
      {
        name: 'event-name',
        description: 'event-description',
        authors: [{
          name: 'author-01',
          organization: 'organization-01'
        }],
        categories: [{parent: null, name: 'category-01-name'}],
        duration: {
          startAt: '2015-04-24T11:30:00.000Z',
          finishAt: '2015-04-26T11:30:00.000Z'
        },
        places: [
          {
            parent: null, name: 'A', openingTimes: []
          },
          {
            parent: {
              parent: null, name: 'A', openingTimes: []
            },
            name: 'A1',
            openingTimes: []
          }],
        metadata: ['1', '2'],
        tags: []
      }
    ]
  };

  it('should create category for not exists', function (done) {

    var festivalsClient = {
      createCategory: function createCategory(festivalId, data, callback) {

        expect(festivalId).to.equal('festivalId');
        expect(data).to.have.property('name', 'category-01-name');

        return callback(null, {statusCode: 201}, {
          id: 'new id',
          name: data.name
        });
      },
      getCategories: function getCategories(festivalId, query, callback) {
        expect(festivalId).to.equal('festivalId');
        expect(query).to.have.property('name', 'category-01-name');

        return callback(null, {statusCode: 200}, {
          total: 0,
          categories: []
        });
      }
    };

    var categoriesImporter = new CategoriesImporter(festivalsClient);

    categoriesImporter.importCategories(festivalId, templateData, function (err, result) {
      expect(result).to.be.an('object');
      result.should.have.deep.property('category-01-name.id', 'new id');
      result.should.have.deep.property('category-01-name.name', 'category-01-name');
      done();
    });

  });

  it('should get category for existed one', function (done) {

    var festivalsClient = {
      getCategories: function getCategories(festivalId, query, callback) {
        expect(festivalId).to.equal('festivalId');
        expect(query).to.have.property('name', 'category-01-name');

        return callback(null, {statusCode: 200}, {
          total: 1,
          categories: [
            {
              id: 'new id',
              name: query.name
            }
          ]
        });
      }
    };

    var categoriesImporter = new CategoriesImporter(festivalsClient);

    categoriesImporter.importCategories(festivalId, templateData, function (err, result) {
      expect(result).to.be.an('object');
      result.should.have.deep.property('category-01-name.id', 'new id');
      result.should.have.deep.property('category-01-name.name', 'category-01-name');
      done();
    });

  });

});