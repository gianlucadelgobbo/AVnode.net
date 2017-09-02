const assert = require('assert');
const slug = require('../../lib/utilities/slug');
const Event = require('../../lib/models/Event');

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
      process.env.BASE + 'account/events/foo-bar',
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
      process.env.BASE + 'events/foo-bar',
      event.publicUrl
    );
    done();
  });
});
