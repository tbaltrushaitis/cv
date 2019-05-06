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

const gulpif     = require('gulp-if');
const headfoot   = require('gulp-headerfooter');
const merge      = require('merge-stream');
const readConfig = require('read-config');
const replace    = require('gulp-token-replace');
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
  console.log(`${ME.L}${ME.d()}[${C.Y}${modPath}/${modName}${C.N}] with [${modConfigFile}]`);

  let CONF = Object.assign({}, ME.Config);
  let SRC  = path.join(ME.SRC);
  let DEST = path.join(ME.BUILD);
  let RESO = path.join('resources');

  let Void = [
      path.join(SRC, '*.*')
    , path.join(SRC, '.*')
  ];
  let JS   = path.join('assets/js');
  let CSS  = path.join('assets/css');
  let DATA = path.join('data');


  //--------------//
  // STATIC FILES //
  //--------------//
  let srcVoid = gulp.src(Void)
    .pipe(vPaths(function (p) {
      console.log(`${ME.d()}[${C.W}${modName.toUpperCase()}${C.N}] STATIC: \t [${p}]`);
      return Promise.resolve(p);
    }))
    .pipe(replace({global: CONF, preserveUnknownTokens: true}))
    .pipe(gulp.dest(path.resolve(DEST)));


  //--------------//
  // JAVASCRIPTS //
  //--------------//
  let srcJS = gulp.src([
      path.join(SRC, JS, '**/*.js')
    ])
    .pipe(vPaths(function (p) {
      console.log(`${ME.d()}[${C.W}${modName.toUpperCase()}${C.N}] JS: \t [${p}]`);
      return Promise.resolve(p);
    }))
    .pipe(replace({global: CONF, preserveUnknownTokens: true}))
    .pipe(gulp.dest(path.resolve(DEST, RESO, JS)));


  //--------------//
  //    DATA      //
  //--------------//
  let srcData = gulp.src([
      path.join(SRC, DATA, '**/*.*')
    ])
    .pipe(vPaths(function (p) {
      console.log(`${ME.d()}[${C.W}${modName.toUpperCase()}${C.N}] DATA: \t [${p}]`);
      return Promise.resolve(p);
    }))
    .pipe(gulp.dest(path.resolve(DEST, DATA)));

  return merge(srcVoid, srcJS, srcData)
          .on('error', console.error.bind(console));

};


/**
 * EXPOSE
 * @public
 */

module.exports = exports = populate;
