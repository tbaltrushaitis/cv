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
const path = require('path');
const utin = require('util').inspect;

const { src, dest, series, parallel } = require('gulp');

const extReplace = require('gulp-ext-replace');
const filter     = require('gulp-filter');
const jimp       = require('gulp-jimp');
const vPaths     = require('vinyl-paths');
const readConfig = require('read-config');
const size       = require('gulp-size');

const imagemin = require('imagemin');
const giflossy = require('imagemin-giflossy');
const gifsicle = require('imagemin-gifsicle');
const mozjpeg  = require('imagemin-mozjpeg');
const pngquant = require('imagemin-pngquant');
const webp     = require('imagemin-webp');
// const imageminGulp  = require('gulp-imagemin');


//  ------------------------------------------------------------------------  //
//  ----------------------------  CONFIGURATION  ---------------------------  //
//  ------------------------------------------------------------------------  //
let ME = Object.assign({}, globalThis.ME || {});
utin.defaultOptions = Object.assign({}, ME.pkg.options.iopts || {});

const modName       = path.basename(module.filename, '.js');
const modPath       = path.relative(ME.WD, path.dirname(module.filename));
const confPath      = path.join(ME.WD, 'config');
const modConfigFile = `${path.join(confPath, modPath, modName)}.json`;
const modConfig     = readConfig(modConfigFile, ME.pkg.options.readconf);

ME.Config = Object.assign({}, ME.Config || {}, modConfig || {});
let C = ME.Config.colors;


//  ------------------------------------------------------------------------  //
//  ------------------------------  FUNCTIONS  -----------------------------  //
//  ------------------------------------------------------------------------  //

/**
 * JIMP - responsible for image processing
 */
// let FROM = path.join(ME.BUILD, 'assets');
let IMG  = path.join('img');
let TUMB = path.join('thumbs');
let FROM = path.join(ME.SRC, 'assets');
let DEST = path.join(ME.BUILD, 'assets');
let SRC  = path.join(FROM, IMG, 'works', '**/*.*');

let jimpOpts      = ME.pkg.options.jimp;
let giflossyOpts  = ME.pkg.options.giflossy;
let gifsicleOpts  = gifsicle(ME.pkg.options.gifsicle);
let pngOpts       = pngquant(ME.pkg.options.pngquant);
let jpegOpts      = mozjpeg(ME.pkg.options.mozjpeg);
let webpOpts      = webp(ME.pkg.options.webp);
let imageminOpts  = [
    pngOpts
  , jpegOpts
];


function PNGS () {
  return src(
      [path.join(FROM, IMG, 'works', '**/*.*')]
    )
    .pipe(filter([
      '**/*.png'
    ]))
    .pipe(vPaths(function (p) {
      console.log(`${ME.d}[${C.O}JIMP${C.N}] Resize ${C.W}PNG${C.N}: [${C.Gray}${p}${C.N}]`);
      return Promise.resolve(p);
    }))
    .pipe(jimp({
      '': jimpOpts
    }))
    .pipe(extReplace('.thumb.png'))
    .pipe(size({title: 'PNG', showFiles: false}))
    .pipe(dest(path.join(DEST, IMG, 'works')))
  ;
}

function JPGS () {
  console.log();
  return src([
      path.join(FROM, IMG, 'works', '**/*.*')
    ])
    .pipe(filter([
        '**/*.jpg'
      , '**/*.jpeg'
      , '!*.thumb.jpg'
    ]))
    .pipe(vPaths(function (p) {
      console.log(`${ME.d}[${C.O}JIMP${C.N}] Resize ${C.W}JPG${C.N}: [${C.Gray}${p}${C.N}]`);
      return Promise.resolve(p);
    }))
    .pipe(jimp({
      '': Object.assign({}, jimpOpts, {type: 'jpg'})
    }))
    .pipe(extReplace('.thumb.jpg'))
    .pipe(size({title: 'JPEG', showFiles: false}))
    .pipe(dest(path.join(DEST, IMG, 'works')));
}

function GIFS () {
  let Opts = {
      // ...giflossyOpts
      ...ME.pkg.options.giflossy
    , resize: '270x171'
  };
  // console.log(`${ME.d}[${C.O}IMAGEMIN${C.N}] giflossyOpts: [${utin(giflossyOpts)}]`);
  console.log(`${ME.d}[${C.O}IMAGEMIN${C.N}] ${C.R}GIFS OPTS${C.N}: [${utin(Opts)}]`);

  return src([path.join(FROM, IMG, 'works', '*.gif')])
    .pipe(vPaths(function (p) {
      console.log(`${ME.d}[${C.O}IMAGEMIN${C.N}] Gif{lossy,sicle} ${C.P}GIF${C.N}: [${C.Gray}${p}${C.N}]`);
      return Promise.resolve(p);
    }))
    // .pipe(imagemin({
    //     ...giflossyOpts
    //   , ...{resize: '270x180'}
    // }))
    .pipe(imagemin(Opts))
    // .pipe(imagemin({
    //     ...gifsicleOpts
    //   , ...{resize: '270x180'}
    //   // , ...{verbose: true}
    // }))
    .pipe(extReplace('.thumb.gif'))
    .pipe(size({title: 'GIF', showFiles: false}))
    .pipe(dest(path.join(DEST, IMG, 'works')))
  ;
}

async function GIFLOSSY () {
  let Opts = {
      resize: '270x171'
    , glob: true
    , verbose: true
    , plugins: [
        giflossy(giflossyOpts)
      ]
  };
  // console.log(`${ME.d}[${C.O}IMAGEMIN${C.N}] ${C.R}GIFLOSSY OPTS${C.N}: [${utin(Opts)}]`);

  await imagemin([path.join(FROM, IMG, 'works', '*.gif')]
    , { ...Opts, destination: path.join(DEST, IMG, 'works')});
  console.log(`${ME.d}[${C.O}IMAGEMIN${C.N}] Plugin [${C.R}GIFLOSSY${C.N}]: ${C.P}GIFs optimized${C.N} in [${C.C}${path.join(DEST, IMG, 'works')}${C.N}]`);

}

async function GIFSICLE () {
  let Opts = {
      resize: '270x171'
    , glob: true
    , verbose: true
    , plugins: [
        gifsicle(gifsicleOpts)
      ]
  };

  await imagemin([path.join(FROM, IMG, 'works', '*.gif')]
    , { ...Opts, destination: path.join(DEST, IMG, 'works')});
  console.log(`${ME.d}[${C.O}IMAGEMIN${C.N}] Plugin [${C.R}GIFSICLE${C.N}]: ${C.P}GIFs optimized${C.N} in [${C.Gr}${path.join(DEST, IMG, 'works')}${C.N}]`);

}

async function WEBP () {
  // return src(path.join(FROM, IMG, '**/*.*'))
  //   .pipe(filter([
  //       '**/*.jpg'
  //     , '**/*.jpeg'
  //     , '**/*.png'
  //   ]))
  //   .pipe(vPaths(function (p) {
  //     console.log(`${ME.d}[${C.O}IMAGEMIN${C.N}] Create ${C.C}WEBP${C.N}: [${p}]`);
  //     return Promise.resolve(p);
  //   }))
  //   .pipe(imagemin([
  //     webpOpts
  //   ]))
  //   .pipe(extReplace('.webp'))
  //   // .pipe(size({title: '.WEBP'}))
  //   .pipe(dest(path.join(DEST, IMG)));

  let SrcExt = '*.{jpg,jpeg,png,ico,svg}'

  let Opts = {
      verbose: true
    , glob: true
    , plugins: [
        webp(webpOpts)
      ]
  }

  await imagemin([path.join(FROM, IMG, 'ico', SrcExt)]
  , { ...Opts, destination: path.join(DEST, IMG, 'ico') });
  console.log(`${ME.d}[${C.O}IMAGEMIN${C.N}] Created ${C.W}WEBP${C.N} in: [${C.Gr}${path.join(DEST, IMG, 'ico')}${C.N}]`);

  await imagemin([path.join(FROM, IMG, 'logos', SrcExt)]
  , { ...Opts, destination: path.join(DEST, IMG, 'logos') });
  console.log(`${ME.d}[${C.O}IMAGEMIN${C.N}] Created ${C.W}WEBP${C.N} in: [${C.Gr}${path.join(DEST, IMG, 'logos')}${C.N}]`);

  await imagemin([path.join(DEST, IMG, 'works', SrcExt)]
    , { ...Opts, destination: path.join(DEST, IMG, 'works') });
  console.log(`${ME.d}[${C.O}IMAGEMIN${C.N}] Created ${C.W}WEBP${C.N} in: [${C.Gr}${path.join(DEST, IMG, 'works')}${C.N}]`);

  await imagemin([path.join(DEST, IMG, SrcExt)]
  , { ...Opts, destination: path.join(DEST, IMG) });
  console.log(`${ME.d}[${C.O}IMAGEMIN${C.N}] Created ${C.W}WEBP${C.N} in: [${C.Gr}${path.join(DEST, IMG)}${C.N}]`);

  await imagemin([path.join(ME.SRC, SrcExt)]
  , { ...Opts, destination: path.join(ME.BUILD) });
  console.log(`${ME.d}[${C.O}IMAGEMIN${C.N}] Created ${C.W}WEBP${C.N} in: [${C.Gr}${path.join(ME.BUILD)}${C.N}]`);

}


/**
 * @_EXPOSE
 */
exports.GIFS      = GIFS;
exports.GIFLOSSY  = GIFLOSSY;
exports.GIFSICLE  = GIFSICLE;
exports.JPGS      = JPGS;
exports.PNGS      = PNGS;
exports.WEBP      = WEBP;


/**
 * @_EXPORTS
 */
exports.default = series(JPGS, PNGS, GIFSICLE, WEBP);
