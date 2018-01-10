const assert = require('assert');
const helper = require('../../../app/utilities/asset/helper');

describe('Asset Helper Utitility', () => {
  beforeEach(() => {
  });
  afterEach(() => {
  });
  it('isYoutube should return true on valid youtube link', () => {
    const url = 'https://www.youtube.com/watch?v=O7NmiIv6l38';
    assert.equal(
      true,
      helper.isYoutube(url)
    );
  });
  it('isYoutube should return true on valid youtu.be link', () => {
    const url = 'https://youtu.be/O7NmiIv6l38';
    assert.equal(
      true,
      helper.isYoutube(url)
    );
  });
  it('isYoutube should return true on missing proctocol', () => {
    const url = 'https://youtu.be/O7NmiIv6l38';
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
    const url = 'https://vimeo.com/202193116';
    assert.equal(
      false,
      helper.isYoutube(url)
    );
  });

  it('isYoutube should return false on invalid url', () => {
    const url = 'https://vimeo.com/202193116';
    assert.equal(
      false,
      helper.isYoutube(url)
    );
  });

  it('isVimeo should return true on valid url', () => {
    const url = 'https://vimeo.com/202193116';
    assert.equal(
      true,
      helper.isVimeo(url)
    );
  });

  it('isVimeo should return true on valid url with missing protocol', () => {
    const url = 'vimeo.com/202193116';
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
    const url = 'youtu.be/O7NmiIv6l38';
    assert.equal(
      false,
      helper.isVimeo(url)
    );
  });

  it('getVideoType should return youtube for youtube link', () => {
    const url = 'youtu.be/O7NmiIv6l38';
    assert.equal(
      'youtube',
      helper.getVideoType(url)
    );
  });

  it('getVideoType should return vimeo for vimeo link', () => {
    const url = 'vimeo.com/202193116';
    assert.equal(
      'vimeo',
      helper.getVideoType(url)
    );
  });

  it('getVideoType should return unknown for unknown video link', () => {
    const url = 'some-unknonw-hoster.com/202193116';
    assert.equal(
      'unknown',
      helper.getVideoType(url)
    );
  });

  /* BL FIXME
  it('setIdentifier should prepend username following by random uuid', () => {
    const prefix = 'el-majestro';

    const identifier = helper.setIdentifier(prefix);
    const regex = /^el-majestro_.{8}-.{4}-.{4}-.{4}-.{12}/;

    assert.equal(
      true,
      regex.test(identifier)
    );
  }); */

  it('should extract youtube video id from https://www.youtube.com/watch?v=O7NmiIv6l38', () => {
    const url = 'https://www.youtube.com/watch?v=O7NmiIv6l38';
    assert.equal(
        'O7NmiIv6l38',
        helper.youtubeParser(url)
      );
  });

  it('should extract youtube video id from https://youtu.be/O7NmiIv6l38', () => {
    const url = 'https://youtu.be/O7NmiIv6l38';
    assert.equal(
        'O7NmiIv6l38',
        helper.youtubeParser(url)
      );
  });

  it('should extract vimeo id from https://vimeo.com/202193116', () => {
    const url = 'https://vimeo.com/202193116';
    assert.equal(
        '202193116',
        helper.vimeoParser(url)
      );
  });

  it('should extract vimeo id from vimeo.com/202193116', () => {
    const url = 'vimeo.com/202193116';
    assert.equal(
        '202193116',
        helper.vimeoParser(url)
      );
  });

  it('should return return proper storageFolder', () => {
    console.log(process.env.STORAGE);
  });

});
