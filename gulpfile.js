var gulp = require('gulp');
var sass = require('gulp-sass');
var header = require('gulp-header');
var cleancss = require('gulp-clean-css');
var rename = require('gulp-rename');
var uglify = require('gulp-uglify');
var pkg = require('./package.json');

// Set the banner content
var banner = ['/*!\n',
    ' * <%= pkg.title %>: A Beastie Supported Production\n', 
    ' * Copyright 2017-' + (new Date()).getFullYear(), ' <%= pkg.author %>\n',
    ' * Licensed under <%= pkg.license %> \n',
    ' */\n',
    ''
].join('');

// Compile SASS files from /sass into /css
gulp.task('sass', function() {
    return gulp.src('_src/sass/main.scss')
        .pipe(sass())
        .pipe(header(banner, { pkg: pkg }))
        .pipe(gulp.dest('_src/css'))
});

// Minify compiled CSS TODO write to HTML file
gulp.task('minify-css', gulp.series('sass', function() {
    return gulp.src('_src/css/main.css')
        .pipe(cleancss({ compatibility: 'ie8' }))
        .pipe(rename({ suffix: '.min' }))
        .pipe(gulp.dest('_dist/css'))
}));

// Minify JS TODO add plugins file; write to HTML file
gulp.task('minify-js', function() {
    return gulp.src('_src/js/main.js')
        .pipe(uglify())
        .pipe(header(banner, { pkg: pkg }))
        .pipe(rename({ suffix: '.min' }))
        .pipe(gulp.dest('_dist/js'))
});

// Write HTML files


// Copy staged HTML and vendor libraries from /node_modules into /vendor
gulp.task('copy', async function() {
    // Bootstrap
    gulp.src(['node_modules/bootstrap/dist/**/*', '!**/npm.js', '!**/bootstrap-theme.*', '!**/*.map'])
        .pipe(gulp.dest('_dist/vendor/bootstrap'))
    // jQuery
    gulp.src(['node_modules/jquery/dist/jquery.js', 'node_modules/jquery/dist/jquery.min.js'])
        .pipe(gulp.dest('_dist/vendor/jquery'))
    // Normalize
    gulp.src('node_modules/normalize.css/normalize.css')
        .pipe(gulp.dest('_dist/vendor/normalize'))
    // Modernizr
    gulp.src('node_modules/modernizr/lib/**/*')
        .pipe(gulp.dest('_dist/vendor/modernizr'))
    // ...add more

    gulp.src([
            'node_modules/font-awesome/**',
            '!node_modules/font-awesome/**/*.map',
            '!node_modules/font-awesome/.npmignore',
            '!node_modules/font-awesome/*.txt',
            '!node_modules/font-awesome/*.md',
            '!node_modules/font-awesome/*.json'
        ])
        .pipe(gulp.dest('_dist/vendor/font-awesome'))
})

// Run everything
gulp.task('default', gulp.parallel('sass', 'minify-css', 'minify-js', 'copy'));

