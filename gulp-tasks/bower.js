/*!
 * File:        ./gulp-tasks/bower.js
 * Copyright(c) 2018-nowdays Baltrushaitis Tomas
 * License:     MIT
 */

'use strict';

//  ------------------------------------------------------------------------  //
//  -----------------------------  DEPENDENCIES  ---------------------------  //
//  ------------------------------------------------------------------------  //

const fs   = require('fs');
const path = require('path');
const util = require('util');
const utin = util.inspect;

const mainBowerFiles = require('main-bower-files');
const merge          = require('merge-stream');
const readConfig     = require('read-config');
const vinylPaths     = require('vinyl-paths');

const changed   = require('gulp-changed');
const concatCSS = require('gulp-concat-css');
const cleanCSS  = require('gulp-clean-css');
const filter    = require('gulp-filter');
const gulpif    = require('gulp-if');
const headfoot  = require('gulp-headerfooter');
const terser    = require('gulp-terser');


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

//  ------------------------------------------------------------------------  //
//  --------------------------------  EXPOSE  ------------------------------  //
//  ------------------------------------------------------------------------  //

module.exports = function (gulp) {
  console.log(`[${new Date().toISOString()}][${modPath}/${modName}] with [${utin(modConfigFile)}]`);

  //  BOWER - responsible for FrontEnd assets
  let mBower = mainBowerFiles(ME.pkg.options.bower, {
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
    .pipe(vinylPaths(function (paths) {
      console.log(`[${new Date().toISOString()}][BOWER] JS: [${utin(paths)}]`);
      return Promise.resolve(paths);
    }))
    .pipe(gulpif('production' === ME.NODE_ENV, terser()))
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
    // .pipe(vinylPaths(function (paths) {
    //   console.info('[BOWER] CSS:', paths);
    //   return Promise.resolve(paths);
    // }))
    .pipe(concatCSS('bower-bundle.css', {rebaseUrls: false, commonBase: path.join(DEST, CSS)}))
    .pipe(gulpif('production' === ME.NODE_ENV, new cleanCSS({debug: false, rebase: false}, function (d) {
      console.log(`[${new Date().toISOString()}][BOWER] Compress CSS [${utin(d.path)}]: [${utin(d.stats.originalSize)} -> ${utin(d.stats.minifiedSize)}] [${utin(parseFloat((100 * d.stats.efficiency).toFixed(2)))}%] in [${utin(d.stats.timeSpent)}ms]`);
    }), false))
    //  Write banners
    .pipe(headfoot.header(ME.Banner.header))
    .pipe(headfoot.footer(ME.Banner.footer))
    .pipe(gulp.dest(path.resolve(DEST, CSS)));


  let bowerFonts = gulp.src(mBower)
    .pipe(filter(['**/fonts/*.*']))
    .pipe(vinylPaths(function (paths) {
      console.log(`[${new Date().toISOString()}][BOWER] FONT: [${utin(paths)}]`);
      return Promise.resolve(paths);
    }))
    .pipe(gulp.dest(path.resolve(DEST, FONT)));


  let webFonts = gulp.src(mBower)
    .pipe(filter(['**/webfonts/*.*']))
    .pipe(vinylPaths(function (paths) {
      console.log(`[${new Date().toISOString()}][BOWER] WEBFONT: [${utin(paths)}]`);
      return Promise.resolve(paths);
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
    .pipe(vinylPaths(function (paths) {
      console.log(`[${new Date().toISOString()}][BOWER] IMG: [${utin(paths)}]`);
      return Promise.resolve(paths);
    }))
    .pipe(gulp.dest(path.join(DEST, IMG)));


  return merge(bowerJS, bowerCSS, bowerFonts, webFonts, bowerImg);

};
