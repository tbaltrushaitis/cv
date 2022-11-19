/*!
 * Project:     cv
 * File:        ./gulp-tasks/build/css.js
 * Copyright(c) 2016-nowdays Baltrushaitis Tomas <tbaltrushaitis@gmail.com>
 * License:     MIT
 */

'use strict';

//  ------------------------------------------------------------------------  //
//  -----------------------------  DEPENDENCIES  ---------------------------  //
//  ------------------------------------------------------------------------  //
const path = require('path');
// const utin = require('util').inspect;

const { series, parallel, src, dest }  = require('gulp');

const readConfig = require('read-config');

const cleanCSS   = require('gulp-clean-css');
const concatCSS  = require('gulp-concat-css');
const gulpif     = require('gulp-if');
const size       = require('gulp-size');
const vPaths     = require('vinyl-paths');
// const headfoot   = require('gulp-headerfooter');


//  ------------------------------------------------------------------------  //
//  ----------------------------  CONFIGURATION  ---------------------------  //
//  ------------------------------------------------------------------------  //
let ME = Object.assign({}, globalThis.ME || {});
let C = ME.Config.colors;


//  ------------------------------------------------------------------------  //
//  ------------------------------  FUNCTIONS  -----------------------------  //
//  ------------------------------------------------------------------------  //
let CSS  = path.join('css');
let FROM = path.join(ME.SRC, 'assets', CSS);
let KEEP = path.join(ME.BUILD, 'resources/assets');
let DEST = path.join(ME.BUILD, 'assets');
let CONF = ME.Config.cleanCSS;

let STYLES_SRC = [
    `${FROM}/default.css`
  , `${FROM}/fonts.css`
  , `${FROM}/theme.css`
  , `${FROM}/responsive.css`
// , `${FROM}/magnific-popup.css`
  , `${FROM}/og-grid.css`
  , `${FROM}/custom.css`
  , `${FROM}/custom-animations.css`
  , `${FROM}/fa-colors.css`
];


//
//  Process CSS files
//
function frontCSS () {

  return src(STYLES_SRC)
    .pipe(vPaths(function (p) {
      console.log(`${ME.d}[${C.O}FRONT${C.N}] Bundle ${C.W}CSS${C.N}: [${C.Gray}${p}${C.N}]`);
      return Promise.resolve(p);
    }))
    .pipe(dest(path.resolve(KEEP, CSS)))
    .pipe(concatCSS('frontend-bundle.css', {rebaseUrls: true}))
    .pipe(gulpif(['production', ''].includes(ME.NODE_ENV), cleanCSS(CONF)))
    //  Write banners
    // .pipe(headfoot.header(ME.Banner.header))
    // .pipe(headfoot.footer(ME.Banner.footer))
    .pipe(size({title: 'FRONT CSS Bundle', showFiles: false}))
    .pipe(dest(path.resolve(DEST, CSS)))
  ;

}


/**
 * @_EXPOSE
 */
exports.frontCSS  = frontCSS;


/**
 * @_EXPORTS
 */
exports.default = series(frontCSS);
