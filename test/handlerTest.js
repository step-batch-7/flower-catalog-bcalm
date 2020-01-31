const request = require('supertest');
const {app} = require('../js/handler');

describe('/GET', () => {
  it('should give index.html', done => {
    const filePath = './testFile.json';
    request((req, res) => app.serve(req, res, filePath))
      .get('/')
      .expect(200)
      .expect('content-type', 'text/html')
      .expect('content-length', '1021')
      .expect('Date', /.*GMT$/)
      .expect(/Flower Catalog/, done);
  });

  it('should give ageratum File content', done => {
    const filePath = './testFile.json';
    request((req, res) => app.serve(req, res, filePath))
      .get('/html/Ageratum.html')
      .expect(200)
      .expect('content-type', 'text/html')
      .expect('content-length', '1245')
      .expect('Date', /.*GMT$/)
      .expect(/Ageratum/, done);
  });

  it('should give abeliophyllum File content', done => {
    const filePath = './testFile.json';
    request((req, res) => app.serve(req, res, filePath))
      .get('/html/Abeliophyllum.html')
      .expect(200)
      .expect('content-type', 'text/html')
      .expect('content-length', '1433')
      .expect('Date', /.*GMT$/)
      .expect(/Abeliophyllum/, done);
  });

  it('should give css File content', done => {
    const filePath = './testFile.json';
    request((req, res) => app.serve(req, res, filePath))
      .get('/css/flower.css')
      .expect(200)
      .expect('content-type', 'text/css')
      .expect('content-length', '251')
      .expect('Date', /.*GMT$/)
      .expect(/header/, done);
  });

  it('guestPage.html should give dynamic guestPages', function(done) {
    const filePath = './testFile.json';
    request((req, res) => app.serve(req, res, filePath))
      .get('/html/guestBook.html')
      .expect(200)
      .expect('Content-Type', 'text/html')
      .expect('Date', /.*GMT$/)
      .expect(/Guest Book/, done);
  });

  it('should give NOT FOUND response for nonExisting file', function(done) {
    const filePath = './testFile.json';
    request((req, res) => app.serve(req, res, filePath))
      .get('/doesNotExist')
      .expect(404, done);
  });
});

describe('POST comments', function() {
  it('should show guestBook page content', function(done) {
    const filePath = './testFile.json';
    request((req, res) => app.serve(req, res, filePath))
      .post('/html/guestBook.html')
      .send('name=vikram&comment=hello')
      .expect(303, done);
  });
});

describe('PUT comments', function() {
  it('should say method not allowed', function(done) {
    const filePath = './testFile.json';
    request((req, res) => app.serve(req, res, filePath))
      .put('/html/guestBook.html')
      .expect(400, done);
  });
});
