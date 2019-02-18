const gulp = require('gulp'),
    sass = require('gulp-sass'),
    imagemin = require('gulp-imagemin'),
    // sourcemaps = require('gulp-sourcemaps'),
    // babel = require('gulp-babel'),
    uglify = require('gulp-uglify'),
    // concat = require('gulp-concat'),
    connect = require('gulp-connect'),
    webpack = require('webpack'),
    webpackStream = require('webpack-stream'),
    webpackConfig = require('./webpack.config.js');


gulp.task('message', function () {
    return console.log('Gulp is Running');
});
gulp.task('connect', function () {
    connect.server({
        port: 8880
    });
});

//Copy All HTML
gulp.task('copyHtml', function () {
    gulp.src('src/*.html')
        .pipe(gulp.dest('dist'));
});

//Optimize Images
gulp.task('imageMin', function () {
    gulp.src('src/images/**/*')
        .pipe(imagemin())
        .pipe(gulp.dest('dist/images'))
});


//Scripts
gulp.task('scripts', function () {
    return gulp.src('src/js/*.js')
        /*.pipe(sourcemaps.init())
        .pipe(babel({
            presets: ['@babel/env']
        }))
        .pipe(concat('main.js'))
        .pipe(sourcemaps.write('.'))*/
        .pipe(uglify())
        //.pipe(webpackStream(webpackConfig), webpack)
        .pipe(gulp.dest('dist/js'))

});

//Compile Sass
gulp.task('sass', function () {
    return gulp.src('src/scss/*.scss')
        .pipe(sass()).on('error', sass.logError)
        .pipe(uglify())
        .pipe(gulp.dest('dist/css'))
});

gulp.task('default', gulp.parallel('copyHtml', 'imageMin', 'scripts', 'sass'));


gulp.task('watch', function () {
    gulp.watch('src/js/*.js', gulp.series('scripts'));
    gulp.watch('src/images/*', gulp.series('imageMin'));
    gulp.watch('src/scss/*.scss', gulp.series('sass'));
});