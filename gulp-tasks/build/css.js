/*!
 * File:        ./gulp-tasks/build/css.js
 * Copyright(c) 2016-nowdays Baltrushaitis Tomas
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
const cleanCSS = require('gulp-clean-css');
const concatCSS = require('gulp-concat-css');
const headfoot = require('gulp-headerfooter');
const merge = require('merge-stream');


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

  //  BUNDLE CSS
  let FROM = path.join(ME.SRC, 'assets/css');
  let DEST = path.join(ME.BUILD, 'assets/css');

  let frontCSS = gulp.src([
      path.join(FROM, '*.css')
    ])
    // .pipe(vinylPaths(function (paths) {
    //   console.info('[FRONTEND] CSS:', paths);
    //   return Promise.resolve(paths);
    // }))
    .pipe(gulpif('production' === ME.NODE_ENV, cleanCSS({debug: true, rebase: false}, function (d) {
      console.log(`[${new Date().toISOString()}][FRONTEND] Compressing CSS: [${utin(d.path)}]: [${utin(d.stats.originalSize)} -> ${utin(d.stats.minifiedSize)}] [${utin(parseFloat((100 * d.stats.efficiency).toFixed(2)))}%] in [${utin(d.stats.timeSpent)}ms]`);
    }), false))
    // .pipe(gulp.dest(DEST))
    // .pipe(concatCSS('frontend-bundle.css', {rebaseUrls: true}))
    //  Write banners
    .pipe(headfoot.header(ME.Banner.header))
    .pipe(headfoot.footer(ME.Banner.footer))
    .pipe(gulp.dest(DEST));

  return merge(frontCSS);

};
