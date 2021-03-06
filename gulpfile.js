const gulp = require('gulp');
const browserSync = require('browser-sync');
const pug = require('gulp-pug');
const sass = require('gulp-sass');
const spritesmith = require('gulp.spritesmith');
const rimraf = require('rimraf');
const rename = require('gulp-rename');
const autoprefixer = require('gulp-autoprefixer');
const sourcemaps = require('gulp-sourcemaps');




/*---------------- Server -----------------*/

gulp.task('server', function() {
    browserSync.init({
        server: {
            port: 9000,
            baseDir: 'build'
        }
    });

    gulp.watch('build/**/*').on('change', browserSync.reload);
}); 

/*---------------- Templates -----------------*/

gulp.task('templates:compile', function buildHTML() {
    return gulp.src('source/template/index.pug')
        .pipe(pug({
            pretty: true
        }))
        .pipe(gulp.dest('build'))
});

/*---------------- Styles -----------------*/

gulp.task('styles:compile', function () {
  return gulp.src('source/styles/main.scss')
    .pipe(sourcemaps.init())
        .pipe(autoprefixer())
        .pipe(sass({outputStyle: 'compressed'}).on('error', sass.logError))
        .pipe(rename('main.min.css'))
    .pipe(sourcemaps.write('./map'))
    .pipe(gulp.dest('build/css'));
});

/*---------------- Sprite -----------------*/

gulp.task('sprite', function (cb) {
    const spriteData = gulp.src('images/*.png').pipe(spritesmith({
      imgName: 'sprite.png',
      imgPath: '../images/sprite.png',
      cssName: 'sprite.scss'
    }));

    spriteData.img.pipe(gulp.dest('build/images'));
    spriteData.css.pipe(gulp.dest('source/styles/global/'));
    cb();
});

/*---------------- Cleaner -----------------*/

gulp.task('clean', function(cb) {
    return rimraf('build', cb);
});

/*---------------- Copy fonts -----------------*/

gulp.task('copy:fonts', function() {
    return gulp.src('./source/fonts/**/*.*')
    .pipe(gulp.dest('build/fonts'));
});

/*---------------- Copy images -----------------*/

gulp.task('copy:images', function() {
    return gulp.src('./source/images/**/*.*')
    .pipe(gulp.dest('build/images'));
});

/*---------------- Copy images -----------------*/

gulp.task('copy', gulp.parallel('copy:fonts', 'copy:images'));

/*---------------- Watchers -----------------*/

gulp.task('watch', function() {
    gulp.watch('source/templates/**/*.pug', gulp.series('templates:compile'));
    gulp.watch('source/styles/**/*.scss', gulp.series('styles:compile'));
});

gulp.task('default', gulp.series(
    'clean',
    gulp.parallel('templates:compile', 'styles:compile', 'sprite', 'copy'),
    gulp.parallel('watch', 'server')
  )
);