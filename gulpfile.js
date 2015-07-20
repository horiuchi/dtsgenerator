"use strict";

var gulp = require('gulp');
var gutil = require('gulp-util');
var plugins = require('gulp-load-plugins')();
var runSequence = require('run-sequence');
var del = require('del');


var paths = {
  tsc: {
    src: 'lib/**/*.ts',
    dest: 'lib/',
    test: {
      src: 'test/**/*.ts',
      dest: 'test/',
      powered: 'test-powered/'
    },
    clean: [
      'lib/**/*.js*',
      'test/**/*.js*',
      'test-powered/**/*.js*',
    ]
  },
  mocha: {
    src: ['test-powered/**/*.js']
  },
  istanbul: {
    src: ['lib/**/*.js', 'index.js']
  },
  coveralls: {
    src: ['coverage/lcov.info']
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

  tsResult.removeAllListeners('error');
  tsResult.on('error', function(err) {
    result.emit('error', new gutil.PluginError('gulp-typescript', err.toString()));
  });
  var result = tsResult.js
    .pipe(plugins.sourcemaps.write('.'))
    .pipe(gulp.dest(paths.tsc.dest));
  return result;
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


gulp.task('power-assert', function() {
  return gulp.src(paths.tsc.test.dest + '**/*.js')
    .pipe(plugins.sourcemaps.init())
    .pipe(plugins.espower())
    .pipe(plugins.sourcemaps.write('.'))
    .pipe(gulp.dest(paths.tsc.test.powered));
});
gulp.task('exec-test', function(cb) {
  gulp.src(paths.istanbul.src)
    .pipe(plugins.istanbul())
    .pipe(plugins.istanbul.hookRequire())
    .on('finish', function() {
      gulp.src(paths.mocha.src, {read: false})
        .pipe(plugins.mocha({reporter: 'tap'}))
        .on('error', cb)
        .pipe(plugins.istanbul.writeReports({reporters: [ 'lcov', 'json', 'text', 'text-summary' ]}))
        .on('end', cb);
    });
});

gulp.task('coveralls', ['exec-test'], function() {
  return gulp.src(paths.coveralls.src)
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
  runSequence('compile', cb);
});
gulp.task('clean-build', function(cb) {
  runSequence('clean', 'build', cb);
});
gulp.task('test', function(cb) {
  runSequence('clean', 'compile', 'compile-test', 'power-assert', 'exec-test', cb);
});
gulp.task('test-cov', function(cb) {
  runSequence('test', 'coveralls', cb);
});
gulp.task('default', ['clean-build'], function() {});

