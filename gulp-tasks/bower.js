/*!
 * Project:     cv
 * File:        ./gulp-tasks/bower.js
 * Copyright(c) 2018-nowdays Baltrushaitis Tomas <tbaltrushaitis@gmail.com>
 * License:     MIT
 */

'use strict';

//  ------------------------------------------------------------------------  //
//  -----------------------------  DEPENDENCIES  ---------------------------  //
//  ------------------------------------------------------------------------  //

const fs   = require('fs');
const path = require('path');
const utin = require('util').inspect;

const mBowerFiles = require('main-bower-files');
const readConfig  = require('read-config');

const concatCSS = require('gulp-concat-css');
const cleanCSS  = require('gulp-clean-css');
const filter    = require('gulp-filter');
const gulpif    = require('gulp-if');
const headfoot  = require('gulp-headerfooter');
const merge     = require('merge-stream');
const terser    = require('gulp-terser');
const vPaths    = require('vinyl-paths');


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
let L = `\n${C.White}${(new Array(80).join('-'))}${C.NC}\n`;

//  ------------------------------------------------------------------------  //
//  ------------------------------  FUNCTIONS  -----------------------------  //
//  ------------------------------------------------------------------------  //

const bowerFiles = function (gulp) {
  console.log(`${L}[${new Date().toISOString()}][${C.Yellow}${modPath}/${modName}${C.NC}] with [${modConfigFile}]`);

  //
  //  BOWER - responsible for FrontEnd assets
  //
  let mBower = mBowerFiles(ME.pkg.options.bower, {
      base:   ME.BOWER
    , group:  ['front']
  });

  let DEST = path.join(ME.BUILD, 'assets');
  let KEEP = path.join(ME.BUILD, 'resources/assets');
  let JS   = path.join('js/lib');
  let CSS  = path.join('css');
  let FONT = path.join('fonts');
  let IMG  = path.join('img');
  let WEBFONT = path.join('webfonts');


  let bowerJS = gulp.src(mBower)
    .pipe(filter([
        '**/*.js'
      , '!**/*.min.js'
      , '!**/npm.js'
    ]))
    .pipe(vPaths(function (p) {
      console.log(`[${new Date().toISOString()}][${C.White}BOWER${C.NC}] JS: [${p}]`);
      return Promise.resolve(p);
    }))
    .pipe(gulpif('production' === ME.NODE_ENV, terser(ME.pkg.options.terser)))
    //  Write banners
    .pipe(headfoot.header(ME.Banner.header))
    .pipe(headfoot.footer(ME.Banner.footer))
    .pipe(gulp.dest(path.resolve(DEST, JS)));


  let bowerCSS = gulp.src(mBower)
    .pipe(filter([
        '**/*.css'
      , "!**/*.css.map"
      , '!**/*.min.css'
      , "!**/*.css.min.map"
      , "!**/*.min.css.map"
    ]))
    .pipe(concatCSS('bower-bundle.css', {rebaseUrls: false, commonBase: path.join(DEST)}))
    .pipe(gulpif('production' === ME.NODE_ENV, new cleanCSS({debug: false, rebase: false}, function (d) {
      console.log(`[${new Date().toISOString()}][${C.White}BOWER${C.NC}] Compress CSS [${d.path}]: [${utin(d.stats.originalSize)} -> ${utin(d.stats.minifiedSize)}] [${utin(parseFloat((100 * d.stats.efficiency).toFixed(2)))}%] in [${utin(d.stats.timeSpent)}ms]`);
    }), false))
    //  Write banners
    .pipe(headfoot.header(ME.Banner.header))
    .pipe(headfoot.footer(ME.Banner.footer))
    .pipe(gulp.dest(path.resolve(DEST, CSS)));


  let bowerFonts = gulp.src(mBower)
    .pipe(filter(['**/fonts/**/*.*']))
    .pipe(vPaths(function (p) {
      console.log(`[${new Date().toISOString()}][${C.White}BOWER${C.NC}] FONT: [${p}]`);
      return Promise.resolve(p);
    }))
    .pipe(gulp.dest(path.resolve(DEST, FONT)));


  let webFonts = gulp.src(mBower)
    .pipe(filter(['**/webfonts/*.*']))
    .pipe(vPaths(function (p) {
      console.log(`[${new Date().toISOString()}][${C.White}BOWER${C.NC}] WEBFONT: [${p}]`);
      return Promise.resolve(p);
    }))
    .pipe(gulp.dest(path.resolve(DEST, WEBFONT)));


  let bowerImg = gulp.src(mBower)
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
      console.log(`[${new Date().toISOString()}][${C.White}BOWER${C.NC}] IMG: [${p}]`);
      return Promise.resolve(p);
    }))
    .pipe(gulp.dest(path.join(DEST, IMG)));


  return merge(bowerJS, bowerCSS, bowerFonts, webFonts, bowerImg)
          .on('error', console.error.bind(console));

};


/**
 * EXPOSE
 * @public
 */

module.exports = exports = bowerFiles;
