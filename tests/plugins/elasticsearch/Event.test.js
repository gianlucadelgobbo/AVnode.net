const assert = require('assert');
const indexPlugin = require('../../../app/utilities/elasticsearch/Event');

const getEsStub = (i = false, r = false) => {
  return {
    getClient() {
      return {
        index(cleaned) {
          if (i) {
            i(cleaned);
          }
        }
      };
    },
    remover() {
      if (r) {
        r();
      }
    }
  };
};

describe('Elasticsearch: Event Index Plugin', () => {
  it('should attach to post-save of schema', () => {
    const schema = {
      post(hook, _fn) {
        const ok = hook === 'save' || hook === 'remove';
        assert.equal(ok, true, 'attached to post save');
      }
    };
    indexPlugin(getEsStub())(schema, {});
  });

  it('should attach to post-remove of schema', () => {
    const schema = {
      post(hook, _fn) {
        const ok = hook === 'save' || hook === 'remove';
        assert.equal(ok, true, 'attached to post remove');
      }
    };
    indexPlugin(getEsStub())(schema, {});
  });

  it('when indexing, it should index reduced model', () => {
    const event = {
      _id: '656789076',
      secret: 'this should not be indexed',
      is_public: true
    };
    const indexer = (clean) => {
      assert.notDeepEqual(clean, event, 'not indexing whole event');
      assert.equal(clean.index, 'avnode');
      assert.equal(clean.type, 'event');
    };

    let internal;

    const schema = {
      post(hook, fn) {
        if (hook === 'save') {
          internal = fn.bind(event);
        }
      }
    };
    indexPlugin(getEsStub(indexer))(schema, {});
    internal();
  });

  xit('does not index when `is_public` is false', () => {
  });
});
