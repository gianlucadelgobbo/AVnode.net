const assert = require('assert');
const indexPlugin = require('../../../app/plugins/elasticsearch/Crew');

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

describe('Elasticsearch: Crew Index Plugin', () => {
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
    const crew = {
      _id: '656789076',
      secret: 'this should not be indexed'
    };
    const indexer = (clean) => {
      assert.notDeepEqual(clean, crew, 'not indexing whole crew');
      assert.equal(clean.index, 'avnode');
      assert.equal(clean.type, 'crew');
    };

    let internal;

    const schema = {
      post(hook, fn) {
        if (hook === 'save') {
          internal = fn.bind(crew);
        }
      }
    };
    indexPlugin(getEsStub(indexer))(schema, {});
    internal();
  });
});
