/*!
 * Project:     cv
 * File:        ./gulp-tasks/build/img.js
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


const extReplace = require('gulp-ext-replace');
const filter     = require('gulp-filter');
const jimp       = require('gulp-jimp');
const merge      = require('merge-stream');
const vPaths     = require('vinyl-paths');
const readConfig = require('read-config');

const imagemin = require('gulp-imagemin');
const giflossy = require('imagemin-giflossy');
const mozjpeg  = require('imagemin-mozjpeg');
const pngquant = require('imagemin-pngquant');
const webp     = require('imagemin-webp');

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

const buildImg = async function (gulp) {
  console.log(`${ME.L}${ME.d}[${C.O}${modPath}/${modName}${C.N}] with [${C.Blue}${modConfigFile}${C.N}]`);

  /**
   * JIMP - responsible for image processing
   */
  let FROM = path.join(ME.BUILD, 'assets');
  let DEST = path.join(ME.BUILD, 'assets');
  let IMG  = path.join('img');
  let TUMB = path.join('thumbs');
  let SRC  = path.join(FROM, IMG, 'works', '**/*.*');

  let jimpOpts = Object.assign({}, {
      autocrop: {
          tolerance:      0.0002
        , cropOnlyFrames: false
      }
    , resize: {
          height: 180
        , width:  270
      }
    , type: 'png'
  });

  let gifOpts   = giflossy(ME.pkg.options.giflossy);
  let pngOpts   = pngquant(ME.pkg.options.pngquant);
  let jpegOpts  = mozjpeg(ME.pkg.options.mozjpeg);
  let webpOpts  = webp(ME.pkg.options.webp);
  let imageminOpts = [
      pngOpts
    , jpegOpts
  ];


  let PNGS = await gulp.src(path.join(FROM, IMG, 'works', '**/*.*'))
    .pipe(filter([
      '**/*.png'
    ]))
    .pipe(vPaths(function (p) {
      console.log(`${ME.d}[${C.O}JIMP${C.N}] ${C.W}Resize${C.N} ${C.Y}PNG${C.N}: [${p}]`);
      return Promise.resolve(p);
    }))
    .pipe(jimp({
      '': jimpOpts
    }))
    .pipe(gulp.dest(path.join(DEST, IMG, TUMB, 'works')));


  let JPGS = await gulp.src(path.join(FROM, IMG, 'works', '**/*.*'))
    .pipe(filter([
        '**/*.jpg'
      , '**/*.jpeg'
    ]))
    .pipe(vPaths(function (p) {
      console.log(`${ME.d}[${C.O}JIMP${C.N}] ${C.W}Resize${C.N} ${C.Y}JPG${C.N}: [${p}]`);
      return Promise.resolve(p);
    }))
    .pipe(jimp({
      '': {
              ...jimpOpts
            , ...{type: 'jpg'}
          }
    }))
    .pipe(gulp.dest(path.join(DEST, IMG, TUMB, 'works')));


  let WEBP = await gulp.src(path.join(FROM, IMG, '**/*.*'))
    .pipe(filter([
        '**/*.jpg'
      , '**/*.jpeg'
      , '**/*.png'
    ]))
    .pipe(vPaths(function (p) {
      console.log(`${ME.d}[${C.O}IMAGEMIN${C.N}] ${C.W}Create${C.N} ${C.Y}WEBP${C.N}: [${p}]`);
      return Promise.resolve(p);
    }))
    .pipe(imagemin([
      webpOpts
    ]))
    .pipe(extReplace('.webp'))
    .pipe(gulp.dest(path.join(DEST, IMG)));


  let GIFS = await gulp.src(path.join(FROM, IMG, 'works', '**/*.*'))
    .pipe(filter([
      '**/*.gif'
    ]))
    .pipe(vPaths(function (p) {
      console.log(`${ME.d}[${C.O}IMAGEMIN${C.N}] ${C.W}Giflossy${C.N} ${C.Y}GIF${C.N}: [${p}]`);
      return Promise.resolve(p);
    }))
    .pipe(imagemin({
        ...gifOpts
      , ...{resize: '270x180'}
    }))
    .pipe(gulp.dest(path.join(DEST, IMG, TUMB, 'works')));


  // return merge(PNGS, JPGS, WEBP, GIFS)
  //         .on('error', console.error.bind(console));

  console.log(`${ME.L}${ME.d}[${C.O}${modPath}/${modName}${C.N}] FINISHED`);
};


/**
 * @_EXPOSE
 */
exports = buildImg;


/**
 * @_EXPORTS
 */
module.exports = exports;
