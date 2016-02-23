var appRoot = require('app-root-dir').get();
var browserSync = require('browser-sync');
var gulp        = require('gulp');
var harp        = require('harp');
var browserSync = require('browser-sync');
var reload      = browserSync.reload;

/**
 * Serve the Harp Site from the src directory
 */
gulp.task('serve', ['scripts'], function () {
  harp.server(appRoot + '/src', {
    port: 9000,
  }, function () {
    browserSync({
      proxy: 'localhost:9000',
      open: false,
      /* Hide the notification. It gets annoying */
      notify: {
        styles: ['opacity: 0', 'position: absolute'],
      },
    });
    /**
     * Watch for scss changes, tell BrowserSync to refresh main.css
     */
    gulp.watch([appRoot + '/src/styles/*.{css,sass,scss,less}'], function () {
      reload(appRoot + '/src/styles/main.css', { stream: true });
    });
    /**
     * Watch for all other changes, reload the whole page
     */
    gulp.watch([appRoot + '/src/**/*.{html,ejs,jade,js,json,md}'], function () {
      reload();
    });
  });
});
