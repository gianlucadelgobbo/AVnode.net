const server = require('../../server');
const request = require('supertest');
const mongoose = require('mongoose');


describe('Routes: /', () => {
  before((done) => {
    mongoose.models = {};
    mongoose.modelSchemas = {};
    server.listen(done);
  });
  after((done) => {
    server.listen().close();
    done();
  });

  it('GET to /returns 200 and a page',  (done) => {
    request(server)
      .get('/')
      .expect('Content-Type', /html/)
      .expect(/h1/)
      .expect(200, done);
  });

  it('GET to unknown route returns 404', (done) => {
    request(server)
      .get('/foo/bar')
      .expect(404, done);
  });
});
