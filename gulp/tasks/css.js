// tasks/css.js
import gulp from 'gulp';
import dartSass from 'sass';
import gulpSass from 'gulp-sass';
import concat from 'gulp-concat';

const sass = gulpSass(dartSass);

const config = {
  publicDir: './public',
};

const sassOptions = {
  outputStyle: 'compressed',
  includePaths: ['./gulp/sass', './gulp/bootstrap/scss']
};

export const compress_css = () => {
  return gulp.src(['./gulp/sass/main.scss'])
    .pipe(sass(sassOptions))
    .pipe(concat('main.min.css'))
    .pipe(gulp.dest(config.publicDir + '/css'));
};

export const compress_css_admin = () => {
  return gulp.src(['./gulp/sass/admin.scss'])
  .pipe(sass(sassOptions))
  .pipe(concat('admin.min.css'))
    .pipe(gulp.dest(config.publicDir + '/css'));
};
/* export const compress_css_fe = () => {
  return gulp.src(['./gulp/sass/fe.scss'])
    .pipe(sass(sassOptions))
    .pipe(concat('fe.min.css'))
    .pipe(gulp.dest(config.publicDir + '/css'));
}; */

export const compress_css_oembed = () => {
  return gulp.src(['./gulp/sass/oembed.scss'])
  .pipe(sass(sassOptions))
  .pipe(concat('oembed.min.css'))
    .pipe(gulp.dest(config.publicDir + '/css'));
};

export const watch_scss = () => {
  gulp.watch('./gulp/sass/**/*.scss', gulp.series(
    () => gulp.src(['./gulp/sass/main.scss'])
      .pipe(sass({ outputStyle: 'compressed' }))
      .pipe(concat('main.min.css'))
      .pipe(gulp.dest(`${config.publicDir}/css`)),

    () => gulp.src(['./gulp/sass/admin.scss'])
      .pipe(sass({ outputStyle: 'compressed' }))
      .pipe(concat('admin.min.css'))
      .pipe(gulp.dest(`${config.publicDir}/css`)),

    () => gulp.src(['./gulp/sass/oembed.scss'])
      .pipe(sass({ outputStyle: 'compressed' }))
      .pipe(concat('oembed.min.css'))
      .pipe(gulp.dest(`${config.publicDir}/css`))
  ));
};