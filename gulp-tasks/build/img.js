/*!
 * File:        ./gulp-tasks/build/img.js
 * Copyright(c) 2018-nowdays Baltrushaitis Tomas
 * License:     MIT
 */

'use strict';

//  ------------------------------------------------------------------------  //
//  -----------------------------  DEPENDENCIES  ---------------------------  //
//  ------------------------------------------------------------------------  //

const fs   = require('fs');
const del  = require('del');
const path = require('path');
const util = require('util');
const utin = util.inspect;

const argv       = require('yargs').argv;
const parseArgs  = require('minimist');
const vinylPaths = require('vinyl-paths');

const dirSync = require('gulp-directory-sync');
const changed = require('gulp-changed');
const filter  = require('gulp-filter');
const gulpif  = require('gulp-if');
const rename  = require('gulp-rename');
const jimp    = require('gulp-jimp');
const merge   = require('merge-stream');


//  ------------------------------------------------------------------------  //
//  ----------------------------  CONFIGURATION  ---------------------------  //
//  ------------------------------------------------------------------------  //

let ME = Object.assign({}, global.ME || {});
utin.defaultOptions = Object.assign({}, ME.pkg.options.iopts || {});

const modName = path.basename(module.filename, '.js');
const modPath = path.relative(ME.WD, path.dirname(module.filename));
const confPath = path.join(ME.WD, 'config', path.sep);
const modConfigFile = `${path.join(confPath, modPath, modName)}.json`;
const modConfig = require('read-config')(modConfigFile, ME.pkg.options.readconf);

ME.Config = Object.assign({}, ME.Config || {}, modConfig || {});


//  ------------------------------------------------------------------------  //
//  --------------------------------  EXPOSE  ------------------------------  //
//  ------------------------------------------------------------------------  //

module.exports = function (gulp) {
  console.log(`[${new Date().toISOString()}][${modPath}/${modName}] with [${utin(modConfigFile)}]`);

  //  JIMP - responsible for image processing
  let FROM = path.join(ME.BUILD, 'assets');
  let DEST = path.join(ME.BUILD, 'assets');
  let IMG  = path.join('img');
  let TUMB = path.join('thumbs');
  let SRC = path.join(FROM, IMG, 'works', '**/*.*');


  let PNGS = gulp.src([SRC])
    .pipe(filter(['**/*.png']))
    .pipe(vinylPaths(function (paths) {
      console.log(`[${new Date().toISOString()}][FRONT][IMAGE] Crop PNG: [${utin(paths)}]`);
      return Promise.resolve(paths);
    }))
    .pipe(jimp({
      '': {
          autocrop: {
              tolerance: 0.0002
            , cropOnlyFrames: false
          }
        , resize: {
              width: 270
            , height: 180
          }
        , type: 'png'
      }
    }))
    .pipe(gulp.dest(path.join(DEST, IMG, TUMB, 'works')));


  let JPGS = gulp.src(SRC)
    .pipe(filter([
        '**/*.jpg'
      , '**/*.jpeg'
    ]))
    .pipe(vinylPaths(function (paths) {
      console.log(`[${new Date().toISOString()}][FRONT][IMAGE] Crop JPEG: [${utin(paths)}]`);
      return Promise.resolve(paths);
    }))
    .pipe(jimp({
      '': {
          autocrop: {
              tolerance: 0.0002
            , cropOnlyFrames: false
          }
        , resize: {
              width: 270
            , height: 180
          }
        , type: 'jpg'
      }
    }))
    .pipe(gulp.dest(path.join(DEST, IMG, TUMB, 'works')));

  return merge(PNGS, JPGS);

};
