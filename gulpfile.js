var gulp = require('gulp');
var sass = require('gulp-sass');
var header = require('gulp-header');
var cleancss = require('gulp-clean-css');
var rename = require('gulp-rename');
var uglify = require('gulp-uglify');
//var filter = require('gulp-filter');
var pkg = require('./package.json');

// Set the banner content
var banner = ['/*!\n',
    ' * <%= pkg.title %>: A Beastie Supported Production\n', 
    ' * Copyright 2013-' + (new Date()).getFullYear(), ' <%= pkg.author %>\n', // TODO add copyright date to json and use here
    ' * Licensed under <%= pkg.license %> \n',
    ' */\n',
    ''
].join('');

// Compile SASS files from /sass into /css
gulp.task('sass', function() {
    return gulp.src('sass/main.scss')
        .pipe(sass())
        .pipe(header(banner, { pkg: pkg }))
        .pipe(gulp.dest('css'))
});

// Build Modernizr JS TODO


// Minify compiled CSS TODO verify file paths; write to HTML file
gulp.task('minify-css', gulp.series('sass', function() {
    return gulp.src('css/main.css')
        .pipe(cleancss({ compatibility: 'ie8' }))
        .pipe(rename({ suffix: '.min' }))
        .pipe(gulp.dest('css'))
}));

// Babel JS TODO


// Minify JS TODO verify file paths; write to HTML file
gulp.task('minify-js', function() {
    return gulp.src('js/main.js')
        .pipe(uglify())
        .pipe(header(banner, { pkg: pkg }))
        .pipe(rename({ suffix: '.min' }))
        .pipe(gulp.dest('js'))
});

// Copy vendor libraries from /node_modules into /vendor TODO verify file paths; write to HTML file
gulp.task('copy', async function() {
    // Bootstrap
    gulp.src(['node_modules/bootstrap/dist/**/*', '!**/npm.js', '!**/bootstrap-theme.*', '!**/*.map'])
        .pipe(gulp.dest('vendor/bootstrap'))
    // jQuery
    gulp.src(['node_modules/jquery/dist/jquery.js', 'node_modules/jquery/dist/jquery.min.js'])
        .pipe(gulp.dest('vendor/jquery'))
    // Normalize

    // Modernizr

    // ...add more

    gulp.src([
            'node_modules/font-awesome/**',
            '!node_modules/font-awesome/**/*.map',
            '!node_modules/font-awesome/.npmignore',
            '!node_modules/font-awesome/*.txt',
            '!node_modules/font-awesome/*.md',
            '!node_modules/font-awesome/*.json'
        ])
        .pipe(gulp.dest('vendor/font-awesome'))
})

// Run everything
gulp.task('default', gulp.parallel('sass', 'minify-css', 'minify-js', 'copy'));

