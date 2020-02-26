/*!
 * Project:     cv
 * File:        ./gulp-tasks/sync/src2build.js
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
//  -----------------------------  FUNCTIONS  ------------------------------  //
//  ------------------------------------------------------------------------  //

const src2build = function (gulp) {
  console.log(`${ME.L}${ME.d}[${C.O}${modPath}/${modName}${C.N}] with [${C.Blue}${modConfigFile}${C.N}]`);

  let IMG  = 'assets/img';
  let DATA = 'data';

  let wImg = gulp.src('')
    .pipe(dirSync(
        path.join(ME.SRC, IMG)
      , path.join(ME.BUILD, IMG)
      , ME.pkg.options.sync
    ));

  let wData = gulp.src('')
    .pipe(dirSync(
        path.join(ME.SRC, DATA)
      , path.join(ME.BUILD, DATA)
      , ME.pkg.options.sync
    ));

  return merge(wImg, wData)
          .on('error', console.error.bind(console));
};

/**
 * @_EXPOSE
 */
exports = src2build;


/**
 * @_EXPORTS
 */
module.exports = exports;
