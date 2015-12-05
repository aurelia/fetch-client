var gulp = require('gulp');
var karma = require('karma').server;
var coveralls = require('gulp-coveralls');

/**
 * Run test once and exit
 */
gulp.task('test', function (done) {
    karma.start({
        configFile: __dirname + '/../../karma.conf.js',
        singleRun: true
    }, function(e) {
        done(e === 0 ? null : 'karma exited with status ' + e);
    });
});

/**
 * Watch for file changes and re-run tests on each change
 */
gulp.task('tdd', function (done) {
    karma.start({
        configFile: __dirname + '/../../karma.conf.js'
    }, function(e) {
        done();
    });
});

/**
 * Report coverage to coveralls
 */
gulp.task('coveralls', ['test'], function (done) {
  gulp.src('build/reports/coverage/lcov/report-lcovonly.txt')
    .pipe(coveralls());
});
