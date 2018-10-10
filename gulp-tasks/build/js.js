/*!
 * File:        ./gulp-tasks/build/js.js
 * Copyright(c) 2018-nowdays Baltrushaitis Tomas
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
const changed = require('gulp-changed');
const headfoot = require('gulp-headerfooter');
const jscs = require('gulp-jscs');
const merge = require('merge-stream');
const rename = require('gulp-rename');
const uglify = require('gulp-uglify');

//--------------//
//  EXPORTS     //
//--------------//

module.exports = function (gulp) {
  console.log(`[${new Date().toISOString()}][${modPath}/${modName}] ACTIVATED with modConfig = [${utin(modConfig)}]`);

  let DEST = path.join(global.ME.BUILD, 'assets/js');
  let frontJS = gulp.src(path.join(global.ME.SRC, 'assets/js/front', '**/*.js'))
    .pipe(jscs('.jscsrc'))
    .pipe(jscs.reporter())
    // .pipe(changed(DEST))
    .pipe(gulpif('production' === global.ME.NODE_ENV, uglify(), false))
    //  Write banners
    .pipe(headfoot.header(global.ME.Banner.header))
    .pipe(headfoot.footer(global.ME.Banner.footer))
    .pipe(gulp.dest(DEST));

  return merge(frontJS);

};
