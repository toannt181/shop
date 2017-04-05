var gulp = require('gulp');
var concat = require('gulp-concat');
var connect = require('gulp-connect');
var browserify = require('browserify');
var source = require('vinyl-source-stream');
var buffer = require('vinyl-buffer');
var map = require('vinyl-map');
var vinylPaths = require('vinyl-paths');
var jshint = require('gulp-jshint');
var uglify = require('gulp-uglify');
var gulpNgConfig = require('gulp-ng-config');
var rev = require('gulp-rev');
var sourcemaps = require('gulp-sourcemaps');
var CleanCSS = require('clean-css');
var fs = require('fs');
var del = require('del');
var revReplace = require('gulp-rev-replace');

gulp.task('connect', function () {
    connect.server({
        root: 'public',
        port: 3000
    });
});

var paths = {
    styles: [
        'resources/assets/css/style.css',
        'resources/assets/css/menu-mobile.css',
    ],
    scripts: [
        'resources/assets/js/jquery-1.11.0.min.js',
        'resources/assets/js/mobile-menu.js',
        'resources/assets/js/allscript.js',
    ],
    appScripts: [
        './app/app.module.js',
        './app/config.js',
        './app/app.config.js',
        './app/controllers/**/*.js',
        './app/services/**/*.js',
        './app/directives/**/*.js',
        './app/filters/**/*.js'
    ],
    browserify: 'resources/build/js/app.js',
    version: ['./resources/build/css/*.css', './resources/build/js/*.js'],
    output: {
        baseDir: 'public/assets',
        resourcesBuild: 'resources/build',
        resourcesBuildCss: 'resources/build/css',
        resourcesBuildJs: 'resources/build/js',
    }
};

gulp.task('styles', function () {
    var minify = function () {
        return map(function (buff, filename) {
            return new CleanCSS()
                .minify(buff.toString())
                .styles;
        });
    }

    return gulp.src(paths.styles)
        .pipe(sourcemaps.init())
        .pipe(concat('app.css'))
        .pipe(minify())
        .pipe(sourcemaps.write('.'))
        .pipe(gulp.dest(paths.output.resourcesBuildCss));
});

gulp.task('config', function () {
    gulp.src('./config.json')
        .pipe(gulpNgConfig('gApp.config'))
        .pipe(gulp.dest('./app/'));
});

gulp.task('scripts', function () {
    gulp.src(paths.scripts)
        .pipe(sourcemaps.init())
        .pipe(concat('libs.js'))
        .pipe(sourcemaps.write('.'))
        .pipe(gulp.dest(paths.output.resourcesBuildJs));

    return gulp.src(paths.appScripts)
        .pipe(jshint())
        .pipe(jshint.reporter('default'))
        .pipe(concat('app.js'))
        .pipe(gulp.dest(paths.output.resourcesBuildJs));
});

gulp.task('browserify', function () {
    return browserify(paths.browserify)
        .bundle()
        .pipe(source('app.js'))
        .pipe(buffer())
        .pipe(sourcemaps.init())
        .pipe(uglify())
        .pipe(sourcemaps.write('.'))
        .pipe(gulp.dest(paths.output.resourcesBuildJs));
});

gulp.task('version', function () {
    var files = vinylPaths();

    const manifest = paths.output.baseDir + '/rev-manifest.json';

    var emptyBuildPathFiles = function (buildPath, manifest) {
        fs.stat(manifest, function (err, stat) {
            if (! err) {
                manifest = JSON.parse(fs.readFileSync(manifest));

                for (var key in manifest) {
                    del.sync(buildPath + '/' + manifest[key], { force: true });
                }
            }
        });
    };

    emptyBuildPathFiles(paths.output.baseDir, manifest);

    var filePathPrefix = paths.output.baseDir.replace('public', '').replace('\\','/') + '/';

    return gulp.src(paths.version, { base: './' + paths.output.resourcesBuild })
        .pipe(gulp.dest(paths.output.baseDir))
        .pipe(files)
        .pipe(rev())
        .pipe(revReplace({prefix: filePathPrefix}))
        .pipe(gulp.dest(paths.output.baseDir))
        .pipe(rev.manifest())
        .pipe(gulp.dest(paths.output.baseDir));
});

gulp.task('default', ['connect']);