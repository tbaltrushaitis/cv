/*!
 * File:        ./gulp-tasks/build/img.js
 * Copyright(c) 2018-nowdays Baltrushaitis Tomas
 * License:     MIT
 */

'use strict';

//--------------//
// DEPENDENCIES //
//--------------//

const _ = require('lodash');

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

//---------------//
// CONFIGURATION //
//---------------//

const modName = path.basename(module.filename, '.js');
const modPath = path.relative(global.ME.WD, path.dirname(module.filename));

const modConfigFile = `config/${path.join(modPath, modName)}.json`;
const modConfig = require('read-config')(modConfigFile);


//--------------//
//  EXPOSE      //
//--------------//

module.exports = function (gulp) {
  console.log(`[${new Date().toISOString()}][${modPath}/${modName}] ACTIVATED with modConfig = [${utin(modConfig)}]`);

  // const gulpSequence = require('gulp-sequence').use(gulp);

  //  JIMP - responsible for image processing
  let FROM = path.join(global.ME.SRC, 'assets');
  let DEST = path.join(global.ME.BUILD, 'assets');
  let KEEP = path.join(global.ME.BUILD, 'resources/assets');
  let IMG  = path.join('img/works');

  let PNGS = gulp.src([path.join(FROM, IMG, '*.*')])
    .pipe(filter(['**/*.png']))
    .pipe(gulp.dest(path.join(KEEP, IMG)))
    .pipe(vinylPaths(function (paths) {
      console.info('PNG:', paths);
      return Promise.resolve(paths);
    }))
    .pipe(jimp({
      '-sm': {
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
    .pipe(gulp.dest(path.join(DEST, IMG)));

  let JPGS = gulp.src([path.join(FROM, IMG, '**/*.*')])
    .pipe(filter([
        '**/*.jpg'
      , '**/*.jpeg'
    ]))
    .pipe(vinylPaths(function (paths) {
      console.info('JPEG:', paths);
      return Promise.resolve(paths);
    }))
    .pipe(jimp({
      '-sm': {
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
    .pipe(gulp.dest(path.join(DEST, IMG)));

  // return gulpSequence(PNGS);
  return merge(PNGS, JPGS);

};
