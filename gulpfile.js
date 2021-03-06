var gulp = require('gulp'),
    sass = require('gulp-ruby-sass'),
    autoprefixer = require('gulp-autoprefixer'),
    minifycss = require('gulp-cssnano'),
    uglify = require('gulp-uglify'),
    imagemin = require('gulp-imagemin'),
    rename = require('gulp-rename'),
    del = require('del'),
    flatten = require('gulp-flatten')
    combiner = require('stream-combiner2'),
    ts = require('gulp-typescript');;

gulp.task('styles', function() {
  sass('src/styles/main.2017w.scss', { style: 'expanded' })
    .pipe(autoprefixer('last 2 version'))
    .pipe(gulp.dest('dist/assets/css'))
    .pipe(rename({suffix: '.min'}))
    .pipe(minifycss())
    .pipe(gulp.dest('dist/assets/css'))
  sass('src/styles/live.scss', { style: 'expanded' })
    .pipe(autoprefixer('last 2 version'))
    .pipe(gulp.dest('dist/assets/css'))
    .pipe(rename({suffix: '.min'}))
    .pipe(minifycss())
    .pipe(gulp.dest('dist/assets/css'))
  sass('src/styles/static.scss', { style: 'expanded' })
    .pipe(autoprefixer('last 2 version'))
    .pipe(gulp.dest('dist/assets/css'))
    .pipe(rename({suffix: '.min'}))
    .pipe(minifycss())
    .pipe(gulp.dest('dist/assets/css'))
});

gulp.task('scripts', function() {
  gulp.src('src/scripts/snowflakes.ts')
    .pipe(ts({
        out: 'snowflakes.webgl.js'
    }))
    .pipe(gulp.dest('src/scripts'));

  var combined = combiner.obj([
    gulp.src('src/scripts/**/*.js'),
    gulp.dest('dist/assets/js'),
    rename({suffix: '.min'}),
    uglify(),
    gulp.dest('dist/assets/js'),
  ]);
  combined.on('error', console.error.bind(console));
  return combined;
});

gulp.task('fonts', function() {
  return gulp.src('src/fonts/**/*')
    .pipe(gulp.dest('dist/assets/fonts'))
});

gulp.task('dependencies', function() {
  return gulp.src(['bower_components/**/*.min.js', '!bower_components/**/src/**/*.min.js'])
    .pipe(flatten({ includeParents: 0}))
    .pipe(gulp.dest('dist/assets/js'))
});

gulp.task('images', function() {
  return gulp.src('src/images/**/*')
    //.pipe(imagemin({ optimizationLevel: 3, progressive: true, interlaced: true }))
    .pipe(gulp.dest('dist/assets/img'))
});

gulp.task('templates', function() {
  return gulp.src('src/templates/**/*')
    .pipe(gulp.dest('dist/assets/templates'))
})

gulp.task('data', function() {
  return gulp.src('src/data/**/*')
    .pipe(gulp.dest('dist/assets/data'))
})

gulp.task('clean', function(cb) {
    del(['dist/assets/css', 'dist/assets/js', 'dist/assets/img', 'src/scripts/snowflakes.webgl.js'], cb)
});

gulp.task('default', ['dependencies', 'styles', 'scripts', 'images', 'fonts', 'templates', 'data'], function() {
});

gulp.task('watch', function() {
  // Watch .scss files
  gulp.watch('src/styles/**/*.scss', ['styles']);
  // Watch .js files
  gulp.watch('src/scripts/**/*.js', ['scripts']);
  gulp.watch('src/scripts/**/*.ts', ['scripts']);
  // Watch font files
  gulp.watch('src/fonts/**/*', ['fonts']);
  // Watch image files
  gulp.watch('src/images/**/*', ['images']);
  // Watch data files
  gulp.watch('src/data/**/*', ['data']);
  // Watch template files
  gulp.watch('src/templates/**/*', ['templates']);
  // Watch dependencies
  gulp.watch('bower_components/**/*.min.js', ['dependencies']);
});
