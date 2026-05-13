// tasks/js.js
import gulp from 'gulp';
import terser from 'gulp-terser';
import concat from 'gulp-concat';
import dartSass from 'sass';
import gulpSass from 'gulp-sass';

const sass = gulpSass(dartSass);

const config = {
  publicDir: './public',
};

export const compress_js = () => {
  return gulp.src([
    `./gulp/jquery/dist/jquery.min.js`,
    `./gulp/popper.js/dist/umd/popper.min.js`,
    `./gulp/bootstrap/dist/js/bootstrap.min.js`
  ])
  .pipe(concat('combo.min.js'))
  .pipe(terser({ mangle: { reserved: ['glink'] } }))
  .pipe(gulp.dest(`${config.publicDir}/js/`));
};

export const compress_js_fe = () => {
  return gulp.src([
    './gulp/js/includes_main/owl.carousel.min.js',
    './gulp/js/main.js',
    './gulp/js/includes_main/ajax.js',
    './gulp/js/includes_main/cookielawinfo.min.js'
  ])
  .pipe(concat('combo.min.js'))
  .pipe(terser({ mangle: { reserved: ['glink'] } }))
  .pipe(gulp.dest(`${config.publicDir}/js/`));
};

export const compress_js_admin = () => {
  return gulp.src([
    './gulp/js/includes_main/owl.carousel.min.js',
    './gulp/js/main.js',
    './gulp/js/admin.js',
    './gulp/js/includes_admin/bsMultiSelect.min.js',
    './gulp/js/includes_admin/jquery-ui.js',
    './gulp/js/includes_admin/moment-with-locales.min.js',
    './gulp/js/includes_admin/jquery.serializejson.min.js',
    './gulp/js/includes_admin/jquery.tablednd.1.0.5.min.js',
    './gulp/js/includes_admin/bootstrap-table.min.js',
    './gulp/js/includes_admin/bootstrap-table-reorder-rows.min.js',
    './gulp/js/includes_admin/jquery.geocomplete.js',
    './gulp/js/includes_admin/dropzone.min.js',

    './gulp/datetimeentry/jquery.plugin.js',
    './gulp/datetimeentry/jquery.datetimeentry.js',
    './gulp/js/includes_admin/bootstrap-autocomplete.min.js',

    './gulp/js/includes_admin/admin_tmp.js',
  ])
  .pipe(concat('combo_admin.min.js'))
  .pipe(terser({ mangle: { reserved: ['glink'] } }))
  .pipe(gulp.dest(`${config.publicDir}/js/`));
};

export const compress_js_oembed = () => {
  return gulp.src([
    `./gulp/jquery/dist/jquery.min.js`,
    //'./gulp/js/includes_video/swfobject.js',
    //'./gulp/js/includes_video/videojs.js',
    './gulp/js/includes_video/videojs-logo.min.js',
    './gulp/js/includes_main/ajax.js',
    './gulp/js/includes_main/cookielawinfo.min.js',
    './gulp/js/oembed.js'
  ])
  .pipe(concat('oembed.min.js'))
  .pipe(terser({ mangle: { reserved: ['glink'] } }))
  .pipe(gulp.dest(`${config.publicDir}/js/`));
};

export const compress_js_video = () => {
  return gulp.src([
    //-'./gulp/js/includes_video/swfobject.js',
    //'./gulp/js/includes_video/videojs.js',
    './gulp/js/includes_video/videojs-logo.min.js',
    './gulp/js/video.js'
  ])
  .pipe(concat('combo_video.min.js'))
  .pipe(terser({ mangle: { reserved: ['glink'] } }))
  .pipe(gulp.dest(`${config.publicDir}/js/`));
};

export const compress_js_maps = () => {
  return gulp.src([
    './gulp/js/mymaps.js'
  ])
  .pipe(concat('combo_mymaps.min.js'))
  .pipe(terser({ mangle: { reserved: ['glink'] } }))
  .pipe(gulp.dest(`${config.publicDir}/js/`));
};

export const compress_js_vjtv = () => {
  return gulp.src([
    './gulp/js/vjtv.js',
    './gulp/js/includes_vjtv/videojs-playlist.min.js'
  ])
  .pipe(concat('vjtv.min.js'))
  .pipe(terser({ mangle: { reserved: ['glink'] } }))
  .pipe(gulp.dest(`${config.publicDir}/js/`));
};

export const watch_js = () => {
  gulp.watch('./gulp/js/**/*.js',
    gulp.series(
      compress_js,
      compress_js_admin,
      compress_js_oembed,
      compress_js_video,
      compress_js_maps,
      compress_js_vjtv
    )
  );
};


