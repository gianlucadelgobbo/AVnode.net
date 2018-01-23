const request = require('supertest');
//const server = require('../../index');
const server = require('../../server');
//const mongoose = require('mongoose');

describe('Routes: /', () => {
  before((done) => {
    //mongoose.models = {};
    //mongoose.modelSchemas = {};
    //server.listen(done);
    done();
  });
  after((done) => {
    //server.listen().close();
    done();
  });

  it('GET to unknown route returns 404', (done) => {
    request(server)
      .get('/foo/bar')
      .expect(404, done);
  });

});
