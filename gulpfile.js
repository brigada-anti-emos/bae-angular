var gulp = require('gulp');
var ngmin = require('gulp-ngmin');
var watch = require('gulp-watch');
var concat = require('gulp-concat');
var templateCache = require('gulp-angular-templatecache');

var jsFiles = ['src/module.js', 'src/**/module.js', 'src/*.js', 'src/bae/**/*.js'];
var tplFiles = ['src/*.html', 'src/**/*.html', 'src/**/**/*.html'];

gulp.task('templates', function () {
  return gulp.src(tplFiles)
    .pipe(templateCache())
    .pipe(gulp.dest('public/dist'));
});

gulp.task('scripts', function() {
	
	gulp.src(jsFiles)
		.pipe(concat('bae-angular.js'))
		.pipe(gulp.dest('./release/'));
});


gulp.task('watch',function() {
    gulp.watch(jsFiles,['scripts']);
});

gulp.task('default', ['scripts', 'watch']);