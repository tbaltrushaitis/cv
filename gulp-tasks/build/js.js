/*!
 * Project:     cv
 * File:        ./gulp-tasks/build/js.js
 * Copyright(c) 2018-nowdays Baltrushaitis Tomas <tbaltrushaitis@gmail.com>
 * License:     MIT
 */

'use strict';

//  ------------------------------------------------------------------------  //
//  -----------------------------  DEPENDENCIES  ---------------------------  //
//  ------------------------------------------------------------------------  //
const path = require('path');
const utin = require('util').inspect;

const { series, parallel, src, dest } = require('gulp');

const readConfig = require('read-config');

const concatJS  = require('gulp-concat');
const gulpif    = require('gulp-if');
const size      = require('gulp-size');
const terser    = require('gulp-terser');
const vPaths    = require('vinyl-paths');
// const headfoot   = require('gulp-headerfooter');

//  ------------------------------------------------------------------------  //
//  ----------------------------  CONFIGURATION  ---------------------------  //
//  ------------------------------------------------------------------------  //
let ME = Object.assign({}, globalThis.ME || {});
utin.defaultOptions = Object.assign({}, ME.pkg.options.iopts || {});

const modName       = path.basename(module.filename, '.js');
const modPath       = path.relative(ME.WD, path.dirname(module.filename));
const confPath      = path.join(ME.WD, 'config');
const modConfigFile = `${path.join(confPath, modPath, modName)}.json`;
const modConfig     = readConfig(modConfigFile, ME.pkg.options.readconf);

ME.Config = Object.assign({}, ME.Config || {}, modConfig || {});
let C = ME.Config.colors;

//  ------------------------------------------------------------------------  //
//  ------------------------------  FUNCTIONS  -----------------------------  //
//  ------------------------------------------------------------------------  //
let JS   = path.join('js/lib');
// let FROM = path.join(ME.BUILD, 'resources', JS);
let FROM = path.join(ME.BUILD, 'resources/assets', JS);
let KEEP = path.join(ME.BUILD, 'resources/assets');
let DEST = path.join(ME.BUILD, 'assets');

let LIBS_SRC = [
    path.join(FROM, 'jquery.js')
  , path.join(FROM, 'bootstrap.js')
  , path.join(FROM, 'jquery.waypoints.js')
  , path.join(FROM, 'inview.js')
  , path.join(FROM, 'jquery.stellar.js')
  , path.join(FROM, 'jquery.sticky.js')
  , path.join(FROM, 'wow.js')

  , path.join(FROM, 'jquery.inview.js')
  , path.join(FROM, 'jquery.countTo.js')
  , path.join(FROM, 'jquery.easypiechart.js')

  , path.join(FROM, 'shuffle.js')
  , path.join(FROM, 'jquery.magnific-popup.js')
  , path.join(FROM, 'smoothscroll.js')
  , path.join(FROM, 'jquery.noty.packaged.js')
];


function frontJS () {
  return src(LIBS_SRC)
    .pipe(vPaths((p) => {
      console.log(`${ME.d}[${C.O}FRONT${C.N}] Bundle ${C.Y}JS${C.N}: [${C.Gray}${p}${C.N}]`);
      return Promise.resolve(p);
    }))
    .pipe(dest(path.resolve(KEEP, JS)))
    .pipe(gulpif(['production', ''].includes(ME.NODE_ENV), terser(ME.pkg.options.terser)))
    .pipe(dest(path.resolve(DEST, JS)))
    .pipe(concatJS('libs-bundle.js'))
    //  Write banners
    // .pipe(headfoot.header(ME.Banner.header))
    // .pipe(headfoot.footer(ME.Banner.footer))
    .pipe(size({title: 'FRONT JS', showFiles: false}))
    .pipe(dest(path.resolve(DEST, JS)))
  ;
}


/**
 * @_EXPOSE
 */
exports.frontJS = frontJS;


/**
 * @_EXPORTS
 */
exports.default = series(frontJS);
