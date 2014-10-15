"use strict";

var gulp = require('gulp');
var plugins = require('gulp-load-plugins')();
var del = require('del');


var paths = {
  tsc: {
    src: 'lib/**/*.ts',
    dest: 'lib/',
    clean: 'lib/**/*.js*'
  }
};
var tsProject = plugins.typescript.createProject({
  target: 'ES5',
  module: 'commonjs',
  noImplicitAny: true,
});


gulp.task('compile', function() {
  var tsResult = gulp.src([paths.tsc.src])
                  .pipe(plugins.sourcemaps.init())
                  .pipe(plugins.typescript(tsProject));
  tsResult.js
    .pipe(plugins.sourcemaps.write())
    .pipe(gulp.dest(paths.tsc.dest));
});

gulp.task('tsd', function(cb) {
  plugins.tsd({
    command: 'reinstall',
    config: './tsd.json'
  }, cb);
});


gulp.task('test', function() {
});


gulp.task('clean', function(cb) {
  del([paths.tsc.clean], cb);

});

gulp.task('watch', function() {
  gulp.watch([paths.tsc.src], ['compile']);
});


gulp.task('build', function(cb) {
  plugins.runSequence('tsd', 'compile', cb);
});
gulp.task('clean-build', function(cb) {
  plugins.runSequence('clean', 'build', cb);
});
gulp.task('default', ['clean-build'], function() {});

