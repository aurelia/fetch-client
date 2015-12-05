var gulp = require('gulp');
var runSequence = require('run-sequence');

gulp.task('ci', ['default', 'coveralls']);
