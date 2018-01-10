const assert = require('assert');
const slug = require('../../app/utilities/slug');
const Event = require('../../app/models/Event');

describe('Event', () => {
  beforeEach(() => {
  });
  afterEach(() => {
  });
  it('should have a valid virtual property editUrl', (done) => {
    const event = new Event({
      title: 'Foo Bar',
      slug: slug.parse('Foo Bar')
    });
    assert.equal(
      '/admin/events/foo-bar',
      event.editUrl
    );
    done();
  });
  it('should have a valid virtual property publicUrl', (done) => {
    const event = new Event({
      title: 'Foo Bar',
      slug: slug.parse('Foo Bar')
    });
    assert.equal(
      '/events/foo-bar',
      event.publicUrl
    );
    done();
  });
});
