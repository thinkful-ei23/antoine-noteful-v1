const app = require('../server');
const chai = require('chai');
const chaiHttp = require('chai-http');

const expect = chai.expect;

chai.use(chaiHttp);


describe('Reality check', function () {

  it('true should be true', function () {
    expect(true).to.be.true;
  });

  it('2 + 2 should equal 4', function () {
    expect(2 + 2).to.equal(4);
  });

});
  
describe('Express static', function () {
    
  it('GET request "/" should return the index page', function () {
    return chai.request(app)
      .get('/')
      .then(function (res) {
        expect(res).to.exist;
        expect(res).to.have.status(200);
        expect(res).to.be.html;
      });
  });
    
});
  
describe('404 handler', function () {
    
  it('should respond with 404 when given a bad path', function () {
    return chai.request(app)
      .get('/DOES/NOT/EXIST')
      .then(res => {
        expect(res).to.have.status(404);
      });
  });
    
});

describe('GET/api/notes', function() {

  it('should return the default of 10 notes as an array', function() {

    return chai
      .request(app)
      .get('/api/notes')
      .then(function(res) {
        expect(res).to.have.status(200);
        expect(res).to.be.json;
        expect(res.body).to.be.a('array');
        expect(res.body).to.have.lengthOf(10);
      
        const expectedKeys = ['id', 'title', 'content'];
        res.body.forEach(function(item) {
          expect(item).to.be.a('object');
          expect(item).to.include.keys(expectedKeys);
        });
      });
  });

  it('should return correct search results for a valid query', function() {
    return chai
      .request(app)
      .get('/api/notes?searchTerm=about%20cats')
      .then(function(res) {
        expect(res).to.have.status(200);
        expect(res).to.be.json;
        expect(res.body).to.be.a('array');
        expect(res.body).to.have.length(4);
        expect(res.body[0]).to.be.an('object');
      });
  });

  it('should return an empty array for an incorrect query', function() {
    return chai
      .request(app)
      .get('/api/notes?searchTerm=Not%20a%20Valid%20Search')
      .then(function(res) {
        expect(res).to.have.status(200);
        expect(res).to.be.json;
        expect(res.body).to.be.a('array');
        expect(res.body).to.have.length(0);
      });
  });

});

describe('GET/api/notes/:id', function() {
  it('should return correct note object with id, title, content', function() {
    return chai
      .request(app)
      .get('/api/notes/1000')
      .then(function(res) {
        expect(res).to.have.status(200);
        expect(res).to.be.json;
        expect(res.body).to.be.an('object');
        expect(res.body).to.include.key('id', 'title', 'content');
        expect(res.body.id).to.equal(1000);
        expect(res.body.title).to.equal('5 life lessons learned from cats');
      });
  });

  // it('should respond with a 404 for an invalid ID', function() {
  //   return chai
  //     .request(app)
  //     .get('/api/notes/DOESNOTEXIST')
  //     .catch(err => err.response)
  //     .then(function(res) {
  //       expect(res).to.have.status(404);
  //     });
  // });
});

describe('POST/api/notes', function() {
  
  it('shoud create and return a new item with location header when provided valid data', function() {
    const newItem = {
      'title': 'New Note!',
      'content': 'This is test for the new note'
    };

    return chai
      .request(app)
      .post('/api/notes')
      .send(newItem)
      .then(function(res) {
        expect(res).to.have.status(201);
        expect(res).to.be.json;
        expect(res.body).to.be.a('object');
        expect(res.body).to.include.keys('id', 'title', 'content');

        expect(res.body.id).to.equal(1010);
        expect(res.body.title).to.equal(newItem.title);
        expect(res.body.content).to.equal(newItem.content);
        expect(res).to.have.header('location');
      });
  
  });

  it('should return an error when missing "title" field', function () {
    const newItem = {
      'foo': 'bar'
    };
    return chai.request(app)
      .post('/api/notes')
      .send(newItem)
      .catch(err => err.response)
      .then(res => {
        expect(res).to.have.status(400);
        expect(res).to.be.json;
        expect(res.body).to.be.a('object');
        expect(res.body.message).to.equal('Missing `title` in request body');
      });
  });

});

describe('PUT/api/notes/:id', function() {
  it('should update the note', function () {
    const updateItem = {
      'title': 'Updated title',
      'content': 'The updated version of this content'
    };
    return chai.request(app)
      .put('/api/notes/1005')
      .send(updateItem)
      .then(function (res) {
        expect(res).to.have.status(200);
        expect(res).to.be.json;
        expect(res.body).to.be.a('object');
        expect(res.body).to.include.keys('id', 'title', 'content');

        expect(res.body.id).to.equal(1005);
        expect(res.body.title).to.equal(updateItem.title);
        expect(res.body.content).to.equal(updateItem.content);
      });
  });

  it('should respond with a 404 for an invalid id', function () {
    const updateItem = {
      'title': 'Updated title',
      'content': 'This is the updated content'
    };
    return chai.request(app)
      .put('/api/notes/DOESNOTEXIST')
      .send(updateItem)
      .catch(err => err.response)
      .then(res => {
        expect(res).to.have.status(404);
      });
  });

  it('should return an error when missing "title" field', function () {
    const updateItem = {
      'foo': 'bar'
    };
    return chai.request(app)
      .put('/api/notes/1005')
      .send(updateItem)
      .catch(err => err.response)
      .then(res => {
        expect(res).to.have.status(400);
        expect(res).to.be.json;
        expect(res.body).to.be.a('object');
      });
  });
});

describe('DELETE/api/notes/:id', function() {
  it('should delete an item by id', function() {
    return chai
      .request(app)
      .delete('/api/notes/1000')
      .then(function(res) {
        expect(res).to.have.status(204);
      });
  });
});