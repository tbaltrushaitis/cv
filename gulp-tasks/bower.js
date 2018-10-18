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

const vinylPaths     = require('vinyl-paths');
const mainBowerFiles = require('main-bower-files');
const merge          = require('merge-stream');

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
const confPath = path.join(ME.WD, 'config', path.sep);
const modConfigFile = `${path.join(confPath, modPath, modName)}.json`;
const modConfig = require('read-config')(modConfigFile);

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
  let WEBFONT = path.join('webfonts');
  let IMG  = path.join('img');


  let bowerJS = gulp.src(mBower)
    .pipe(filter([
        '**/*.js'
      , '!**/*.min.js'
      , '!**/npm.js'
    ]))
    .pipe(vinylPaths(function (paths) {
      console.info('[BOWER] JS: ', paths);
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
    .pipe(gulpif('production' === ME.NODE_ENV, new cleanCSS({debug: true, rebase: false}, function (d) {
      console.info('[BOWER] CSS: Compress [', d.path, ']: [', utin(d.stats.originalSize), '->', utin(d.stats.minifiedSize), '] [', utin(parseFloat((100 * d.stats.efficiency).toFixed(2))), '%] in [', utin(d.stats.timeSpent), 'ms]');
    })))
    .pipe(concatCSS('bower-bundle.css', {rebaseUrls: false, commonBase: path.join(DEST, CSS)}))
    //  Write banners
    .pipe(headfoot.header(ME.Banner.header))
    .pipe(headfoot.footer(ME.Banner.footer))
    .pipe(gulp.dest(path.resolve(DEST, CSS)));


  let bowerFonts = gulp.src(mBower)
    .pipe(filter(['**/fonts/*.*']))
    .pipe(vinylPaths(function (paths) {
      console.info('[BOWER] FONT:', paths);
      return Promise.resolve(paths);
    }))
    .pipe(gulp.dest(path.resolve(DEST, FONT)));


  let webFonts = gulp.src(mBower)
    .pipe(filter(['**/webfonts/*.*']))
    .pipe(vinylPaths(function (paths) {
      console.info('[BOWER] WEBFONT:', paths);
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
      console.info('[BOWER] IMG:', paths);
      return Promise.resolve(paths);
    }))
    .pipe(gulp.dest(path.join(DEST, IMG)));

  return merge(bowerJS, bowerCSS, bowerFonts, webFonts, bowerImg);

};
