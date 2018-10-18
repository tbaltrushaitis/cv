/*!
 * Project:     cv
 * File:        ./gulp-tasks/sync/src2build.js
 * Copyright(c) 2016-nowdays Baltrushaitis Tomas
 * License:     MIT
 */

'use strict';

//  ------------------------------------------------------------------------  //
//  -----------------------------  DEPENDENCIES  ---------------------------  //
//  ------------------------------------------------------------------------  //

const path = require('path');
const util = require('util');
const utin = util.inspect;

const vinylPaths = require('vinyl-paths');
const merge = require('merge-stream');
const dirSync = require('gulp-directory-sync');

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
//  -------------------------------  EXPORTS  ------------------------------  //
//  ------------------------------------------------------------------------  //

module.exports = function (gulp) {
  console.log(`[${new Date().toISOString()}][${modPath}/${modName}] with [${utin(modConfigFile)}]`);

  let IMG = path.join('assets/img');
  return  gulp.src('')
            .pipe(dirSync(
                path.join(ME.SRC, IMG)
              , path.join(ME.BUILD, IMG)
              , ME.pkg.options.sync)
            )
            .on('error', console.error.bind(console));

};
