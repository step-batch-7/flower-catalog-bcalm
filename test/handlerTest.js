const request = require('supertest');
const {app} = require('../js/handler');

describe('/GET', () => {
  it('should give index.html', done => {
    request((req, res) => app.serve(req, res))
      .get('/')
      .expect(200)
      .expect('content-type', 'text/html')
      .expect('content-length', '1021')
      .expect('Date', /.*GMT$/)
      .expect(/Flower Catalog/, done);
  });

  it('should give ageratum File content', done => {
    request((req, res) => app.serve(req, res))
      .get('/html/Ageratum.html')
      .expect(200)
      .expect('content-type', 'text/html')
      .expect('content-length', '1245')
      .expect('Date', /.*GMT$/)
      .expect(/Ageratum/, done);
  });

  it('should give abeliophyllum File content', done => {
    request((req, res) => app.serve(req, res))
      .get('/html/Abeliophyllum.html')
      .expect(200)
      .expect('content-type', 'text/html')
      .expect('content-length', '1433')
      .expect('Date', /.*GMT$/)
      .expect(/Abeliophyllum/, done);
  });

  it('should give css File content', done => {
    request((req, res) => app.serve(req, res))
      .get('/css/flower.css')
      .expect(200)
      .expect('content-type', 'text/css')
      .expect('content-length', '251')
      .expect('Date', /.*GMT$/)
      .expect(/header/, done);
  });

  it('guestPage.html should give dynamic guestPages', function(done) {
    request((req, res) => app.serve(req, res))
      .get('/html/guestBook.html')
      .expect(200)
      .expect('Content-Type', 'text/html')
      .expect('Date', /.*GMT$/)
      .expect(/Guest Book/, done);
  });

  it('should give NOT FOUND response for nonExisting file', function(done) {
    request((req, res) => app.serve(req, res))
      .get('/doesNotExist')
      .expect(404, done);
  });
});

describe('POST comments', function() {
  it('should show guestBook page content', function(done) {
    request((req, res) => app.serve(req, res))
      .post('/html/guestBook.html')
      .send('name=vikram&comment=hello')
      .expect(303, done);
  });
});

describe('PUT comments', function() {
  it('should say method not allowed', function(done) {
    request((req, res) => app.serve(req, res))
      .put('/html/guestBook.html')
      .expect(400, done);
  });
});
