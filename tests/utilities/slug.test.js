const assert = require('assert');
const slug = require('../../lib/utilities/slug');

describe('slug parse', () => {
  beforeEach(() => {
  });
  afterEach(() => {
  });
  it('should return valid url for a simple string input', (done) => {
    assert.equal(
      'this-is-a-valid-slug',
      slug.parse('This is a valid Slug')
    );
    done();
  });
  it('should return valid url for a bunch of special characters', (done) => {
    assert.equal(
      'aaaaa-c-eeee-iiii-n-ooooo-uuuu-yy',
      slug.parse('àáâãä   ç èéêë ìíîï ñ òóôõö ùúûü ýÿ')
    );
    done();
  });
});
