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

const gulpif     = require('gulp-if');
const headfoot   = require('gulp-headerfooter');
const merge      = require('merge-stream');
const terser     = require('gulp-terser');
const vPaths     = require('vinyl-paths');
const readConfig = require('read-config');

//  ------------------------------------------------------------------------  //
//  ----------------------------  CONFIGURATION  ---------------------------  //
//  ------------------------------------------------------------------------  //

let ME = Object.assign({}, global.ME || {});
utin.defaultOptions = Object.assign({}, ME.pkg.options.iopts || {});

const modName = path.basename(module.filename, '.js');
const modPath = path.relative(ME.WD, path.dirname(module.filename));
const confPath = path.join(ME.WD, 'config');
const modConfigFile = `${path.join(confPath, modPath, modName)}.json`;
const modConfig = readConfig(modConfigFile, ME.pkg.options.readconf);

ME.Config = Object.assign({}, ME.Config || {}, modConfig || {});
let C = ME.Config.colors;

//  ------------------------------------------------------------------------  //
//  ------------------------------  FUNCTIONS  -----------------------------  //
//  ------------------------------------------------------------------------  //

const buildJs = function (gulp) {
  console.log(`${ME.L}${ME.d()}[${C.Y}${modPath}/${modName}${C.N}] with [${modConfigFile}]`);

  let FROM = path.join(ME.BUILD, 'resources/assets');
  let DEST = path.join(ME.BUILD, 'assets');
  let JS = path.join('js');

  let JSfront = gulp.src([
      path.join(FROM, JS, '**/*.js')
    ])
    .pipe(vPaths(function (p) {
      console.log(`${ME.d()}[${C.W}FRONT${C.N}] ${C.Y}JS${C.N}: [${p}]`);
      return Promise.resolve(p);
    }))
    .pipe(gulpif('production' === ME.NODE_ENV, terser(ME.pkg.options.terser)))
    //  Write banners
    .pipe(headfoot.header(ME.Banner.header))
    .pipe(headfoot.footer(ME.Banner.footer))
    .pipe(gulp.dest(path.resolve(DEST, JS)));

  return merge(JSfront)
          .on('error', console.error.bind(console));

};


/**
 * EXPOSE
 * @public
 */

module.exports = exports = buildJs;
