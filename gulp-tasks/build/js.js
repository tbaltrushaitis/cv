/*!
 * File:        ./gulp-tasks/build/js.js
 * Copyright(c) 2018-nowdays Baltrushaitis Tomas
 * License:     MIT
 */

'use strict';

//  ------------------------------------------------------------------------  //
//  -----------------------------  DEPENDENCIES  ---------------------------  //
//  ------------------------------------------------------------------------  //

const path = require('path');
const util = require('util');
const utin = util.inspect;

const vinylPaths = require('vinyl-paths');
const gulpif = require('gulp-if');
const changed = require('gulp-changed');
const headfoot = require('gulp-headerfooter');
const jscs = require('gulp-jscs');
const merge = require('merge-stream');
const terser = require('gulp-terser');

//  ------------------------------------------------------------------------  //
//  ----------------------------  CONFIGURATION  ---------------------------  //
//  ------------------------------------------------------------------------  //

let ME = Object.assign({}, global.ME || {});
utin.defaultOptions = Object.assign({}, ME.pkg.options.iopts || {});

const modName = path.basename(module.filename, '.js');
const modPath = path.relative(ME.WD, path.dirname(module.filename));
const confPath = path.join(ME.WD, 'config', path.sep);
const modConfigFile = `${path.join(confPath, modPath, modName)}.json`;
const modConfig = require('read-config')(modConfigFile, ME.pkg.options.readconf);

ME.Config = Object.assign({}, ME.Config || {}, modConfig || {});


//  ------------------------------------------------------------------------  //
//  --------------------------------  EXPOSE  ------------------------------  //
//  ------------------------------------------------------------------------  //

module.exports = function (gulp) {
  console.log(`[${new Date().toISOString()}][${modPath}/${modName}] with [${utin(modConfigFile)}]`);

  let FROM = path.join(ME.BUILD, 'resources/assets');
  let DEST = path.join(ME.BUILD, 'assets');
  let JS = path.join('js');

  let JSfront = gulp.src([
        path.join(FROM, JS, '**/*.js')
    ])
    .pipe(vinylPaths(function (paths) {
      console.log(`[${new Date().toISOString()}][FRONT] JS: [${utin(paths)}]`);
      return Promise.resolve(paths);
    }))
    // .pipe(jscs({configPath: 'config/.jscsrc'}))
    // .pipe(jscs.reporter())
    .pipe(gulpif('production' === ME.NODE_ENV, terser()))
    // //  Write banners
    .pipe(headfoot.header(ME.Banner.header))
    .pipe(headfoot.footer(ME.Banner.footer))
    .pipe(gulp.dest(path.resolve(DEST, JS)));

  return merge(JSfront);

};
