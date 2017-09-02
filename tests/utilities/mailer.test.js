const assert = require('assert');
const mailer = require('../../lib/utilities/mailer');

describe('Mailer', () => {
  beforeEach(() => {
    process.env.ACCESSKEYID = '';
    process.env.SECRETACCESSKEY = '';
  });

  it('throws error if ACCESSKEYID config value is missing', () => {
    process.env.SECRETACCESSKEY = 'foof';
    assert.equal(process.env.ACCESSKEYID, '', 'ACCESSKEYID is blank');
    assert.throws(mailer.signup, Error);
  });

  it('throws error if SECRETACCESSKEY config value is missing', () => {
    process.env.ACCESSKEYID = 'foof';
    assert.equal(process.env.SECRETACCESSKEY, '', 'SECRETACCESSKEY is blank');
    assert.throws(mailer.signup, Error);
  });

  xit('does not throw error if config values are set', () => {
    // FIXME: Refactor mailer to allow for such a test…
    process.env.ACCESSKEYID = 'foof';
    process.env.SECRETACCESSKEY = 'foof';
    /*
    assert.doesNotThrow(() => {
      mailer.signup(…);
    }));
    */
  });
});
