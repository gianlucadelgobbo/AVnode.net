const request = require('supertest');
const server = require('../../index');

describe('/login', () => {
  beforeEach(() => {
  });

  afterEach(() => {
  });

  it('GET to /login returns 200 and a login form',  (done) => {
    request(server)
      .get('/login')
      .expect('Content-Type', /html/)
      .expect(/email/)
      .expect(/password/)
      .expect(200, done);
  });

  it('POST to /login redirects to /',  (done) => {
    request(server)
      .post('/login')
      .expect(302, done);
  });

  it('POST to /login redirects to /',  (done) => {
    request(server)
      .post('/login')
      .field('firstname', 'Max')
      .expect(302, done);
  });

  xit('POST to /login returns 200 with right payload',  (done) => {
    // FIXME: Find out how to
    // decide if such a test makes sense
    // keep mock credentials in the database for testing
    // send body data in the right form with supertest…
    request(server)
      .post('/login')
      .end((_err, _res) => {
        done();
      });
  });
});
