// jscs:disable requireDollarBeforejQueryAssignment

var _ = require('lodash');
var appRoot = require('app-root-dir').get();
var fs = require('fs');
var gulp = require('gulp');
var gutil = require('gulp-util');
var jsdom = require('jsdom');

gulp.task('update', function (cb) {
  // fetches smiley metadata from SA and then collates against already
  // stored JSON

  var smiliesURL = 'http://forums.somethingawful.com/' +
                   'misc.php?action=showsmilies';
  var newSmilies = {};
  var oldSmilies = require(appRoot + '/src/smilies.json');
  var oldCount = Object.keys(oldSmilies).length;
  var output = {};

  // fetch smiley metadata
  jsdom.env(
    smiliesURL,
    ['https://ajax.googleapis.com/ajax/libs/jquery/2.2.0/jquery.min.js'],
    function (err, window) {
      var $ = window.$;
      $('.smilie').each(function () {
        var smiley = {};
        smiley.name = $(this).children('.text').text().trim();
        smiley.url = $(this).children('img').attr('src');
        smiley.image = smiley.url.split('/').slice(-1)[0];
        smiley.caption = $(this).children('img').attr('title');
        newSmilies[smiley.name] = smiley;
      });

      // loop through the existing smilies.
      _.forEach(oldSmilies, function (smiley) {
        if (!_.isUndefined(newSmilies[smiley.name])) {
          // if an old smiley exists in the newSmilies collection, push it to
          // the output collection and remove it from the newSmilies collection
          // (expected / typical)
          output[smiley.name] = smiley;
          delete newSmilies[smiley.name];
          delete oldSmilies[smiley.name];
        } else {
          // if an old smiley does not exist in the newSmilies collection, mark
          // it as removed and move it to the output collection
          smiley.date.removed = Date.now();
          output[smiley.name] = smiley;
          delete oldSmilies[smiley.name];
        }
      });

      // loop through the newSmilies that survived the culling
      _.forEach(newSmilies, function (smiley) {
        smiley.date = {
          added: Date.now(),
          removed: false,
        };

        output[smiley.name] = smiley;
        delete newSmilies[smiley.name];
      });

      // save output to /src/smilies.json
      fs.writeFileSync(appRoot + '/src/smilies.json', JSON.stringify(output));

      var newCount = Object.keys(output).length;
      var countDiff = newCount - oldCount;

      if (countDiff > 0) {
        gutil.log(gutil.colors.green('✓ Update completed. Found ' + countDiff +
                                     ' new smilies.'));
      } else {
        gutil.log(gutil.colors.yellow('✓ Update completed. No new smilies ' +
                                    'found.'));
      }

      cb();
    });
}); // end of update task
