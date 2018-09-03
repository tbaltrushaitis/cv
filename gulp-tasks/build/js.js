/*!
 * File:        ./gulp-tasks/build/js.js
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

  let DEST = path.join(ME.BUILD, 'assets/js');
  return gulp.src(path.join(ME.BUILD, 'resources/assets/js', '**/*.js'))
    //.pipe(jscs('.jscsrc'))
    //.pipe(jscs.reporter())
    // .pipe(changed(DEST))
    // .pipe(gulpif('production' === ME.NODE_ENV, uglify(ME.pkg.options.uglify), false))
    //  Write banners
    // .pipe(headfoot.header(Banner.header))
    // .pipe(headfoot.footer(Banner.footer))
    .pipe(gulp.dest(DEST));

};
