"use strict";

var gulp = require('gulp');
var gutil = require('gulp-util');
var plugins = require('gulp-load-plugins')();
var del = require('del');
var runSequence = require('run-sequence');

require('babel-core/register');


var tsProject = plugins.typescript.createProject('tsconfig.json', {
  typescript: require('typescript')
});
gulp.task('compile-ts', function() {
  return tsProject.src()
    .pipe(plugins.sourcemaps.init())
    .pipe(plugins.typescript(tsProject))
    .js
    .pipe(plugins.babel({
        presets: ['es2015']
    }))
    .pipe(plugins.sourcemaps.write('.'))
    .pipe(gulp.dest('.'));
});

gulp.task('tsconfig', plugins.shell.task([
  'tsconfig -u'
]));

gulp.task('tslint', function() {
  return tsProject.src()
    .pipe(plugins.tslint())
    .pipe(plugins.tslint.report(plugins.tslintStylish, {
      emitError: false,
      sort: true,
      bell: false,
      fullPath: true
    }));
});


gulp.task('power-assert', function() {
  return gulp.src('test/**/*.js')
    .pipe(plugins.sourcemaps.init())
    .pipe(plugins.espower())
    .pipe(plugins.sourcemaps.write('.'))
    .pipe(gulp.dest('test-powered/'));
});
gulp.task('exec-test', function(cb) {
  gulp.src('src/**/*.js')
    .pipe(plugins.istanbul())
    .pipe(plugins.istanbul.hookRequire())
    .on('finish', function() {
      gulp.src('test-powered/**/*.js', {read: false})
        .pipe(plugins.mocha({reporter: 'list'}))
        .on('error', cb)
        .pipe(plugins.istanbul.writeReports({reporters: [ 'lcov', 'json', 'text', 'text-summary' ]}))
        .on('end', cb);
    });
});

gulp.task('coveralls', ['exec-test'], function() {
  return gulp.src('coverage/lcov.info')
    .pipe(plugins.coveralls());
});


gulp.task('clean', function() {
  return del([
    'src/**/*.js*',
    'test/**/*.js*',
    'test-powered/**/*.js*',
  ]);
});

gulp.task('watch', function() {
  gulp.watch(['src/**/*.ts', 'test/**/*.ts'], ['test']);
});


gulp.task('compile', function(cb) {
  runSequence('tsconfig', ['compile-ts', 'tslint'], cb);
});
gulp.task('build', function(cb) {
  runSequence('compile', cb);
});
gulp.task('clean-build', function(cb) {
  runSequence('clean', 'build', cb);
});
gulp.task('test', function(cb) {
  runSequence('build', 'power-assert', 'exec-test', cb);
});
gulp.task('test-cov', function(cb) {
  runSequence('clean', 'test', 'coveralls', cb);
});
gulp.task('default', ['clean-build'], function() {});

