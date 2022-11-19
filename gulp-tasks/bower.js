/*!
 * Project:     cv
 * File:        ./gulp-tasks/bower.js
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

const mBowerFiles = require('main-bower-files');
const readConfig  = require('read-config');

const concatCSS = require('gulp-concat-css');
const cleanCSS  = require('gulp-clean-css');
const concatJS  = require('gulp-concat');
const filter    = require('gulp-filter');
const gulpif    = require('gulp-if');
const size      = require('gulp-size');
const terser    = require('gulp-terser');
const vPaths    = require('vinyl-paths');
// const headfoot  = require('gulp-headerfooter');


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
let JS   = path.join('js/lib');
let CSS  = path.join('css');
let FONT = path.join('fonts');
let IMG  = path.join('img');
let WEBFONT = path.join('webfonts');
let KEEP = path.join(ME.BUILD, 'resources/assets');
let DEST = path.join(ME.BUILD, 'assets');

let CONF = {
    // , format: 'keep-breaks'
    debug: true
  , rebase: false
  , level: {
        1: {
            all:              false
          , removeEmpty:      true
          , specialComments:  'all'
        }
      , 2: {
            all:          false
          , removeEmpty:  true
        }
    }
};


//
//  BOWER - responsible for FrontEnd assets
//
let mBower;


//
//  bowerFiles - Collect FrontEnd assets
//
function bowerFiles (cb) {
  mBower = mBowerFiles(ME.pkg.options.bower, {
      base:  `${ME.BOWER}`
    , group: ['front']
  });
  // console.log(mBower);

  if ('function' === typeof cb) {
    cb();
  }

}


function bowerJS (cb) {
  return src(mBower)
    .pipe(filter([
        '**/*.js'
      , '!**/*.min.js'
      , '!**/npm.js'
    ]))
    .pipe(vPaths(function (p) {
      console.log(`${ME.d}[${C.O}${modName.toUpperCase()}${C.N}] Add ${C.R}JS${C.N}: [${C.Gray}${p}${C.N}]`);
      return Promise.resolve(p);
    }))
    .pipe(dest(path.resolve(KEEP, JS)))
    .pipe(gulpif(['production', ''].includes(ME.NODE_ENV), terser(ME.pkg.options.terser)))
    .pipe(dest(path.resolve(DEST, JS)))
    .pipe(concatJS('bower-bundle.js'))
    //  Write banners
    // .pipe(headfoot.header(ME.Banner.header))
    // .pipe(headfoot.footer(ME.Banner.footer))
    .pipe(size({title: 'BOWER:SCRIPTS', showFiles: false}))
    .pipe(dest(path.resolve(DEST, JS)))
  ;
}


function bowerCSS (cb) {
  return src(mBower)
    .pipe(filter([
        '**/*.css'
      , "!**/*.css.map"
      , '!**/*.min.css'
      , "!**/*.css.min.map"
      , "!**/*.min.css.map"
    ]))
    .pipe(vPaths(function (p) {
      console.log(`${ME.d}[${C.O}${modName.toUpperCase()}${C.N}] Add ${C.Y}CSS${C.N}: [${C.Gray}${p}${C.N}]`);
      return Promise.resolve(p);
    }))
    .pipe(concatCSS('bower-bundle.css', {rebaseUrls: false, commonBase: `${path.join(DEST)}`}))
    .pipe(gulpif(['production', ''].includes(ME.NODE_ENV), cleanCSS(ME.pkg.options.cleanCSS)))
    //  Write banners
    // .pipe(headfoot.header(ME.Banner.header))
    // .pipe(headfoot.footer(ME.Banner.footer))
    .pipe(size({title: 'BOWER:CSS', showFiles: false}))
    .pipe(dest(path.resolve(DEST, CSS)))
  ;
}


function bowerFonts (cb) {
  return src(mBower)
    .pipe(filter(['**/fonts/**/*.*']))
    .pipe(vPaths(function (p) {
      console.log(`${ME.d}[${C.O}${modName.toUpperCase()}${C.N}] Copy ${C.W}FONT${C.N}: [${C.Gray}${p}${C.N}]`);
      return Promise.resolve(p);
    }))
    .pipe(size({title: 'BOWER:FONTS', showFiles: false}))
    .pipe(dest(path.resolve(DEST, FONT)))
  ;
}


function webFonts (cb) {
  return src(mBower)
    .pipe(filter(['**/webfonts/*.*']))
    .pipe(vPaths(function (p) {
      console.log(`${ME.d}[${C.O}${modName.toUpperCase()}${C.N}] Copy ${C.W}WEBFONT${C.N}: [${C.Gray}${p}${C.N}]`);
      return Promise.resolve(p);
    }))
    .pipe(size({title: 'BOWER:WEBFONTS', showFiles: false}))
    .pipe(dest(path.resolve(DEST, WEBFONT)))
  ;
}


function bowerImg (cb) {
  return src(mBower)
    .pipe(filter([
        '**/img/*.*'
      , '**/image/*.*'
      , '**/images/*.*'
      , '**/*.png'
      , '**/*.jpg'
      , '**/*.jpeg'
      , '**/*.gif'
      , '**/*.ico'
    ]))
    .pipe(vPaths(function (p) {
      console.log(`${ME.d}[${C.O}${modName.toUpperCase()}${C.N}] Copy ${C.Blue}IMG${C.N}: [${C.Gray}${p}${C.N}]`);
      return Promise.resolve(p);
    }))
    .pipe(size({title: 'BOWER:IMAGES', showFiles: false}))
    .pipe(dest(path.resolve(DEST, IMG)))
  ;
}


/**
 * @_EXPOSE
 */
exports.bowerFiles  = bowerFiles
exports.bowerFonts  = bowerFonts
exports.webFonts    = webFonts
exports.bowerJS     = bowerJS
exports.bowerCSS    = bowerCSS
exports.bowerImg    = bowerImg


/**
 * @_EXPORTS
 */
exports.default = series(bowerFiles, bowerFonts, webFonts, bowerJS, bowerCSS, bowerImg);
