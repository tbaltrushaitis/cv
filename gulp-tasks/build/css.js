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
const { src, dest }  = require('gulp');

const path = require('path');
const utin = require('util').inspect;

const readConfig = require('read-config');
const cleanCSS   = require('gulp-clean-css');
const concatCSS  = require('gulp-concat-css');
const gulpif     = require('gulp-if');
const headfoot   = require('gulp-headerfooter');
// const merge      = require('merge-stream');
const size       = require('gulp-size');
const vPaths     = require('vinyl-paths');

//  ------------------------------------------------------------------------  //
//  ----------------------------  CONFIGURATION  ---------------------------  //
//  ------------------------------------------------------------------------  //
let ME = Object.assign({}, globalThis.ME || {});
utin.defaultOptions = Object.assign({}, ME.pkg.options.iopts || {});

const modName       = path.basename(module.filename, '.js');
const modPath       = path.relative(ME.WD, path.dirname(module.filename));
const confPath      = path.join(ME.WD, 'config', path.sep);
const modConfigFile = `${path.join(confPath, modPath, modName)}.json`;
const modConfig     = readConfig(modConfigFile, ME.pkg.options.readconf);

ME.Config = Object.assign({}, ME.Config || {}, modConfig || {});
let C = ME.Config.colors;

//  ------------------------------------------------------------------------  //
//  ------------------------------  FUNCTIONS  -----------------------------  //
//  ------------------------------------------------------------------------  //
let FROM = path.join(ME.SRC, 'assets/css');
let CSS  = path.join('css');
let DEST = path.join(ME.BUILD, 'assets');
let KEEP = path.join(ME.BUILD, 'resources/assets');
let CONF = ME.Config.cleanCSS;

let STYLES_SRC = [
    `${FROM}/default.css`
  , `${FROM}/theme.css`
  , `${FROM}/responsive.css`
// , `${FROM}/magnific-popup.css`
  , `${FROM}/og-grid.css`
  , `${FROM}/custom.css`
  , `${FROM}/fonts.css`
  , `${FROM}/custom-animations.css`
  , `${FROM}/fa-colors.css`
];


//
//  PROCESS CSS files
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
    .pipe(size({title: 'FRONT CSS', showFiles: true}))
    .pipe(dest(path.resolve(DEST, CSS)))
  ;

}


/**
 * @_EXPOSE
 */
exports.buildCss  = frontCSS;


/**
 * @_EXPORTS
 */
exports.default = frontCSS;
