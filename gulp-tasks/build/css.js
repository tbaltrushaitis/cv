/*!
 * File:        ./gulp-tasks/build/css.js
 * Copyright(c) 2016-2017 Baltrushaitis Tomas
 * License:     MIT
 */

'use strict';

//  ------------------------------------------------------------------------  //
//  -----------------------------  DEPENDENCIES  ---------------------------  //
//  ------------------------------------------------------------------------  //

const path = require('path');
const util = require('util');

const utin = util.inspect;

const modName = path.basename(module.filename, '.js');
const modPath = path.relative(global.ME.WD, path.dirname(module.filename));

const modConfigFile = `config/${path.join(modPath, modName)}.json`;
const modConfig = require('read-config')(modConfigFile);

const gulpif = require('gulp-if');
const cleanCSS = require('gulp-clean-css');
const concatCSS = require('gulp-concat-css');
const minifyCSS = require('gulp-minify-css');
const headfoot = require('gulp-headerfooter');
const merge = require('merge-stream');
const rename = require('gulp-rename');

//--------------//
//  EXPORTS     //
//--------------//

module.exports = function (gulp) {
  console.log(`LOADED: [${module.filename}]`);

  //  BUNDLE CSS and JS
  let DEST = path.join(ME.BUILD, 'assets/css');
  let FROM = path.join(ME.BUILD, 'resources/assets/css');

  let frontCSS = gulp.src([
      path.join(FROM, '*.css')
    ])
    .pipe(gulpif('production' === ME.NODE_ENV, cleanCSS(ME.pkg.options.clean, function (d) {
      console.info(d.name + ': ' + d.stats.originalSize + ' -> ' + d.stats.minifiedSize + ' [' + d.stats.timeSpent + 'ms] [' + 100 * d.stats.efficiency.toFixed(2) + '%]');
    }), false))
    .pipe(concatCSS('frontend-bundle.css', {rebaseUrls: true}))
    .pipe(minifyCSS())
    //  Write banners
    .pipe(headfoot.header(ME.Banner.header))
    .pipe(headfoot.footer(ME.Banner.footer))
    .pipe(gulpif('production' === ME.NODE_ENV, rename({suffix: ME.pkg.options.minify.suffix})))
    .pipe(gulp.dest(DEST));

  return merge(frontCSS);

};
