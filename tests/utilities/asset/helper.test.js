const assert = require('assert');
const helper = require('../../../lib/utilities/asset/helper');

describe('Asset Helper Utitility', () => {
  beforeEach(() => {
  });
  afterEach(() => {
  });
  it('isYoutube should return true on valid youtube link', () => {
    const url = 'https://www.youtube.com/watch?v=OaRBPXLgKyg';
    assert.equal(
      true,
      helper.isYoutube(url)
    );
  });
  it('isYoutube should return true on valid youtu.be link', () => {
    const url = 'https://youtu.be/OaRBPXLgKyg';
    assert.equal(
      true,
      helper.isYoutube(url)
    );
  });
  it('isYoutube should return true on missing proctocol', () => {
    const url = 'https://youtu.be/OaRBPXLgKyg';
    assert.equal(
      true,
      helper.isYoutube(url)
    );
  });
  it('isYoutube should return false on missing slug', () => {
    const url = 'https://youtu.be/';
    assert.equal(
      false,
      helper.isYoutube(url)
    );
  });
  it('isYoutube should return false on invalid url', () => {
    const url = 'https://vimeo.com/207528129';
    assert.equal(
      false,
      helper.isYoutube(url)
    );
  });

  it('isYoutube should return false on invalid url', () => {
    const url = 'https://vimeo.com/207528129';
    assert.equal(
      false,
      helper.isYoutube(url)
    );
  });

  it('isVimeo should return true on valid url', () => {
    const url = 'https://vimeo.com/207528129';
    assert.equal(
      true,
      helper.isVimeo(url)
    );
  });

  it('isVimeo should return true on valid url with missing protocol', () => {
    const url = 'vimeo.com/207528129';
    assert.equal(
      true,
      helper.isVimeo(url)
    );
  });

  it('isVimeo should return false on missing slug', () => {
    const url = 'https://vimeo.com/';
    assert.equal(
      false,
      helper.isVimeo(url)
    );
  });

  it('isVimeo should return false on invalid url', () => {
    const url = 'youtu.be/OaRBPXLgKyg';
    assert.equal(
      false,
      helper.isVimeo(url)
    );
  });

  it('getVideoType should return youtube for youtube link', () => {
    const url = 'youtu.be/OaRBPXLgKyg';
    assert.equal(
      'youtube',
      helper.getVideoType(url)
    );
  });

  it('getVideoType should return vimeo for vimeo link', () => {
    const url = 'vimeo.com/207528129';
    assert.equal(
      'vimeo',
      helper.getVideoType(url)
    );
  });

  it('getVideoType should return unknown for unknown video link', () => {
    const url = 'some-unknonw-hoster.com/207528129';
    assert.equal(
      'unknown',
      helper.getVideoType(url)
    );
  });

  /* BL FIXME
  it('setIdentifier should prepend stagename following by random uuid', () => {
    const prefix = 'el-majestro';

    const identifier = helper.setIdentifier(prefix);
    const regex = /^el-majestro_.{8}-.{4}-.{4}-.{4}-.{12}/;

    assert.equal(
      true,
      regex.test(identifier)
    );
  }); */

  it('should extract youtube video id from https://www.youtube.com/watch?v=_QdPW8JrYzQ', () => {
    const url = 'https://www.youtube.com/watch?v=_QdPW8JrYzQ';
    assert.equal(
        '_QdPW8JrYzQ',
        helper.youtubeParser(url)
      );
  });

  it('should extract youtube video id from https://youtu.be/_QdPW8JrYzQ', () => {
    const url = 'https://youtu.be/_QdPW8JrYzQ';
    assert.equal(
        '_QdPW8JrYzQ',
        helper.youtubeParser(url)
      );
  });

  it('should extract vimeo id from https://vimeo.com/208509565', () => {
    const url = 'https://vimeo.com/208509565';
    assert.equal(
        '208509565',
        helper.vimeoParser(url)
      );
  });

  it('should extract vimeo id from vimeo.com/208509565', () => {
    const url = 'vimeo.com/208509565';
    assert.equal(
        '208509565',
        helper.vimeoParser(url)
      );
  });

  it('should return return proper storageFolder', () => {
    console.log(process.env.STORAGE);
  });

});
