var _ = require('lodash');
var $ = require('gulp-load-plugins')();
var appRoot = require('app-root-dir').get();
var gulp = require('gulp');
var vendorCfg = require('../vendor.config.json');

gulp.task('vendorScripts', function () {
  var scripts = [];
  _.forEach(vendorCfg.scripts, function (script) {
    scripts.push(appRoot + '/bower_components/' + script);
  });

  return gulp.src(scripts)
    .pipe($.concat('vendor.js'))
    .pipe(gulp.dest(appRoot + '/src/scripts/'));
});

gulp.task('scripts', ['vendorScripts'], function () {
  return gulp.src([appRoot + '/src/scripts/vendor.js',
                   appRoot + '/src/scripts/routes.js',
                   appRoot + '/src/scripts/app.js',
                  ])
    .pipe($.concat('waffle-smilies.min.js'))
    // .pipe($.uglify())
    .pipe(gulp.dest(appRoot + '/src/scripts/'));
});
