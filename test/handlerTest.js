const request = require('supertest');
const {app} = require('../js/handler');

describe('/GET', () => {
  it('should give index.html', done => {
    request(app.serve.bind(app))
      .get('/')
      .expect(200)
      .expect('content-type', 'text/html')
      .expect('content-length', '1021')
      .expect('Date', /.*GMT$/)
      .expect(/Flower Catalog/, done);
  });

  it('should give ageratum File content', done => {
    request(app.serve.bind(app))
      .get('/html/Ageratum.html')
      .expect(200)
      .expect('content-type', 'text/html')
      .expect('content-length', '1245')
      .expect('Date', /.*GMT$/)
      .expect(/Ageratum/, done);
  });

  it('should give ageratum File content', done => {
    request(app.serve.bind(app))
      .get('/html/Abeliophyllum.html')
      .expect(200)
      .expect('content-type', 'text/html')
      .expect('content-length', '1433')
      .expect('Date', /.*GMT$/)
      .expect(/Abeliophyllum/, done);
  });

  it('should give css File content', done => {
    request(app.serve.bind(app))
      .get('/css/flower.css')
      .expect(200)
      .expect('content-type', 'text/css')
      .expect('content-length', '251')
      .expect('Date', /.*GMT$/)
      .expect(/header/, done);
  });

  it('guestPage.html should give dynamic guestPages', function(done) {
    request(app.serve.bind(app))
      .get('/html/guestBook.html')
      .expect(200)
      .expect('Content-Type', 'text/html')
      .expect('Date', /.*GMT$/)
      .expect(/Guest Book/, done);
  });

  it('should give NOT FOUND response for nonExisting file', function(done) {
    request(app.serve.bind(app))
      .get('/doesNotExist')
      .expect(404, done);
  });
});

describe('POST comments', function() {
  it('should show guestBook page content', function(done) {
    request(app.serve.bind(app))
      .post('/html/guestBook.html')
      .send('name=vikram&comment=hello')
      .expect(303, done);
  });
});

describe('PUT comments', function() {
  it('should say method not allowed', function(done) {
    request(app.serve.bind(app))
      .put('/html/guestBook.html')
      .expect(400, done);
  });
});
