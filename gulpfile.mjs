// gulpfile.mjs (entry point)
import { series, parallel } from 'gulp';
import { compress_css, compress_css_admin, compress_css_oembed, watch_scss } from './gulp/tasks/css.js';
import { compress_js, compress_js_admin, compress_js_oembed, compress_js_video, compress_js_maps, compress_js_vjtv, watch_js } from './gulp/tasks/js.js';

export const watch = parallel(watch_js, watch_scss);

export {
  compress_css,
  compress_css_admin,
  compress_css_oembed,
  compress_js,
  compress_js_admin,
  compress_js_oembed,
  compress_js_video,
  compress_js_maps,
  compress_js_vjtv
};

export default series(
  compress_css,
  compress_css_admin,
  compress_js,
  compress_js_video,
  compress_js_maps,
  compress_js_vjtv,
  compress_js_admin,
  compress_css_oembed,
  compress_js_oembed
);
