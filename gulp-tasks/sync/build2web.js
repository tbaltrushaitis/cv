/*!
 * Project:     cv
 * File:        ./gulp-tasks/sync/build2web.js
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
const livereload = require('gulp-livereload');
const merge      = require('merge-stream');
const readConfig = require('read-config');

//  ------------------------------------------------------------------------  //
//  ----------------------------  CONFIGURATION  ---------------------------  //
//  ------------------------------------------------------------------------  //

let ME = Object.assign({}, global.ME || {});
utin.defaultOptions = Object.assign({}, ME.pkg.options.iopts || {});

const modName = path.basename(module.filename, '.js');
const modPath = path.relative(ME.WD, path.dirname(module.filename));
const confPath = path.join(ME.WD, 'config', path.sep);
const modConfigFile = `${path.join(confPath, modPath, modName)}.json`;
const modConfig = readConfig(modConfigFile, ME.pkg.options.readconf);

ME.Config = Object.assign({}, ME.Config || {}, modConfig || {});
let C = ME.Config.colors;

//  ------------------------------------------------------------------------  //
//  ------------------------------  FUNCTIONS  -----------------------------  //
//  ------------------------------------------------------------------------  //

const build2web = function (gulp) {
  console.log(`${ME.L}${ME.d}[${C.O}${modPath}/${modName}${C.N}] with [${C.Blue}${modConfigFile}${C.N}]`);

  if ('dev' === ME.NODE_ENV || 'dev' === process.env.npm_lifecycle_event) {
    // livereload.listen(ME.pkg.options.livereload);
  }

  let wFiles = gulp.src([
        path.join(ME.BUILD, '.*')
      , path.join(ME.BUILD, '*.json')
      , path.join(ME.BUILD, '*.txt')
    ])
    .pipe(gulp.dest(ME.WEB));

  let wHtml = gulp.src([
      path.join(ME.BUILD, '*.html')
    ])
    .pipe(gulpif('production' === ME.NODE_ENV, htmlmin(ME.pkg.options.htmlmin)))
    .pipe(gulp.dest(ME.WEB));
    // .pipe(gulpif('dev' === ME.NODE_ENV, livereload()))

  let wAssets = gulp.src('')
    .pipe(dirSync(
        path.join(ME.BUILD, 'assets')
      , path.join(ME.WEB, 'assets')
      , ME.pkg.options.sync
    ));

  let wData = gulp.src('')
    .pipe(dirSync(
        path.join(ME.BUILD, 'data')
      , path.join(ME.WEB, 'data')
      , ME.pkg.options.sync
    ));

  return merge(wHtml, wAssets, wData, wFiles)
          .pipe(gulpif('dev' === ME.NODE_ENV || 'dev' === process.env.npm_lifecycle_event, livereload()))
          .on('error', console.error.bind(console));

};

/**
 * @_EXPOSE
 */
exports = build2web;


/**
 * @_EXPORTS
 */
module.exports = exports;
