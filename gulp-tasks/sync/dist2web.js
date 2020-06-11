/*!
 * Project:     cv
 * File:        ./gulp-tasks/sync/dist2web.js
 * Copyright(c) 2016-nowdays Baltrushaitis Tomas <tbaltrushaitis@gmail.com>
 * License:     MIT
 */

'use strict';

//  ------------------------------------------------------------------------  //
//  -----------------------------  DEPENDENCIES  ---------------------------  //
//  ------------------------------------------------------------------------  //

const path = require('path');
const utin = require('util').inspect;

const dirSync    = require('gulp-directory-sync');
const gulpif     = require('gulp-if');
const htmlmin    = require('gulp-htmlmin');
const merge      = require('merge-stream');
const livereload = require('gulp-livereload');
const readConfig = require('read-config');

//  ------------------------------------------------------------------------  //
//  ----------------------------  CONFIGURATION  ---------------------------  //
//  ------------------------------------------------------------------------  //

let ME = Object.assign({}, global.ME || {});
utin.defaultOptions = Object.assign({}, ME.pkg.options.iopts || {});

const modName = path.basename(module.filename, '.js');
const modPath = path.relative(ME.WD, path.dirname(module.filename));
const confPath = path.join(ME.WD, 'config');
const modConfigFile = `${path.join(confPath, modPath, modName)}.json`;
const modConfig = readConfig(modConfigFile, ME.pkg.options.readconf);

ME.Config = Object.assign({}, ME.Config || {}, modConfig || {});
let C = ME.Config.colors;

//  ------------------------------------------------------------------------  //
//  ------------------------------  FUNCTIONS  -----------------------------  //
//  ------------------------------------------------------------------------  //

const dist2web = function (gulp) {
  console.log(`${ME.L}${ME.d}[${C.O}${modPath}/${modName}${C.N}] with [${C.Blue}${modConfigFile}${C.N}]`);

  let CONF = Object.assign({}, ME.Config);
  let SRC  = path.join(ME.DIST);
  let DEST = path.join(ME.WEB);


  let wFiles = gulp.src([
        path.join(SRC, '.*')
      , path.join(SRC, '*.txt')
      , path.join(SRC, '*.json')
    ])
    .pipe(gulp.dest(DEST));


  let wHtml = gulp.src([
      path.join(SRC, '*.html')
    ])
    // .pipe(htmlmin(ME.pkg.options.htmlmin))
    // .pipe(gulpif('dev' !== ME.NODE_ENV && 'dev' === process.env.npm_lifecycle_event, htmlmin(ME.pkg.options.htmlmin)))
    .pipe(gulpif('production' === ME.NODE_ENV || 'prod' === process.env.npm_lifecycle_event, htmlmin(ME.pkg.options.htmlmin)))
    .pipe(gulp.dest(DEST));


  let wAssets = gulp.src('')
    .pipe(dirSync(
        path.join(SRC, 'assets')
      , path.join(DEST, 'assets')
      , ME.pkg.options.sync
    ));


  let wData = gulp.src('')
    .pipe(dirSync(
        path.join(SRC, 'data')
      , path.join(DEST, 'data')
      , ME.pkg.options.sync
    ));

  // return merge(wHtml, wAssets, wData, wFiles)
  return merge(wHtml)
          .pipe(gulpif('dev' === ME.NODE_ENV || 'dev' === process.env.npm_lifecycle_event, livereload()))
          .on('error', console.error.bind(console));

};


/**
 * @_EXPOSE
 */
exports = dist2web;


/**
 * @_EXPORTS
 */
module.exports = exports;
