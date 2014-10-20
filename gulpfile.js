"use strict";

var gulp = require('gulp');
var plugins = require('gulp-load-plugins')();
var runSequence = require('run-sequence');
var del = require('del');
// for power-assert
require('intelli-espower-loader');


var paths = {
  tsc: {
    src: 'lib/**/*.ts',
    dest: 'lib/',
    test: {
      src: 'test/**/*.ts',
      dest: 'test/'
    },
    clean: ['lib/**/*.js*', 'test/**/*.js*']
  },
  mocha: {
    src: ['test/**/*.js']
  }
};
var tsProject = plugins.typescript.createProject({
  target: 'ES5',
  module: 'commonjs',
  noImplicitAny: true,
});
var tsTestProject = plugins.typescript.createProject({
  target: 'ES5',
  module: 'commonjs',
  noImplicitAny: true,
});


gulp.task('compile', function() {
  var tsResult = gulp.src([paths.tsc.src])
                  .pipe(plugins.sourcemaps.init())
                  .pipe(plugins.typescript(tsProject));
  return tsResult.js
    .pipe(plugins.sourcemaps.write())
    .pipe(gulp.dest(paths.tsc.dest));
});
gulp.task('compile-test', function() {
  var tsResult = gulp.src([paths.tsc.test.src])
                  .pipe(plugins.typescript(tsTestProject));
  return tsResult.js
    .pipe(gulp.dest(paths.tsc.test.dest));
});

gulp.task('tsd', function(cb) {
  plugins.tsd({
    command: 'reinstall',
    config: './tsd.json'
  }, cb);
});


gulp.task('exec-test', ['compile', 'compile-test'], function(cb) {
  gulp.src(['lib/**/*.js', 'index.js'])
    .pipe(plugins.istanbul())
    .on('finish', function() {
      gulp.src(paths.mocha.src, {read: false})
        .pipe(plugins.mocha({reporter: 'tap'}))
        .on('error', cb)
        .pipe(plugins.istanbul.writeReports())
        .on('end', cb);
    });
});

gulp.task('coveralls', ['exec-test'], function() {
  return gulp.src('coverage/**/lcov.info')
    .pipe(plugins.coveralls());
});


gulp.task('clean', function(cb) {
  del(paths.tsc.clean, cb);
});

gulp.task('watch', function() {
  gulp.watch([paths.tsc.src], ['exec-test']);
  gulp.watch([paths.tsc.test.src], ['exec-test']);
});


gulp.task('build', function(cb) {
  runSequence('tsd', 'compile', cb);
});
gulp.task('clean-build', function(cb) {
  runSequence('clean', 'build', cb);
});
gulp.task('test', function(cb) {
  runSequence('clean','tsd', 'exec-test', cb);
});
gulp.task('test-cov', function(cb) {
  runSequence('clean', 'tsd', 'exec-test', 'coveralls', cb);
});
gulp.task('default', ['clean-build'], function() {});

