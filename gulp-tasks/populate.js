/*!
 * Project:     cv
 * File:        ./gulp-tasks/populate.js
 * Copyright(c) 2018-present Baltrushaitis Tomas <tbaltrushaitis@gmail.com>
 * License:     MIT
 */

'use strict';

//  ------------------------------------------------------------------------  //
//  -----------------------------  DEPENDENCIES  ---------------------------  //
//  ------------------------------------------------------------------------  //
const path = require('path');
const utin = require('util').inspect;

const { series, parallel, src, dest } = require('gulp');

const replace    = require('gulp-token-replace');
const size       = require('gulp-size');
const terser    = require('gulp-terser');
const vPaths     = require('vinyl-paths');
const gulpif     = require('gulp-if');
const htmlmin    = require('gulp-htmlmin');
const readConfig = require('read-config');
// const headfoot   = require('gulp-headerfooter');


//  ------------------------------------------------------------------------  //
//  ----------------------------  CONFIGURATION  ---------------------------  //
//  ------------------------------------------------------------------------  //
let ME = Object.assign({}, globalThis.ME || {});
utin.defaultOptions = Object.assign({}, ME.pkg.options.iopts || {});

const modName       = path.basename(module.filename, '.js');
const modPath       = path.relative(ME.WD, path.dirname(module.filename));
const modConfigFile = `${path.join(ME.WD, 'config', modPath, modName)}.json`;
const modConfig     = readConfig(modConfigFile, Object.assign({}, ME.pkg.options.readconf));

ME.Config = Object.assign({}, ME.Config || {}, modConfig || {});
let C = ME.Config.colors;


//  ------------------------------------------------------------------------  //
//  ------------------------------  FUNCTIONS  -----------------------------  //
//  ------------------------------------------------------------------------  //
let CONF = Object.assign({}, ME.Config);
let SRC  = path.join(ME.SRC);
let DEST = path.join(ME.BUILD);
let RESO = path.join('resources');
let KEEP = path.join(ME.BUILD, RESO, 'assets');

let VOID = [
    'config/build.json'
  , `${SRC}/.*`
  , `${SRC}/*.txt`
  , `${SRC}/*.json`
];
let HTML = [
  `${SRC}/*.html`
];
let JS   = path.join('assets/js');
let CSS  = path.join('assets/css');
let DATA = path.join('data');


//--------------//
// STATIC FILES //
//--------------//
function Static () {
  return src(VOID)
    .pipe(vPaths(function (p) {
      console.log(`${ME.d}[${C.O}${modName.toUpperCase()}${C.N}] ${C.W}STATIC${C.N}: \t [${C.Gray}${p}${C.N}]`);
      return Promise.resolve(p);
    }))
    .pipe(replace({global: CONF, preserveUnknownTokens: true}))
    .pipe(size({title: 'STATIC', showFiles: false}))
    .pipe(dest(path.join(DEST)))
  ;
}


//--------------//
//     HTML     //
//--------------//
function HTMLtask () {
  return src(HTML)
    .pipe(vPaths(function (p) {
      console.log(`${ME.d}[${C.O}${modName.toUpperCase()}${C.N}] ${C.W}HTML${C.N}: \t [${C.Gray}${p}${C.N}]`);
      return Promise.resolve(p);
    }))
    .pipe(replace({global: CONF, preserveUnknownTokens: true}))
    // .pipe(gulpif('production' === ME.NODE_ENV || 'production' === process.env.npm_lifecycle_event, htmlmin(ME.pkg.options.htmlmin)))
    .pipe(gulpif(['production', ''].includes(ME.NODE_ENV), htmlmin(ME.pkg.options.htmlmin)))
    .pipe(size({title: 'HTML', showFiles: false}))
    .pipe(dest(path.join(DEST)))
    .pipe(vPaths(function (p) {
      console.log(`${ME.d}[${C.O}${modName.toUpperCase()}${C.N}] ${C.W}HTML${C.N}: \t [${C.Gray}${p}${C.N}]`);
      return Promise.resolve(p);
    }))
  ;
}


//--------------//
// JAVASCRIPTS //
//--------------//
function JStask () {
  return src([
      `${SRC}/${JS}/**/*.js`
    ])
    .pipe(vPaths(function (p) {
      console.log(`${ME.d}[${C.O}${modName.toUpperCase()}${C.N}] ${C.W}JS${C.N}: \t [${C.Gray}${p}${C.N}]`);
      return Promise.resolve(p);
    }))
    .pipe(replace({global: CONF, preserveUnknownTokens: true}))
    .pipe(gulpif(['production', ''].includes(ME.NODE_ENV), terser(ME.pkg.options.terser)))
    .pipe(size({title: 'SOURCE JS', showFiles: false}))
    .pipe(dest(path.join(DEST, JS)))
  ;
}


//--------------//
//    DATA      //
//--------------//
function DATAtask () {
  return src([
      `${SRC}/${DATA}/**/*.*`
    ])
    .pipe(vPaths(function (p) {
      console.log(`${ME.d}[${C.O}${modName.toUpperCase()}${C.N}] ${C.W}DATA${C.N}: \t [${C.Gray}${p}${C.N}]`);
      return Promise.resolve(p);
    }))
    .pipe(size({title: 'DATA', showFiles: false}))
    .pipe(dest(path.join(DEST, DATA)));
}


/**
 * @_EXPOSE
 */
exports.static  = Static;
exports.html    = HTMLtask;
exports.js      = JStask;
exports.data    = DATAtask;


/**
 * @_EXPORTS
 */
exports.default = series(Static, HTMLtask, JStask, DATAtask);
