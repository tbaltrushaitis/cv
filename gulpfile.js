/*!
 * Project:     cv
 * File:        ./gulpfile.js
 * Copyright(c) 2016-nowdays Baltrushaitis Tomas <tbaltrushaitis@gmail.com>
 * License:     MIT
 */

'use strict';

//  ------------------------------------------------------------------------  //
//  -----------------------------  DEPENDENCIES  ---------------------------  //
//  ------------------------------------------------------------------------  //

const fs   = require('fs');
const del  = require('del');
const path = require('path');
const utin = require('util').inspect;

const _          = require('lodash');
const argv       = require('yargs').argv;
const dateFormat = require('dateformat');
const readConfig = require('read-config');
const vPaths     = require('vinyl-paths');

const gulp         = require('gulp');
const gulpTasks    = require('gulp-require-tasks');
const gulpSequence = require('gulp-sequence').use(gulp);
const changed      = require('gulp-changed');
const gulpif       = require('gulp-if');
const jscs         = require('gulp-jscs');
const jshint       = require('gulp-jshint');
const livereload   = require('gulp-livereload');

//  ------------------------------------------------------------------------  //
//  ----------------------------  CONFIGURATION  ---------------------------  //
//  ------------------------------------------------------------------------  //

let now = new Date();

global.ME = {};
ME.WD = path.join(__dirname);

const pkg = require('./package.json');
ME.pkg = Object.assign({}, pkg || {});
ME.version = ME.pkg.version;
ME.pkg.built = `${dateFormat(now, 'yyyy-mm-dd')}T${dateFormat(now, 'HH:MM:ss')} ${dateFormat(now, 'Z')}`;
ME.pkg.year = `${dateFormat(now, 'yyyy')}`;
ME.pkg.options.readconf = Object.assign({}, ME.pkg.options.readconf, {
  basedir: path.join(ME.WD, 'config')
});
utin.defaultOptions = Object.assign({}, ME.pkg.options.iopts);

ME.NODE_ENV = process.env.NODE_ENV
                ? process.env.NODE_ENV
                : argv.env
                  ? argv.env
                  : fs.existsSync('./NODE_ENV')
                    ? fs.readFileSync('./NODE_ENV', ME.pkg.options.file).split('\n')[0].trim()
                    : fs.existsSync('config/.NODE_ENV')
                      ? fs.readFileSync('config/.NODE_ENV', ME.pkg.options.file).split('\n')[0].trim()
                      : ME.NODE_ENV || 'test';

process.env.NODE_ENV = `${ME.NODE_ENV}`;

ME.VERSION = fs.existsSync('./VERSION') ? fs.readFileSync('./VERSION', ME.pkg.options.file).trim() : 'VERSION_UNKNOWN';
ME.COMMIT  = fs.existsSync('./COMMIT') ? fs.readFileSync('./COMMIT', ME.pkg.options.file).trim() : 'COMMIT_UNKNOWN';

var BUILD_FILE = path.join(ME.WD, `BUILD-${ME.VERSION}`);
ME.CNTR = fs.existsSync(`${BUILD_FILE}`)
            ? fs.readFileSync(`${BUILD_FILE}`, ME.pkg.options.file).trim()
            : 'tmp';

const modsPath = path.join(ME.WD, 'modules');
const confBase = path.join(ME.WD, 'config', ME.NODE_ENV + '.json');

let config = readConfig(confBase, Object.assign({}, ME.pkg.options.readconf));
ME.Config = config;

ME.DIR    = {};
ME.CURDIR = path.join(process.cwd(), path.sep);
ME.DOC    = path.join('docs',     path.sep);
ME.TMP    = path.join('tmp',      path.sep);
ME.SRC    = path.join('src',      path.sep);
ME.WEB    = path.join(`webroot`,  path.sep);
ME.BUILD  = path.join(`build-${ME.VERSION}`,  path.sep);
ME.DIST   = path.join(`dist-${ME.VERSION}`,   path.sep);
ME.BOWER  = JSON.parse(fs.existsSync('.bowerrc') ? fs.readFileSync('.bowerrc') : '{"directory": "bower_modules"}').directory;

let headTplName = path.join(ME.WD, 'config', 'header.tpl');
let footTplName = path.join(ME.WD, 'config', 'footer.tpl');
let headTplCtx = fs.existsSync( headTplName )
                  ? fs.readFileSync( headTplName )
                  : `
/*!
 * =========================================================================== *
 * <%= pkg.name %>@<%= pkg.version %>
 * =========================================================================== *
**/`;
let footTplCtx = fs.existsSync( footTplName )
                  ? fs.readFileSync( footTplName )
                  : `
/*!
 * <%= pkg.name %>@<%= pkg.version %> - <%= pkg.title %> [${dateFormat(now, 'yyyy-mm-dd')}T${dateFormat(now, 'HH:MM:ss')}Z ${dateFormat(now, 'Z')}]
 * =========================================================================== *
**/`;

let headTpl = _.template(`${headTplCtx}`);
let footTpl = _.template(`${footTplCtx}`);

const Banner = {
    header: headTpl({pkg: ME.pkg, ME: ME})
  , footer: footTpl({pkg: ME.pkg, ME: ME})
};
ME.Banner = Banner;

let C = ME.Config.colors;
ME.L = `\n${C.White}${(new Array(80).join('-'))}${C.NC}\n`;

console.log(`${ME.L}`);
console.log(`${C.BYellow}NPM_LIFECYCLE_EVENT${C.NC} = [${C.BRed}${process.env.npm_lifecycle_event}${C.NC}]`);
console.log(`${C.BYellow}NODE_ENV${C.NC} = [${C.BRed}${ME.NODE_ENV}${C.NC}]`);
console.log(`${ME.L}`);


//  ------------------------------------------------------------------------  //
//  -------------------------------  TASKS  --------------------------------  //
//  ------------------------------------------------------------------------  //

gulpTasks({
    path:      process.cwd() + '/gulp-tasks'
  , separator: ':'
  , passGulp:  true
});


//  ------------------------------------------------------------------------  //
//  ----------------------  DEFAULT Scenario Route  ------------------------  //
//  ------------------------------------------------------------------------  //

function defaultTask (cb) {

  //  ROUTE by ENV
  (function () {
    switch (ME.NODE_ENV) {
      case 'test': {
        console.log(`[${new Date().toISOString()}] ${C.Yellow}Starting ${C.BWhite}${C.On_Blue}TEST${C.NC}`);
        gulp.start('test');
        break;
      }
      case ('dev' || 'development'): {
        console.log(`[${new Date().toISOString()}] ${C.Yellow}Starting ${C.BWhite}${C.On_Blue}DEV${C.NC}`);
        gulp.start('dev');
        break;
      }
      case 'production': {
        console.log(`[${new Date().toISOString()}] ${C.Yellow}Starting ${C.BWhite}${C.On_Blue}PROD${C.NC}`);
        gulp.start('prod');
        break;
      }
      default: {
        console.log(`[${new Date().toISOString()}] ${C.Yellow}Starting ${C.BWhite}${C.On_Blue}USAGE${C.NC}`);
        gulp.start('usage');
        break;
      }
    }
  })();

  cb();
}

gulp.task('lint', [
    'jscs'
  , 'jshint'
], (cb) => {
  console.log(`[${new Date().toISOString()}][${C.Yellow}LINT${C.NC}] ${C.BWhite}${C.On_Blue}FINISHED${C.NC}`);
  cb();
});

gulp.task('test', [
    'lint'
  , 'show:src'
  , 'usage'
  , 'show:config'
  , 'show:env'
], (cb) => {
  console.log(`[${new Date().toISOString()}][${C.Yellow}TEST${C.NC}] ${C.BWhite}${C.On_Blue}FINISHED${C.NC}`);
  cb();
});

gulp.task('clean', [
    'clean:build'
  , 'clean:dist'
], (cb) => {
  console.log(`[${new Date().toISOString()}][${C.Yellow}CLEAN${C.NC}] ${C.BWhite}${C.On_Blue}FINISHED${C.NC}`);
  cb();
});

gulp.task('build:assets', [
    'build:css'
  , 'build:js'
  , 'build:img'
], (cb) => {
  console.log(`[${new Date().toISOString()}][${C.Yellow}BUILD:ASSETS${C.NC}] ${C.BWhite}${C.On_Blue}FINISHED${C.NC}`);
  cb();
});

gulp.task('build:assets:fast', [
    'build:css'
  , 'build:js'
], (cb) => {
  console.log(`[${new Date().toISOString()}][${C.Yellow}BUILD:ASSETS:FAST${C.NC}] ${C.BWhite}${C.On_Blue}FINISHED${C.NC}`);
  cb();
});

gulp.task('dev', [
  'build:dev'
], (cb) => {
  gulp.start('watch');
  console.log(`[${new Date().toISOString()}][${C.Yellow}DEV${C.NC}] ${C.BWhite}${C.On_Blue}FINISHED${C.NC}`);
  cb();
});

gulp.task('prod', [
  'build'
], (cb) => {
  gulp.start('deploy');
  console.log(`[${new Date().toISOString()}][${C.Yellow}PROD${C.NC}] ${C.BWhite}${C.On_Blue}FINISHED${C.NC}`);
  cb();
});


gulp.task('build:dev', [
  'bower'
], () => {
  gulpSequence('sync:src2build', 'build:assets', 'deploy')((err) => {
    if (err) {
      console.log(`[${new Date().toISOString()}][${C.Yellow}BUILD:DEV${C.NC}] ${C.BRed}ERROR${C.NC}: [${utin(err)}]`);
      return Promise.reject(1);
    }
    console.log(`[${new Date().toISOString()}][${C.Yellow}BUILD:DEV${C.NC}] ${C.BWhite}${C.On_Blue}FINISHED${C.NC}`);
  });

  // console.log(`[${new Date().toISOString()}][${C.Yellow}BUILD:DEV${C.NC}] ${C.BWhite}${C.On_Blue}FINISHED${C.NC}`);
});


gulp.task('build', [
  'bower'
], (cb) => {
  gulpSequence('sync:src2build', 'build:assets', 'deploy')((err) => {
    if (err) {
      console.log(`[${new Date().toISOString()}][${C.Yellow}BUILD${C.NC}] ${C.BRed}ERROR${C.NC}: [${utin(err)}]`);
      return Promise.reject(1);
    }else{
      console.log(`[${new Date().toISOString()}][${C.Yellow}BUILD${C.NC}] ${C.BWhite}${C.On_Blue}FINISHED${C.NC}`);
      return cb();
    }
  });

  // console.log(`[${new Date().toISOString()}][${C.Yellow}BUILD${C.NC}] ${C.BWhite}${C.On_Blue}FINISHED${C.NC}`);
  // cb();
});



gulp.task('build:fast', [
  'sync:src2build'
], (cb) => {
  gulpSequence('build:assets:fast', 'deploy')((err) => {
    if (err) {
      console.log(`[${new Date().toISOString()}][${C.Yellow}BUILD:FAST${C.NC}] ${C.BRed}ERROR${C.NC}: [${utin(err)}]`);
      return Promise.reject(1);
    }
    console.log(`[${new Date().toISOString()}][${C.Yellow}BUILD:FAST${C.NC}] ${C.BWhite}${C.On_Blue}FINISHED${C.NC}`);
  });
  // console.log(`[${new Date().toISOString()}][${C.Yellow}BUILD:FAST${C.NC}] ${C.BWhite}${C.On_Blue}FINISHED${C.NC}`);
  cb();
});


gulp.task('dist', [
  'clean:dist'
], (cb) => {
  gulp.start('sync:build2dist');
  console.log(`[${new Date().toISOString()}][${C.Yellow}DIST${C.NC}] ${C.BWhite}${C.On_Blue}FINISHED${C.NC}`);
  cb();
});


gulp.task('deploy', [
  'sync:build2web'
], (cb) => {
  gulp.start('show:env');
  console.log(`[${new Date().toISOString()}][${C.Yellow}DEPLOY${C.NC}] ${C.BWhite}${C.On_Blue}FINISHED${C.NC}`);
  cb();
});


//--------------//
//   WATCHERS   //
//--------------//

gulp.task('watch', [], (cb) => {

  livereload.listen(ME.pkg.options.livereload);
  gulp.start('watch:src');
  console.log(`[${new Date().toISOString()}][${C.Yellow}WATCH${C.NC}] ${C.BWhite}${C.On_Blue}FINISHED${C.NC}`);
  cb();
});

gulp.task('watch:src', [
    'watch:src:default'
  , 'watch:src:configs'
  , 'watch:src:css'
  , 'watch:src:js'
], (cb) => {
  console.log(`[${new Date().toISOString()}][${C.Yellow}WATCH:SRC${C.NC}] ${C.BWhite}${C.On_Blue}FINISHED${C.NC}`);
  cb();
});

gulp.task('watch:src:default', function () {
  let wSRC = gulp.watch([
        path.join(ME.SRC, '**/*.html')
      , path.join(ME.SRC, '**/*.txt')
    ]
  , ME.pkg.options.watch
  , function () {
    gulpSequence('populate', 'sync:src2build', 'build:fast', 'deploy')((err) => {
      if (err) {
        console.log(`[${new Date().toISOString()}][${C.Yellow}WATCH:SRC:DEFAULT${C.NC}] ${C.BRed}ERROR${C.NC}: [${utin(err)}]`);
        return Promise.reject(1);
      };
      console.log(`[${new Date().toISOString()}][${C.Yellow}WATCH:SRC:DEFAULT${C.NC}] ${C.BWhite}${C.On_Blue}FINISHED${C.NC}`);
    });
  });
  wSRC.on('change', function (e) {
    console.log(`[${new Date().toISOString()}][${C.White}WATCH:SRC:DEFAULT${C.NC}] FILE [${C.Purple}${e.path}${C.NC}] was [${C.On_Blue}${e.type}${C.NC}], running tasks ...`);
  });
});

gulp.task('watch:src:configs', function () {
  let wCONF = gulp.watch([
      path.join(ME.WD, 'config', '**/*.*')
    ]
  , ME.pkg.options.watch
  , function () {
    gulpSequence('populate', 'build:fast', 'deploy')((err) => {
      if (err) {
        console.log(`[${new Date().toISOString()}][${C.Yellow}WATCH:SRC:CONFIGS${C.NC}] ${C.BRed}ERROR${C.NC}: [${utin(err)}]`);
        return Promise.reject(1);
      }
      console.log(`[${new Date().toISOString()}][${C.Yellow}WATCH:SRC:CONFIGS${C.NC}] ${C.BWhite}${C.On_Blue}FINISHED${C.NC}`);
    });
  });
  wCONF.on('change', function (e) {
    console.log(`[${new Date().toISOString()}][${C.White}WATCH:SRC${C.NC}] CONFIG [${C.Purple}${e.path}${C.NC}] was [${C.White}${e.type}${C.NC}], running tasks ...`);
  });
});

gulp.task('watch:src:css', function () {
  let wCSS = gulp.watch([
      path.join(ME.SRC, 'assets/css', '**/*.css')
    ]
  , ME.pkg.options.watch
  , function () {
    gulpSequence('sync:src2build', 'build:css', 'deploy')((err) => {
      if (err) {
        console.log(`[${new Date().toISOString()}][${C.Yellow}WATCH:SRC:CSS${C.NC}] ${C.BRed}ERROR${C.NC}: [${utin(err)}]`);
        return Promise.reject(1);
      }
      console.log(`[${new Date().toISOString()}][${C.Yellow}WATCH:SRC:CSS${C.NC}] ${C.BWhite}${C.On_Blue}FINISHED${C.NC}`);
    });
  });
  wCSS.on('change', function (e) {
    console.log(`[${new Date().toISOString()}][${C.White}WATCH:SRC${C.NC}] CSS [${C.Purple}${e.path}${C.NC}] was [${C.White}${e.type}${C.NC}], running tasks ...`);
  });
});

gulp.task('watch:src:js', function () {
  let wScripts = gulp.watch([
      path.join(ME.SRC, 'assets/js', '**/*.js')
    ]
  , ME.pkg.options.watch
  , function () {
    gulpSequence('lint', 'populate', 'sync:src2build', 'build:js', 'deploy')((err) => {
      if (err) {
        console.log(`[${new Date().toISOString()}][${C.Yellow}WATCH:SRC:JS${C.NC}] ${C.BRed}ERROR${C.NC}: [${utin(err)}]`);
        return Promise.reject(1);
      }
      console.log(`[${new Date().toISOString()}][${C.Yellow}WATCH:SRC:JS${C.NC}] ${C.BWhite}${C.On_Blue}FINISHED${C.NC}`);
    });
  });
  wScripts.on('change', function (e) {
    console.log(`[${new Date().toISOString()}][${C.White}WATCH:SRC${C.NC}] JS [${C.Purple}${e.path}${C.NC}] was [${C.White}${e.type}${C.NC}], running tasks ...`);
  });
});


//--------------//
//   LINTERS    //
//--------------//

gulp.task('jscs', function () {
  return gulp.src([
        path.join(ME.SRC, 'assets/js/front', '**/*.js')
      , path.join(ME.SRC, 'assets/js/app', '**/*.js')
    ])
    .pipe(jscs({configPath: 'config/.jscsrc'}))
    .pipe(jscs.reporter());
});


gulp.task('jshint', function () {
  let jshintConfig =  JSON.parse(fs.existsSync('./config/.jshintrc')
                        ? fs.readFileSync('./config/.jshintrc')
                        : {}
                      );
  jshintConfig.lookup = false;
  return gulp.src([
        path.join(ME.SRC, 'assets/js/front', '**/*.js')
      , path.join(ME.SRC, 'assets/js/app', '**/*.js')
    ])
    .pipe(jshint(jshintConfig))
    .pipe(gulpif('production' === ME.NODE_ENV
      , jshint.reporter('jshint-stylish',   {verbose: true})
      , jshint.reporter('default',          {verbose: true})
    ));
    //  , jshint.reporter('fail',           {verbose: true})
});


//  Log file paths in the stream
gulp.task('show:src', function () {
  return gulp.src([
      path.join(ME.SRC, '**/*')
    , path.join(ME.SRC, '**/*.*')
    , path.join(ME.SRC, '**/.*')
  ])
  .pipe(changed(path.join(ME.BUILD, 'resources')))
  .pipe(vPaths((p) => {
    console.info('SOURCE Changed:', p);
    return Promise.resolve(p);
  }));
});


//  Print configuration
gulp.task('show:config', function (cb) {

  console.log(`${ME.L}`);
  console.log(`ME.Config = [${utin(ME.Config)}]`);
  console.log(`${ME.L}`);

  cb();
});


//  Print environment settings
gulp.task('show:env', function (cb) {

  console.log(`${ME.L}`);
  console.log(`${C.BYellow}NPM_LIFECYCLE_EVENT${C.NC} = [${C.BRed}${process.env.npm_lifecycle_event}${C.NC}]`);
  console.log(`${C.BYellow}NODE_ENV${C.NC} = [${C.BRed}${ME.NODE_ENV}${C.NC}]`);
  console.log(`${ME.L}`);

  cb();
});


/**
 * EXPOSE
 * @public
 */

exports.default = defaultTask;

/*  EOF: ROOT/gulpfile.js  */
