/*!
 * File:        ./gulpfile.js
 * Copyright(c) 2016-2017 Baltrushaitis Tomas
 * License:     MIT
 */

'use strict';

//--------------//
// DEPENDENCIES //
//--------------//

const _ = require('lodash');
const $ = require('jquery');

const fs    = require('fs');
const del   = require('del');
const path  = require('path');
const util  = require('util');
const merge = require('merge-stream');
const utin  = util.inspect;

const argv           = require('yargs').argv;
const parseArgs      = require('minimist');
const vinylPaths     = require('vinyl-paths');
const dateFormat     = require('dateformat');
const mainBowerFiles = require('main-bower-files');

const gulp          = require('gulp');
const gulpTasks     = require('gulp-require-tasks');
const gulpSequence  = require('gulp-sequence').use(gulp);
const changed       = require('gulp-changed');
const chmod         = require('gulp-chmod');
const chown         = require('gulp-chown');
const concat        = require('gulp-concat');
const cleanCSS      = require('gulp-clean-css');
const concatCSS     = require('gulp-concat-css');
const minifyCSS     = require('gulp-minify-css');
const dirSync       = require('gulp-directory-sync');
const exec          = require('gulp-exec');
const filter        = require('gulp-filter');
const gulpif        = require('gulp-if');
const headfoot      = require('gulp-headerfooter');
const jscs          = require('gulp-jscs');
const jshint        = require('gulp-jshint');
const stylish       = require('jshint-stylish');
const rename        = require('gulp-rename');
const template      = require('gulp-template');
const uglify        = require('gulp-uglify');


//---------------//
// CONFIGURATION //
//---------------//

global.ME = {};

const appPath  = __dirname;
const modsPath = path.join(appPath, 'modules');
const confPath = path.join(appPath, 'config', 'config.json');

console.log(`confPath (${typeof confPath}) = [${utin(confPath)}]`);

const pkg    = require('./package.json');
const Config = require('nconf');
const config = require('read-config')(confPath);

ME.Config = Config;
ME.config = config;

// ME.NODE_ENV = 'not_set';
ME.pkg      = _.extend({}, pkg);
ME.version  = ME.pkg.version;
ME.NODE_ENV = argv.env
                ? argv.env
                : fs.existsSync('./NODE_ENV')
                  ? fs.readFileSync('./NODE_ENV', {encoding: 'utf8'}).split('\n')[0].trim()
                  : ME.NODE_ENV;

ME.VERSION = fs.existsSync('./VERSION') ? fs.readFileSync('./VERSION', ME.pkg.options.file).trim() : 'VERSION_UNKNOWN';
ME.COMMIT  = fs.existsSync('./COMMIT') ? fs.readFileSync('./COMMIT',  ME.pkg.options.file).trim() : 'COMMIT_UNKNOWN';

ME.DIR = {};
ME.WD  = path.join(__dirname, path.sep);
ME.DOC = path.join('docs',    path.sep);

ME.TMP    = path.join('tmp',                  path.sep);
ME.SRC    = path.join('src',                  path.sep);
ME.BUILD  = path.join(`build-${ME.VERSION}`,  path.sep);
ME.DIST   = path.join(`dist-${ME.VERSION}`,   path.sep);
ME.WEB    = path.join(`webroot`,              path.sep);
ME.CURDIR = path.join(process.cwd(),          path.sep);
ME.BOWER  = JSON.parse(fs.existsSync('./.bowerrc') ? fs.readFileSync('./.bowerrc') : {directory: "bower_modules"}).directory;

utin.defaultOptions = _.extend({}, ME.pkg.options.iopts);

console.log(`\n`);
console.log(`ME (${typeof ME}) = [${utin(ME)}]`);
console.log(`\n`);


let now = new Date();
let headerTpl = _.template(`/*!
 * Package:\t\t <%= pkg.name %>@<%= pkg.version %>
 * Name:\t\t <%= pkg.title %>
 * Description:\t <%= pkg.description %>
 * Purpose:\t\t <%= ME.NODE_ENV %>
 * Version:\t\t <%= ME.VERSION %>
 * Built:\t\t ${dateFormat(now, 'yyyy-mm-dd')}T${dateFormat(now, 'HH:MM:ss')}
 * Created:\t ${dateFormat(now, 'yyyy')} <%= pkg.author.email %>
 * License:\t\t <%= pkg.license %>
 * Visit:\t\t <%= pkg.homepage %>
 */
`);

let footerTpl = _.template(`
/*!
 * Purpose:\t <%= ME.NODE_ENV %>
 * Version:\t <%= ME.VERSION %>
 * Commit:\t <%= ME.COMMIT %>
 * EOF:\t\t <%= pkg.name %>@<%= pkg.version %> - <%= pkg.title %>
 * =========================================================================== *
 */
`);

const Banner = {
    header: headerTpl({pkg: ME.pkg, ME: ME})
  , footer: footerTpl({pkg: ME.pkg, ME: ME})
};

let envConfig = {
    string:  'env'
  , default: {env: (process.env.NODE_ENV || ME.NODE_ENV || global.NODE_ENV || 'test')}
};
envConfig = parseArgs(process.argv.slice(2), envConfig);

console.log('\n');
console.log(`envConfig = [${utin(envConfig)}]`);
console.log('\n');


//-------//
// TASKS //
//-------//

gulpTasks({
    path:      process.cwd() + '/gulp-tasks'
  , separator: ':'
  , passGulp:  true
});

//  ENV ROUTER
gulp.task('default', function () {

  //  DEFAULT Scenario Route
  (function () {
    switch (ME.NODE_ENV) {
      case 'test': {
        return ['test'];
        break;
      }
      case ('dev' || 'development'): {
        return ['dev'];
        break;
      }
      case 'production': {
        return ['build'];
        break;
      }
      default: {
        return ['usage'];
        break;
      }
    }
  })();

});

gulp.task('test',         ['lint', 'usage', 'show:config']);
gulp.task('dev',          ['build:dev']);
gulp.task('lint',         ['jscs', 'jshint']);
gulp.task('clean',        ['clean:build', 'clean:dist']);
gulp.task('build:assets', ['build:css', 'build:js']);

gulp.task('build:dev', [
    'bower'
  , 'sync:src2build'
], function () {
  gulp.start('build:assets');
});

gulp.task('build', [
    'bower'
  , 'sync:src2build'
], function () {
  gulp.start('build:assets');
});

gulp.task('dist', ['clean:dist'], function () {
  gulp.start('sync:build2dist');
});
gulp.task('deploy',   ['sync:build2web']);
gulp.task('watch',    ['watch:src:views', 'watch:src:css', 'watch:src:js']);


//  WATCHERS

gulp.task('watch:src:css', function () {
  var wCSS = gulp.watch([
      path.join(SRC, 'src/assets/css', '**/*.css')
    ]
  , pkg.options.watch
  , function () {
    gulpSequence('sync:src2build', 'sync:assets2public', 'build:css', 'sync:build2web')();
  });
  wCSS.on('change', function (event) {
    console.info('CSS ' + event.path + ' was ' + event.type + ', running tasks...');
  });
});

gulp.task('watch:src:js', function () {
  var wScripts = gulp.watch([path.join(SRC, 'src/assets/js', '**/*.js')]
  , pkg.options.watch
  , function () {
    gulpSequence('sync:src2build', 'sync:assets2public', 'lint', 'build:js', 'sync:build2web')();
  });
  wScripts.on('change', function (event) {
    console.info('JS ' + event.path + ' was ' + event.type + ', running tasks...');
  });
});


//  BOWER
gulp.task('bower', function () {

  let mBower = mainBowerFiles(ME.pkg.options.bower, {
      base:   ME.BOWER
    , group:  ['front']
  });

  let DEST = path.join(ME.BUILD, 'assets');
  let KEEP = path.join(ME.BUILD, 'resources/assets');
  let JS   = path.join('js/lib');
  let CSS  = path.join('css');
  let FONT = path.join('fonts');
  let IMG  = path.join('img');

  let bowerJS = gulp.src(mBower)
    .pipe(filter([
        '**/*.js'
      //, '!**/require.js'
      , '!**/*.min.js'
      , '!**/npm.js'
    ]))
    .pipe(changed(path.resolve(KEEP, JS)))
    .pipe(gulp.dest(path.resolve(KEEP, JS)))
    .pipe(vinylPaths(function (paths) {
      console.info('JS: ', paths);
      return Promise.resolve();
    }))
    .pipe(concat('bower-bundle.js'))
    .pipe(gulpif('production' === ME.NODE_ENV, uglify(ME.pkg.options.uglify)))
    //  Write banners
    .pipe(headfoot.header(Banner.header))
    .pipe(headfoot.footer(Banner.footer))
    .pipe(gulpif('production' === ME.NODE_ENV, rename({suffix: ME.pkg.options.minify.suffix})))
    .pipe(gulp.dest(path.resolve(DEST, JS)));

  let bowerCSS = gulp.src(mBower)
    .pipe(filter([
        '**/*.css'
      , "**/*.css.map"
      , "**/skin-blue.css"
      , '!**/*.min.css'
      , "!**/AdminLTE.css"
      , "!**/AdminLTE-*.css"
      , "!**/skin-*.css"
    ]))
    .pipe(changed(path.resolve(KEEP, CSS)))
    .pipe(gulp.dest(path.resolve(KEEP, CSS)))
    .pipe(gulpif('production' === ME.NODE_ENV, cleanCSS(ME.pkg.options.clean, function (d) {
      console.info(d.name + ':\t' + d.stats.originalSize + '\t->\t' + d.stats.minifiedSize + '\t[' + d.stats.timeSpent + 'ms]\t[' + 100 * d.stats.efficiency.toFixed(2) + '%]');
    }), false))
    .pipe(vinylPaths(function (paths) {
      console.info('CSS:', paths);
      return Promise.resolve();
    }))
    .pipe(gulpif('production' === ME.NODE_ENV, concatCSS('bower-bundle.css', {rebaseUrls: false})))
    //  Write banners
    .pipe(headfoot.header(Banner.header))
    .pipe(headfoot.footer(Banner.footer))
    // Write minified version.
    // .pipe(gulpif('production' === ME.NODE_ENV, minifyCSS()))
    .pipe(gulpif('production' === ME.NODE_ENV, rename({suffix: ME.pkg.options.minify.suffix})))
    .pipe(gulp.dest(path.resolve(DEST, CSS)));

  let bowerFonts = gulp.src(mBower)
    .pipe(filter(['*/fonts/**/*.*']))
    .pipe(changed(path.resolve(KEEP, FONT)))
    .pipe(gulp.dest(path.resolve(KEEP, FONT)))
    .pipe(vinylPaths(function (paths) {
      console.info('FNT:', paths);
      return Promise.resolve();
    }))
    .pipe(gulp.dest(path.resolve(DEST, FONT)));

  let bowerImg = gulp.src(mBower)
    .pipe(filter([
        '**/img/*.*'
      , '**/image/*.*'
      , '**/images/*.*'
      , '**/*.png'
      , '**/*.jpg'
      , '**/*.jpeg'
      , '**/*.gif'
      , '**/*.ico'
    ]))
    .pipe(changed(path.join(KEEP, IMG)))
    .pipe(gulp.dest(path.join(KEEP, IMG)))
    .pipe(vinylPaths(function (paths) {
      console.info('IMG:', paths);
      return Promise.resolve();
    }))
    .pipe(gulp.dest(path.join(DEST, IMG)));

  return merge(bowerJS, bowerCSS, bowerFonts, bowerImg);
});


//  BUNDLE CSS and JS
gulp.task('build:css', function () {
  let DEST = path.join(ME.BUILD, 'assets/css');
  let FROM = path.join(ME.BUILD, 'resources/assets/css');

  let frontCSS = gulp.src([
      path.join(FROM, '**/*.css')
    ])
    .pipe(gulpif('production' === ME.NODE_ENV, cleanCSS(ME.pkg.options.clean, function (d) {
      console.info(d.name + ': ' + d.stats.originalSize + ' -> ' + d.stats.minifiedSize + ' [' + d.stats.timeSpent + 'ms] [' + 100 * d.stats.efficiency.toFixed(2) + '%]');
    }), false))
    .pipe(concatCSS('styles-bundle.css', {rebaseUrls: false}))
    .pipe(minifyCSS())
    //  Write banners
    .pipe(headfoot.header(Banner.header))
    .pipe(headfoot.footer(Banner.footer))
    .pipe(gulpif('production' === ME.NODE_ENV, rename({suffix: ME.pkg.options.minify.suffix})))
    .pipe(gulp.dest(DEST));

  return merge(frontCSS);
});

gulp.task('build:js', function () {
  let DEST = path.join(ME.BUILD, 'assets/js');
  return  gulp.src(path.join(ME.BUILD, 'resources/assets/js', '**/*.js'))
    //.pipe(jscs('.jscsrc'))
    //.pipe(jscs.reporter())
    .pipe(changed(DEST))
    .pipe(gulpif('production' === ME.NODE_ENV, uglify(ME.pkg.options.uglify), false))
    //  Write banners
    .pipe(headfoot.header(Banner.header))
    .pipe(headfoot.footer(Banner.footer))
    .pipe(gulp.dest(DEST));
});


//  LINTERS
gulp.task('jscs', function () {
  return gulp.src([
        path.join(ME.SRC, 'src/assets/js/', '*.js')
      , path.join(ME.SRC, 'src/assets/js/app', '**/*.js')
    ])
    .pipe(jscs('.jscsrc'))
    .pipe(jscs.reporter());
});
gulp.task('jshint', function () {
  return gulp.src([
        path.join(ME.SRC, 'src/assets/js/', '*.js')
      , path.join(ME.SRC, 'src/assets/js/app', '**/*.js')
    ])
    .pipe(jshint('.jshintrc'))
    .pipe(gulpif('production' === ME.NODE_ENV
      , jshint.reporter('jshint-stylish',   {verbose: true})
      , jshint.reporter('default',          {verbose: true})
    ));
    //  , jshint.reporter('fail',           {verbose: true})
});


//  Log file paths in the stream
gulp.task('files:src', function () {
  return gulp.src([
      path.join(ME.SRC, '**/*')
    , path.join(ME.SRC, '**/*.*')
    , path.join(ME.SRC, '**/.*')
  ])
  .pipe(changed(ME.BUILD))
  .pipe(vinylPaths(function (paths) {
    console.info('Changed:', paths);
    return Promise.resolve();
  }));
});


//  Print environment configuration
gulp.task('show:config', function () {
  console.warn('ENV Config: [', utin(envConfig), ']');
});

gulp.task('usage', function () {
  console.log('\n' + (new Array(50).join('-')));
  console.info('\nUsage:\n\t gulp <task>\t-\tRun gulp task(s) specified');
  console.info('\nwhere <task> is one of:\n');
  console.warn('\tusage' + '\t\t', 'Show this topic');
  console.warn('\tshow:config' + '\t', 'Show Configuration file');
  console.warn('\tfiles:src' + '\t', 'Log File Paths in the Stream');
  console.warn('\n\tclean' + '\t\t', 'Empty given folders and Delete files');
  console.warn('\tclean:build' + '\t', 'Clean directory with BUILD');
  console.warn('\tclean:dist' + '\t', 'Distro files');
  console.warn('\tclean:resources' + '\t', 'Static CSS, JS and Images');
  console.warn('\tclean:public' + '\t', 'Directory visible from Internet');
  console.log('\n' + (new Array(50).join('-')));
  console.warn('\n');
});

/*  EOF: ROOT/gulpfile.js  */
