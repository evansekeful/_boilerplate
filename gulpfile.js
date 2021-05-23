var gulp = require('gulp');
var header = require('gulp-header');
var fonts = require('gulp-google-webfonts');
var sass = require('gulp-sass');
var cleancss = require('gulp-clean-css');
var rename = require('gulp-rename');
var uglify = require('gulp-uglify');
var tap = require('gulp-tap');
var concat = require('gulp-concat');
var inject = require('gulp-inject');
var ga = require('gulp-ga');
var pkg = require('./package.json');

// Set the banner content
var banner = ['/*!\n',
    ' * <%= pkg.title %>: A Beastie Supported Production\n', 
    ' * Copyright 2017-' + (new Date()).getFullYear(), ' <%= pkg.author %>\n',
    ' * Licensed under <%= pkg.license %> \n',
    ' */\n',
    ''
].join('');

// Generate fonts css and copy into /_src/css
var fontoptions = {
    fontsDir: '_dist/fonts',
    cssDir: '_src/css',
    cssFilename: 'google-fonts.css'
};

gulp.task('fonts', function() {
    return gulp.src('./fonts.list')
        .pipe(fonts(fontoptions))
        .pipe(gulp.dest('_src/css'));
});

// Compile SASS files from /_src/sass into /_src/css
gulp.task('sass', function() {
    return gulp.src('_src/sass/main.scss')
        .pipe(sass())
        .pipe(header(banner, { pkg: pkg }))
        .pipe(gulp.dest('_src/css'))
});

// Minify compiled CSS and copy into /_dist/css TODO write to HTML file
gulp.task('minify-css', gulp.series('fonts','sass', function() {
    return gulp.src(['_src/css/main.css','_src/css/google-fonts.css'])
        .pipe(concat('main.css'))
        .pipe(cleancss({ compatibility: 'ie8' }))
        .pipe(rename({ suffix: '.min' }))
        .pipe(gulp.dest('_dist/css'))
}));

// Minify JS and copy into /_dist/js TODO write to HTML file
gulp.task('minify-js', function() {
    return gulp.src(['_src/js/main.js','_src/js/plugins.js'])
        .pipe(concat('main.js'))
        .pipe(uglify())
        .pipe(header(banner, { pkg: pkg }))
        .pipe(rename({ suffix: '.min' }))
        .pipe(gulp.dest('_dist/js'))
});

// Concatenate HTML partials
gulp.task('concat', function() {
    var header = new Buffer(gulp.src('_src/html/partials/header.html'));
    var footer = new Buffer(gulp.src('_src/html/partials/footer.html'));
    return gulp.src('_src/html/content/*.hmtl')
    .pipe(tap(function (file) {
        file.contents = Buffer.concat(
            header,
            file.contents,
            footer)
      }))
    .pipe(gulp.dest('_src/html/staged'))
});

// Write HTML files and copy into /_dist
gulp.task('html', gulp.series('concat', function() {
    return gulp.src('_src/html/staged/*.html')
    .pipe(header(banner, { pkg: pkg }))
    .pipe(ga({url: pkg.url, uid: pkg.ga}))
    .pipe(gulp.dest('_dist'))
}));

// Copy staged HTML and vendor libraries from /node_modules into /_dist/vendor
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
gulp.task('default', gulp.parallel('sass', 'minify-css', 'minify-js', 'html','copy'));

