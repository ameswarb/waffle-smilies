var _ = require('lodash');
var appRoot = require('app-root-dir').get();
var Download = require('download');
var fs = require('fs');
var gulp = require('gulp');
var gutil = require('gulp-util');

gulp.task('download', function (cb) {
  var smilies = require(appRoot + '/src/smilies.json');
  var dlSmilies = [];

  // build list of smilies that need to be downloaded
  _.forEach(smilies, function (smiley) {
    try {
      fs.accessSync(appRoot + '/src/images/' + smiley.image, fs.F_OK);
    } catch (e) {
      dlSmilies.push(smiley);
    }
  });

  if (dlSmilies.length < 1) {
    gutil.log(gutil.colors.green('✓ All smiley images already downloaded.'));
    cb();
    return;
  }

  gutil.log(gutil.colors.white('» About to download ' + dlSmilies.length +
                                ' smilies.'));

  var i = 0;
  var success = 0;
  var fail = 0;
  _.forEach(dlSmilies, function (smiley, x, list) {
    new Download({ mode: '755' })
      .get(smiley.url)
      .dest(appRoot + '/src/images/')
      .run(function (err) {
        i++;
        if (!err) {
          gutil.log(gutil.colors.green('✓ Got ' + smiley.url));
          success++;
        } else {
          gutil.log(gutil.colors.red('✗ Failed: ' + smiley.url));
          fail++;
        }

        if (i === list.length) {
          if (fail < 1) {
            gutil.log(gutil.colors.green('✓ Finished downloading ' +
                                           dlSmilies.length + ' smilies.'));
          } else {
            gutil.log(gutil.colors.yellow('⚠️  Successfully downloaded ' +
                                          success + ' smilies. ' + fail +
                                          ' failed. You might try running ' +
                                          '"gulp download" again.'));
          }

          cb();
        }

      }); // end of run block
  }); // end of _.forEach
}); // end of 'download' task
