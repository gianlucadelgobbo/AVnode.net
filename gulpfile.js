var gulp = require('gulp');
var sass = require('gulp-sass');
var uglify = require('gulp-terser');
var concat = require('gulp-concat');

var config = {
  npmDir: './node_modules',
  publicDir: './public',
};

var tasklist = [
  'fonts_bs',
  'compress_css',
  'compress_js'
];

const fonts_bs = () => {
  return gulp.src(config.npmDir + '/bootstrap-sass/assets/fonts/bootstrap/**/*')
    .pipe(gulp.dest(config.publicDir + '/fonts'));
}

const compress_css = () => {
  return gulp.src(["./gulp/sass/main.scss"])
  .pipe(sass({outputStyle: 'compressed'}))
  .pipe(concat('main.min.css'))
  //.pipe(uglify({mangle: { reserved: ['glink'] } }))
  .pipe(gulp.dest(config.publicDir + '/css'));
}

const compress_css_admin = () => {
  return gulp.src(["./gulp/sass/admin.scss"])
  .pipe(sass({outputStyle: 'compressed'}))
  .pipe(concat('admin.min.css'))
  //.pipe(uglify({mangle: { reserved: ['glink'] } }))
  .pipe(gulp.dest(config.publicDir + '/css'));
}

const compress_js = () => {
  return gulp.src([
    config.npmDir + '/jquery/dist/jquery.min.js',
    config.npmDir + '/popper.js/dist/umd/popper.min.js',
    //config.npmDir + '/@popperjs/core/dist/umd/popper.min.js',
    config.npmDir + '/bootstrap/dist/js/bootstrap.min.js',
    './gulp/js/includes_main/owl.carousel.min.js',
    './gulp/js/main.js',
    './gulp/js/includes_main/ajax.js',
    './gulp/js/includes_main/cookielawinfo.min.js'
    
  ])
  .pipe(concat('combo.min.js'))
  .pipe(uglify({mangle: { reserved: ['glink'] } }))
  .pipe(gulp.dest(config.publicDir + '/js/'));
}

const compress_js_video = () => {
  return gulp.src([
    './gulp/js/includes_video/swfobject.js',
    './gulp/js/includes_video/videojs.js',
    './gulp/js/includes_video/videojs-logo.min.js',
    './gulp/js/video.js'
  ])
  .pipe(concat('combo_video.min.js'))
  .pipe(uglify({mangle: { reserved: ['glink'] } }))
  .pipe(gulp.dest(config.publicDir + '/js/'));
}

const compress_js_admin = () => {
  return gulp.src([
    './gulp/js/admin.js',
    './gulp/js/includes_admin/jquery-ui.js',
    './gulp/js/includes_admin/moment-with-locales.min.js',
    './gulp/js/includes_admin/jquery.serializejson.min.js',
    './gulp/js/includes_admin/bootstrap-table.min.js',
    './gulp/js/includes_admin/cookielawinfo.min.js',
    './gulp/js/includes_admin/jquery.geocomplete.js',
    './gulp/js/includes_admin/dropzone.min.js'
  ])
  .pipe(concat('combo_admin.min.js'))
  .pipe(uglify({mangle: { reserved: ['glink'] } }))
  .pipe(gulp.dest(config.publicDir + '/js/'));
}

const compress_js_maps = () => {
  return gulp.src([
    './gulp/js/mymaps.js'/* ,
    './gulp/js/includes_video/embed.js',
    './gulp/js/includes_video/videojs-logo.min.js' */
  ])
  .pipe(concat('combo_mymaps.min.js'))
  .pipe(uglify({mangle: { reserved: ['glink'] } }))
  .pipe(gulp.dest(config.publicDir + '/js/'));
}

const compress_js_vjtv = () => {
  return gulp.src([
    './gulp/js/vjtv.js' ,
    './gulp/js/includes_vjtv/videojs-playlist.min.js'/*,
    './gulp/js/includes_video/videojs-logo.min.js' */
  ])
  .pipe(concat('vjtv.min.js'))
  .pipe(uglify({mangle: { reserved: ['glink'] } }))
  .pipe(gulp.dest(config.publicDir + '/js/'));
}


gulp.task('default', gulp.series(compress_css, compress_css_admin, compress_js, compress_js_video, compress_js_maps, compress_js_vjtv, compress_js_admin));
//gulp.task('default', gulp.series(compress_js, compress_js_fotonica,css_fotonica_bs));
//gulp.task('default', gulp.series(compress_js, compress_js_pac,css_pac_bs));
//gulp.task('default', gulp.series(compress_js, compress_js_lcf,css_lcf_bs));
