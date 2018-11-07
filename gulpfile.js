/*!
 * File:        ./gulpfile.js
 * Copyright(c) 2016-nowdays tbaltrushaitis@gmail.com
 * License:     MIT
 */

'use strict';

//  ------------------------------------------------------------------------  //
//  -----------------------------  DEPENDENCIES  ---------------------------  //
//  ------------------------------------------------------------------------  //


const fs   = require('fs');
const del  = require('del');
const path = require('path');
const util = require('util');
const utin = util.inspect;

const _          = require('lodash');
const argv       = require('yargs').argv;
const readConfig = require('read-config');
const parseArgs  = require('minimist');
const vinylPaths = require('vinyl-paths');
const dateFormat = require('dateformat');
const merge      = require('merge-stream');

const gulp          = require('gulp');
const gulpTasks     = require('gulp-require-tasks');
const gulpSequence  = require('gulp-sequence').use(gulp);
const changed       = require('gulp-changed');
const gulpif        = require('gulp-if');
const jscs          = require('gulp-jscs');
const jshint        = require('gulp-jshint');
const stylish       = require('jshint-stylish');
const replace       = require('gulp-token-replace');
const livereload    = require('gulp-livereload');

//  ------------------------------------------------------------------------  //
//  ----------------------------  CONFIGURATION  ---------------------------  //
//  ------------------------------------------------------------------------  //

global.ME = {};
ME.WD = path.join(__dirname);
let now = new Date();

const pkg = require('./package.json');
ME.pkg = Object.assign({}, pkg || {});
ME.version  = ME.pkg.version;
ME.pkg.built = `${dateFormat(now, 'yyyy-mm-dd')}T${dateFormat(now, 'HH:MM:ss')}`;
ME.pkg.year = `${dateFormat(now, 'yyyy')}`;
utin.defaultOptions = Object.assign({}, ME.pkg.options.iopts);
ME.pkg.options.readconf = Object.assign({}, ME.pkg.options.readconf, {
  basedir: path.join(ME.WD, 'config')
});
ME.NODE_ENV = argv.env
                ? argv.env
                : fs.existsSync('./NODE_ENV')
                  ? fs.readFileSync('./NODE_ENV', ME.pkg.options.file).split('\n')[0].trim()
                  : fs.existsSync('config/.NODE_ENV')
                    ? fs.readFileSync('config/.NODE_ENV', ME.pkg.options.file).split('\n')[0].trim()
                    : ME.NODE_ENV || 'test';

process.env.NODE_ENV = ME.NODE_ENV;
// process.env.INIT_CWD = ME.WD;

ME.VERSION = fs.existsSync('./VERSION') ? fs.readFileSync('./VERSION', ME.pkg.options.file).trim() : 'VERSION_UNKNOWN';
ME.COMMIT  = fs.existsSync('./COMMIT') ? fs.readFileSync('./COMMIT', ME.pkg.options.file).trim() : 'COMMIT_UNKNOWN';

const modsPath = path.join(ME.WD, 'modules');
const confBase = path.join(ME.WD, 'config', ME.NODE_ENV + '.json');

let config = readConfig(confBase, Object.assign({}, ME.pkg.options.readconf));

ME.Config = config;

ME.DIR    = {};
ME.DOC    = path.join('docs',    path.sep);
ME.TMP    = path.join('tmp',                  path.sep);
ME.SRC    = path.join('src',                  path.sep);
ME.BUILD  = path.join(`build-${ME.VERSION}`,  path.sep);
ME.DIST   = path.join(`dist-${ME.VERSION}`,   path.sep);
ME.WEB    = path.join(`webroot`,              path.sep);
ME.CURDIR = path.join(process.cwd(),          path.sep);
ME.BOWER  = JSON.parse(fs.existsSync('.bowerrc') ? fs.readFileSync('.bowerrc') : '{"directory": "bower_modules"}').directory;

let headTplName = path.join(ME.WD, 'config', 'header.tpl');
let footTplName = path.join(ME.WD, 'config', 'footer.tpl');
let headTplCtx = fs.existsSync( headTplName )
                      ? fs.readFileSync( headTplName )
                      : `/*!
* =========================================================================== *
 * <%= pkg.name %>@<%= pkg.version %>
 */
`;
let footTplCtx = fs.existsSync( footTplName )
                      ? fs.readFileSync( footTplName )
                      : `
/*!
 * <%= pkg.name %>@<%= pkg.version %> - <%= pkg.title %> [${dateFormat(now, 'yyyy-mm-dd')}T${dateFormat(now, 'HH:MM:ss')}]
 * =========================================================================== *
 */
`;

let headTpl = _.template(`${headTplCtx}`);
let footTpl = _.template(`${footTplCtx}`);

const Banner = {
    header: headTpl({pkg: ME.pkg, ME: ME})
  , footer: footTpl({pkg: ME.pkg, ME: ME})
};

// console.log('\n');
// console.log(`ME.Config = [${utin(ME.Config)}]`);
// console.log('\n');
console.log(`npm_lifecycle_event = [${utin(process.env.npm_lifecycle_event)}]`);

ME.Banner = Banner;

//  ------------------------------------------------------------------------  //
//  -------------------------------  TASKS  --------------------------------  //
//  ------------------------------------------------------------------------  //

gulpTasks({
    path:      process.cwd() + '/gulp-tasks'
  , separator: ':'
  , passGulp:  true
});

//--------------//
//  ENV ROUTER  //
//--------------//

gulp.task('default', function () {

  //  DEFAULT Scenario Route
  (function () {
    switch (ME.NODE_ENV) {
      case 'test': {
        gulp.start('test');
        break;
      }
      case ('dev' || 'development'): {
        gulp.start('dev');
        break;
      }
      case 'production': {
        gulp.start('prod');
        break;
      }
      default: {
        gulp.start('usage');
        break;
      }
    }
  })();

});

gulp.task('lint',  ['jscs', 'jshint']);
gulp.task('test',  ['lint', 'usage', 'show:config', 'show:src']);
gulp.task('clean', ['clean:build', 'clean:dist']);

gulp.task('build:assets', ['build:css', 'build:js', 'build:img']);
gulp.task('build:assets:fast', ['build:css', 'build:js']);

gulp.task('dev', [
  'build:dev'
], function () {
  return gulp.start('watch');
});

gulp.task('prod', [
    'build'
], function () {
  gulp.start('deploy');
});

gulp.task('build:dev', [
    'bower'
  , 'sync:src2build'
], function () {
  return gulp.start('build:assets');
});

gulp.task('build', [
    'bower'
  , 'sync:src2build'
], function () {
  gulp.start('build:assets');
});

gulp.task('build:fast', [
  'sync:src2build'
], function () {
  gulp.start('build:assets:fast');
});

gulp.task('dist', ['clean:dist'], function () {
  gulp.start('sync:build2dist');
});
gulp.task('deploy', [], function () {
  // gulp.start('sync:build2web');
  return  gulpSequence('sync:build2web')((err) => {
            if (err) {
              console.log('ERROR OCCURED:', utin(err));
            }
          });
});


//--------------//
//   WATCHERS   //
//--------------//

gulp.task('watch',  ['watch:src'], () => {
  livereload.listen({start: true, quiet: false});
});

gulp.task('watch:src', [
  'watch:src:default'
  , 'watch:src:configs'
  , 'watch:src:css'
  , 'watch:src:js'
]);

gulp.task('watch:src:default', function () {
  let wSRC = gulp.watch([
      path.join(ME.SRC, '**/*.html')
      , path.join(ME.SRC, '**/*.txt')
    ]
  , ME.pkg.options.watch
  , function () {
      // return  gulpSequence('populate', 'sync:src2build', 'deploy')((err) => {
      gulpSequence('populate', 'sync:src2build', 'deploy')((err) => {
                if (err) {
                  console.log(`[${new Date().toISOString()}] ERROR OCCURED: [${utin(err)}]`);
                };
              });
  });
  wSRC.on('change', function (e) {
    console.log('DEFAULT Handler', utin(e.path), 'was', utin(e.type), ', running tasks...');
  });
});

gulp.task('watch:src:configs', function () {
  let wCONF = gulp.watch([
      path.join(ME.WD, 'config', '**/*.*')
    ]
  , ME.pkg.options.watch
  , function () {
      // return  gulpSequence('populate', 'build:fast', 'deploy')((err) => {
      gulpSequence('populate', 'build:fast', 'deploy')((err) => {
                if (err) {
                  console.log('ERROR OCCURED:', utin(err));
                }
              });
  });
  wCONF.on('change', function (e) {
    console.log('CONFIG', utin(e.path), 'was', utin(e.type), ', running tasks...');
  });
});

gulp.task('watch:src:css', function () {
  let wCSS = gulp.watch([
      path.join(ME.SRC, 'assets/css', '**/*.css')
    ]
  , ME.pkg.options.watch
  , function () {
      // return  gulpSequence('sync:src2build', 'build:css', 'deploy')((err) => {
      gulpSequence('sync:src2build', 'build:css', 'deploy')((err) => {
                if (err) {
                  console.log('ERROR OCCURED:', utin(err));
                }
              });
  });
  wCSS.on('change', function (e) {
    console.log('CSS', utin(e.path), 'was', utin(e.type), ', running tasks...');
  });
});

gulp.task('watch:src:js', function () {
  let wScripts = gulp.watch([
      path.join(ME.SRC, 'assets/js', '**/*.js')
    ]
  , ME.pkg.options.watch
  , function () {
      // return  gulpSequence('lint', 'populate', 'sync:src2build', 'build:js', 'deploy')((err) => {
      gulpSequence('lint', 'populate', 'sync:src2build', 'build:js', 'deploy')((err) => {
                if (err) {
                  console.log('ERROR OCCURED:', utin(err));
                }
              });
  });
  wScripts.on('change', function (e) {
    console.log('JS', utin(e.path), 'was', utin(e.type), ', running tasks...');
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
  let jshintConfig = JSON.parse(fs.existsSync('./config/.jshintrc') ? fs.readFileSync('./config/.jshintrc') : {});
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
  .pipe(vinylPaths(function (paths) {
    console.info('SOURCE FILE Changed:', paths);
    return Promise.resolve(paths);
  }));
});


//  Print environment configuration
gulp.task('show:config', function () {

  console.log('\n');
  console.log(`ME.Config = [${utin(ME.Config)}]`);
  console.log('\n');

  // console.log('\n');
  // console.log(`process.env = [${utin(process.env)}]`);
  // console.log('\n');

});

/*  EOF: ROOT/gulpfile.js  */
