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

const dirSync = require('gulp-directory-sync');
const vinylPaths = require('vinyl-paths');
const merge = require('merge-stream');

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
//  -----------------------------  FUNCTIONS  ------------------------------  //
//  ------------------------------------------------------------------------  //

const src2build = function (gulp) {
  console.log(`[${new Date().toISOString()}][${modPath}/${modName}] with [${utin(modConfigFile)}]`);

  let IMG = path.join('assets/img');
  let wImg = gulp.src('')
            .pipe(dirSync(
                path.join(ME.SRC, IMG)
              , path.join(ME.BUILD, IMG)
              , ME.pkg.options.sync
            ))
            .on('error', console.error.bind(console));

  return merge(wImg)
          .on('error', console.error.bind(console));
};


/**
 * EXPOSE
 * @public
 */

module.exports = exports = src2build;
