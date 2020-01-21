var gulp = require('gulp');
var sass = require('gulp-sass');
var uglify = require('gulp-uglify');
var concat = require('gulp-concat');

var config = {
  modulesDir: './node_modules',
  publicDir: './public',
};

var tasklist = [
  //'css_avnode_bs',
  'compress_js_avnode'
];

gulp.task('css_avnode_bs', function() {
  return gulp.src('./gulp/sass/avnode/*.scss')
    .pipe(sass({
      outputStyle: 'compressed',
      includePaths: [config.modulesDir + '/bootstrap-sass/assets/stylesheets'],
    }))
    .pipe(gulp.dest(config.publicDir + '/avnode/css'));
});

gulp.task('compress_js_avnode', function() {
  return gulp.src([
      config.modulesDir + '/jquery/dist/jquery.min.js',
      config.modulesDir + '/popper.js/dist/umd/popper.min.js',
      config.modulesDir + '/bootstrap/dist/js/bootstrap.min.js'/* ,
      './gulp/js/main.js' */
    ])
    .pipe(concat('combo.min.js'))
    //.pipe(uglify())
    .pipe(gulp.dest(config.publicDir + '/js/'));
});



gulp.task('default', tasklist);

/*
var editions_lpm = [
  '2004-rome',
  '2005-rome',
  '2006-rome',
  '2007-rome',
  '2008-mex',
  '2008-rome',
  '2009-rome',
  '2010-rome',
  '2011-minsk',
  '2011-rome',
  '2012-rome',
  '2013-cape-town',
  '2013-mex',
  '2013-rome',
  '2014-eindhoven',
  '2015-rome',
  '2016-amsterdam',
  '2017-amsterdam',
  '2018-rome'
];
var excludeXL = [
  '2011-minsk',
  '2011-rome',
  '2010-rome',
  '2009-rome',
  '2008-rome',
  '2008-mex',
  '2007-rome',
  '2006-rome',
  '2005-rome',
  '2004-rome'
];
var editions_lcf = [
  '2014-rome',
  '2015-rome',
  '2016-rome',
  '2017-rome'
];

var editions_chromosphere = [
  'nye-2016-rome'
];

var editions_fotonica = [
  '2017-rome'
];


gulp.task('js_bs', function() {
  return gulp.src(config.modulesDir + '/bootstrap-sass/assets/javascripts/bootstrap.min.js')
  //.pipe(gulp.dest(config.publicDir + '/_common/js'));
  .pipe(gulp.dest('./gulp/js/_common'));
});

gulp.task('js_jq', function() {
  return gulp.src(config.modulesDir + '/jquery/dist/jquery.min.js')
    .pipe(gulp.dest('./gulp/js/_common'));
});

gulp.task('compress_js_common', function() {
  gulp.src(['!./gulp/js/_common/*.min.js', './gulp/js/_common/*.js'])
      .pipe(minify({
        ext:{
          min:'.min.js'
        },
        exclude: ['tasks'],
        ignoreFiles: ['.combo.js', '-min.js']
      }))
      .pipe(gulp.dest(config.publicDir + '/_common/js/'))
});

gulp.task('concat_common_scripts', function() {
  return gulp.src([
    config.publicDir + '/_common/js/jquery.min.js',
    config.publicDir + '/_common/js/jquery.isotope.min.js',
    config.publicDir + '/_common/js/imagesloaded.pkgd.min.js',
    config.publicDir + '/_common/js/cookielawinfo.min.js',
    config.publicDir + '/_common/js/bootstrap.min.js',
    config.publicDir + '/_common/js/script.min.js'
  ])
      .pipe(concat('combo.min.js'))
      .pipe(gulp.dest(config.publicDir + '/_common/js/'));
});
gulp.task('concat_avnode_css', function() {
  return gulp.src([
    config.publicDir + '/_common/css/fontello.css',
    config.publicDir + '/_common/css/fontello-animation.css',
    config.publicDir + '/_common/css/socialGalleryPluginLite.css',
    config.publicDir + '/_common/css/cookielawinfo.css',
    config.publicDir + '/avnode/css/bootstrap.min.css',
    config.publicDir + '/_common/css/bootstrapXL.css',
    config.publicDir + '/_common/css/style.css',
    config.publicDir + '/avnode/css/style.css'
  ])
    .pipe(concat('combo.min.css'), {newLine: '\r\n'})
    .pipe(gulp.dest(config.publicDir + '/avnode/css/'));
});

gulp.task('concat_flyer_css', function() {
  return gulp.src([
    config.publicDir + '/_common/css/fontello.css',
    config.publicDir + '/_common/css/fontello-animation.css',
    config.publicDir + '/_common/css/socialGalleryPluginLite.css',
    config.publicDir + '/_common/css/cookielawinfo.css',
    config.publicDir + '/flyer/css/bootstrap.min.css',
    config.publicDir + '/_common/css/bootstrapXL.css',
    config.publicDir + '/_common/css/style.css',
    config.publicDir + '/flyer/css/style.css'
  ])
    .pipe(concat('combo.min.css'), {newLine: '\r\n'})
    .pipe(gulp.dest(config.publicDir + '/flyer/css/'));
});

gulp.task('concat_linuxclub_css', function() {
  return gulp.src([
    config.publicDir + '/_common/css/fontello.css',
    config.publicDir + '/_common/css/fontello-animation.css',
    config.publicDir + '/_common/css/socialGalleryPluginLite.css',
    config.publicDir + '/_common/css/cookielawinfo.css',
    config.publicDir + '/linuxclub/css/bootstrap.min.css',
    config.publicDir + '/_common/css/bootstrapXL.css',
    config.publicDir + '/_common/css/style.css',
    config.publicDir + '/linuxclub/css/style.css'
  ])
    .pipe(concat('combo.min.css'), {newLine: '\r\n'})
    .pipe(gulp.dest(config.publicDir + '/linuxclub/css/'));
});

gulp.task('concat_shockart_css', function() {
  return gulp.src([
    config.publicDir + '/_common/css/fontello.css',
    config.publicDir + '/_common/css/fontello-animation.css',
    config.publicDir + '/_common/css/socialGalleryPluginLite.css',
    config.publicDir + '/_common/css/cookielawinfo.css',
    config.publicDir + '/shockart/css/bootstrap.min.css',
    config.publicDir + '/_common/css/bootstrapXL.css',
    config.publicDir + '/_common/css/style.css',
    config.publicDir + '/shockart/css/style.css',
  ])
    .pipe(concat('combo.min.css'), {newLine: '\r\n'})
    .pipe(gulp.dest(config.publicDir + '/shockart/css/'));
});

gulp.task('concat_vjtelevision_css', function() {
  return gulp.src([
    config.publicDir + '/_common/css/fontello.css',
    config.publicDir + '/_common/css/fontello-animation.css',
    config.publicDir + '/_common/css/socialGalleryPluginLite.css',
    config.publicDir + '/_common/css/cookielawinfo.css',
    config.publicDir + '/vjtelevision/css/bootstrap.min.css',
    config.publicDir + '/_common/css/bootstrapXL.css',
    config.publicDir + '/_common/css/style.css',
    config.publicDir + '/vjtelevision/css/style.css'
  ])
    .pipe(concat('combo.min.css'), {newLine: '\r\n'})
    .pipe(gulp.dest(config.publicDir + '/vjtelevision/css/'));
});

gulp.task('concat_wam_css', function() {
  return gulp.src([
    config.publicDir + '/_common/css/fontello.css',
    config.publicDir + '/_common/css/fontello-animation.css',
    config.publicDir + '/_common/css/socialGalleryPluginLite.css',
    config.publicDir + '/_common/css/cookielawinfo.css',
    config.publicDir + '/wam/css/bootstrap.min.css',
    config.publicDir + '/_common/css/bootstrapXL.css',
    config.publicDir + '/_common/css/style.css',
    config.publicDir + '/wam/css/style.css'
  ])
    .pipe(concat('combo.min.css'), {newLine: '\r\n'})
    .pipe(gulp.dest(config.publicDir + '/wam/css/'));
});

gulp.task('concat_lcf_css', function() {
  for (var item in editions_lcf) {
    var csslist = [
      config.publicDir + '/_common/css/fontello.css',
      config.publicDir + '/_common/css/fontello-animation.css',
      config.publicDir + '/_common/css/socialGalleryPluginLite.css',
      config.publicDir + '/_common/css/cookielawinfo.css',
      config.publicDir + '/lcf/css/bootstrap.min.lcf.' + editions_lcf[item] + '.css',
      config.publicDir + '/_common/css/style.css',
      config.publicDir + '/lcf/css/style.lcf.css',
      config.publicDir + '/lcf/css/style.lcf.' + editions_lcf[item] + '.css',
    ];
    csslist.push(config.publicDir + '/_common/css/bootstrapXL.css');
    bella_lcf(csslist,editions_lcf,item);

  }
});

gulp.task('concat_chromosphere_css', function() {
  for (var item in editions_chromosphere) {
    var csslist = [
      config.publicDir + '/_common/css/fontello.css',
      config.publicDir + '/_common/css/fontello-animation.css',
      config.publicDir + '/_common/css/socialGalleryPluginLite.css',
      config.publicDir + '/_common/css/cookielawinfo.css',
      config.publicDir + '/chromosphere/css/bootstrap.min.chromosphere.' + editions_chromosphere[item] + '.css',
      config.publicDir + '/_common/css/style.css',
      config.publicDir + '/chromosphere/css/style.chromosphere.css',
      config.publicDir + '/chromosphere/css/style.chromosphere.' + editions_chromosphere[item] + '.css',
    ];
    csslist.push(config.publicDir + '/_common/css/bootstrapXL.css');
    bella_chromosphere(csslist,editions_chromosphere,item);

  }
});

gulp.task('concat_fotonica_css', function() {
  for (var item in editions_fotonica) {
    var csslist = [
      config.publicDir + '/_common/css/fontello.css',
      config.publicDir + '/_common/css/fontello-animation.css',
      config.publicDir + '/_common/css/socialGalleryPluginLite.css',
      config.publicDir + '/_common/css/cookielawinfo.css',
      config.publicDir + '/fotonica/css/bootstrap.min.fotonica.' + editions_fotonica[item] + '.css',
      config.publicDir + '/_common/css/style.css',
      config.publicDir + '/fotonica/css/style.fotonica.css',
      config.publicDir + '/fotonica/css/style.fotonica.' + editions_fotonica[item] + '.css',
    ];
    csslist.push(config.publicDir + '/_common/css/bootstrapXL.css');
    bella_fotonica(csslist,editions_fotonica,item);

  }
});

gulp.task('concat_lpm_css', function() {
  for (var item in editions_lpm) {
    var csslist = [
      config.publicDir + '/_common/css/fontello.css',
      config.publicDir + '/_common/css/fontello-animation.css',
      config.publicDir + '/_common/css/socialGalleryPluginLite.css',
      config.publicDir + '/_common/css/cookielawinfo.css',
      config.publicDir + '/lpm/css/bootstrap.min.lpm.' + editions_lpm[item] + '.css',
      config.publicDir + '/_common/css/style.css',
      config.publicDir + '/lpm/css/style.lpm.css',
      config.publicDir + '/lpm/css/style.lpm.' + editions_lpm[item] + '.css',
      config.modulesDir  + '/swiper/dist/css/swiper.min.css',
    ];
    if (excludeXL.indexOf(editions_lpm[item]) == -1) csslist.push(config.publicDir + '/_common/css/bootstrapXL.css');
    bella_lpm(csslist,editions_lpm,item);

  }
});
function bella_lpm (csslist,editions_lpm,item){
  return gulp.src(csslist)
    .pipe(concat('combo.lpm.' + editions_lpm[item] + '.min.css'), {newLine: '\r\n'})
    .pipe(gulp.dest(config.publicDir + '/lpm/css/'));
}
function bella_lcf (csslist,editions_lcf,item){
  return gulp.src(csslist)
    .pipe(concat('combo.lcf.' + editions_lcf[item] + '.min.css'), {newLine: '\r\n'})
    .pipe(gulp.dest(config.publicDir + '/lcf/css/'));
}
function bella_chromosphere (csslist,editions_chromosphere,item){
  return gulp.src(csslist)
      .pipe(concat('combo.chromosphere.' + editions_chromosphere[item] + '.min.css'), {newLine: '\r\n'})
      .pipe(gulp.dest(config.publicDir + '/chromosphere/css/'));
}
function bella_fotonica (csslist,editions_fotonica,item){
  return gulp.src(csslist)
      .pipe(concat('combo.fotonica.' + editions_fotonica[item] + '.min.css'), {newLine: '\r\n'})
      .pipe(gulp.dest(config.publicDir + '/fotonica/css/'));
}
*/
