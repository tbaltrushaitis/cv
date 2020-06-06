/*!
 * Project:     cv
 * File:        ./gulp-tasks/populate.js
 * Copyright(c) 2018-nowdays Baltrushaitis Tomas <tbaltrushaitis@gmail.com>
 * License:     MIT
 */

'use strict';

//  ------------------------------------------------------------------------  //
//  -----------------------------  DEPENDENCIES  ---------------------------  //
//  ------------------------------------------------------------------------  //

const path = require('path');
const utin = require('util').inspect;

const headfoot   = require('gulp-headerfooter');
const gulpif     = require('gulp-if');
const replace    = require('gulp-token-replace');
const merge      = require('merge-stream');
const readConfig = require('read-config');
const vPaths     = require('vinyl-paths');


//  ------------------------------------------------------------------------  //
//  ----------------------------  CONFIGURATION  ---------------------------  //
//  ------------------------------------------------------------------------  //

let ME = Object.assign({}, global.ME || {});
utin.defaultOptions = Object.assign({}, ME.pkg.options.iopts || {});

const modName = path.basename(module.filename, '.js');
const modPath = path.relative(ME.WD, path.dirname(module.filename));
const modConfigFile = `${path.join(ME.WD, 'config', modPath, modName)}.json`;
const modConfig = readConfig(modConfigFile, Object.assign({}, ME.pkg.options.readconf));

ME.Config = Object.assign({}, ME.Config || {}, modConfig || {});
let C = ME.Config.colors;

//  ------------------------------------------------------------------------  //
//  ------------------------------  FUNCTIONS  -----------------------------  //
//  ------------------------------------------------------------------------  //

const populate = function (gulp) {
  console.log(`${ME.L}${ME.d}[${C.O}${modPath}/${modName}${C.N}] with [${C.Blue}${C.OnW}${modConfigFile}${C.N}]`);

  let CONF = Object.assign({}, ME.Config);
  let SRC  = path.join(ME.SRC);
  let DEST = path.join(ME.BUILD);
  let RESO = path.join('resources');

  let VOID = [
      path.join(SRC, '*.*')
    , path.join(SRC, '.*')
  ];
  let JS   = path.join('assets/js');
  let CSS  = path.join('assets/css');
  let DATA = path.join('data');


  //--------------//
  // STATIC FILES //
  //--------------//
  let Static = gulp.src(VOID)
    .pipe(vPaths(function (p) {
      console.log(`${ME.d}[${C.O}${modName.toUpperCase()}${C.N}] ${C.Y}STATIC${C.N}: \t [${p}]`);
      return Promise.resolve(p);
    }))
    .pipe(replace({global: CONF, preserveUnknownTokens: true}))
    .pipe(gulp.dest(path.resolve(DEST)));


  //--------------//
  // JAVASCRIPTS //
  //--------------//
  let JStask = gulp.src([
      path.join(SRC, JS, '**/*.js')
    ])
    .pipe(vPaths(function (p) {
      console.log(`${ME.d}[${C.O}${modName.toUpperCase()}${C.N}] ${C.Y}JS${C.N}: \t [${p}]`);
      return Promise.resolve(p);
    }))
    .pipe(replace({global: CONF, preserveUnknownTokens: true}))
    .pipe(gulp.dest(path.resolve(DEST, RESO, JS)));


  //--------------//
  //    DATA      //
  //--------------//
  let Data = gulp.src([
      path.join(SRC, DATA, '**/*.*')
    ])
    .pipe(vPaths(function (p) {
      console.log(`${ME.d}[${C.O}${modName.toUpperCase()}${C.N}] ${C.Y}DATA${C.N}: \t [${p}]`);
      return Promise.resolve(p);
    }))
    .pipe(gulp.dest(path.resolve(DEST, DATA)));

  return Promise.all([
      Static
    , JStask
    , Data
  ])
  .then((arrRes) => {
    return Promise.resolve(arrRes);
  })
  .catch((e) => {
    return Promise.reject(e);
  });

  // return merge(Static, JS, Data)
  //         .on('error', console.error.bind(console));

};


/**
 * @_EXPOSE
 */
exports = populate;


/**
 * @_EXPORTS
 */
module.exports = exports;
