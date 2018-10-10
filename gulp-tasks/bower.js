/*!
 * File:        ./gulp-tasks/bower.js
 * Copyright(c) 2018-nowdays Baltrushaitis Tomas
 * License:     MIT
 */

'use strict';

//--------------//
// DEPENDENCIES //
//--------------//

const _ = require('lodash');

const fs    = require('fs');
// const del   = require('del');
const path  = require('path');
const util  = require('util');
const utin  = util.inspect;

// const argv           = require('yargs').argv;
// const parseArgs      = require('minimist');
const vinylPaths     = require('vinyl-paths');
// const dateFormat     = require('dateformat');
const mainBowerFiles = require('main-bower-files');

const changed   = require('gulp-changed');
// const concat    = require('gulp-concat');
const concatCSS = require('gulp-concat-css');
const cleanCSS  = require('gulp-clean-css');
const filter    = require('gulp-filter');
const gulpif    = require('gulp-if');
const headfoot  = require('gulp-headerfooter');
// const rename    = require('gulp-rename');
const uglify    = require('gulp-uglify');

// const merge = require('merge-stream');

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

  const gulpSequence = require('gulp-sequence').use(gulp);

  //  BOWER - responsible for FrontEnd assets
  let mBower = mainBowerFiles(global.ME.pkg.options.bower, {
      base:   ME.BOWER
    , group:  ['front']
  });

  let DEST = path.join(global.ME.BUILD, 'assets');
  let KEEP = path.join(global.ME.BUILD, 'resources/assets');
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
    .pipe(gulp.dest(path.resolve(KEEP, JS)))
    .pipe(vinylPaths(function (paths) {
      console.info('BOWER JS: ', paths);
      return Promise.resolve(paths);
    }))
    .pipe(gulpif('production' === ME.NODE_ENV, uglify()))
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
    .pipe(gulp.dest(path.resolve(KEEP, CSS)))
    .pipe(gulpif('production' === ME.NODE_ENV, cleanCSS(function (d) {
      console.info(d.name + ':\t' + d.stats.originalSize + '\t->\t' + d.stats.minifiedSize + '\t[' + d.stats.timeSpent + 'ms]\t[' + 100 * d.stats.efficiency.toFixed(2) + '%]');
    }), false))
    .pipe(concatCSS('bower-bundle.css', {rebaseUrls: false}))
    //  Write banners
    .pipe(headfoot.header(ME.Banner.header))
    .pipe(headfoot.footer(ME.Banner.footer))
    .pipe(gulp.dest(path.resolve(DEST, CSS)));

  let bowerFonts = gulp.src(mBower)
    .pipe(filter(['**/fonts/*.*']))
    .pipe(changed(path.resolve(KEEP, FONT)))
    .pipe(gulp.dest(path.resolve(KEEP, FONT)))
    .pipe(vinylPaths(function (paths) {
      console.info('BOWER FONT:', paths);
      return Promise.resolve(paths);
    }))
    .pipe(gulp.dest(path.resolve(DEST, FONT)));

  let webFonts = gulp.src(mBower)
    .pipe(filter(['**/webfonts/*.*']))
    .pipe(changed(path.resolve(KEEP, WEBFONT)))
    .pipe(gulp.dest(path.resolve(KEEP, WEBFONT)))
    .pipe(vinylPaths(function (paths) {
      console.info('BOWER WEBFONT:', paths);
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
    .pipe(gulp.dest(path.join(KEEP, IMG)))
    .pipe(vinylPaths(function (paths) {
      console.info('BOWER IMG:', paths);
      return Promise.resolve(paths);
    }))
    .pipe(gulp.dest(path.join(DEST, IMG)));

  return gulpSequence(bowerJS, bowerCSS, bowerFonts, webFonts, bowerImg);

};
