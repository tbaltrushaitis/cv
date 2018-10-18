/*!
 * Project:     cv
 * File:        ./gulp-tasks/sync/build2web.js
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
const dirSync = require('gulp-directory-sync');
const changed = require('gulp-changed');
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
//  -------------------------------  EXPOSE  -------------------------------  //
//  ------------------------------------------------------------------------  //

module.exports = function (gulp) {
  console.log(`[${new Date().toISOString()}][${modPath}/${modName}] with [${utin(modConfigFile)}]`);

  let wFiles =  gulp.src([
                    path.join(ME.BUILD, 'index.html')
                  , path.join(ME.BUILD, 'robots.txt')
                ])
                .pipe(gulp.dest(ME.WEB))
                .on('error', console.error.bind(console));

  let wAssets = gulp.src('')
                  .pipe(dirSync(
                      path.join(ME.BUILD, 'assets')
                    , path.join(ME.WEB, 'assets')
                    , ME.pkg.options.sync
                  ))
                  .on('error', console.error.bind(console));

  let wData = gulp.src('')
                  .pipe(dirSync(
                      path.join(ME.BUILD, 'data')
                    , path.join(ME.WEB, 'data')
                    , ME.pkg.options.sync
                  ))
                  .on('error', console.error.bind(console));

  return merge(wFiles, wAssets, wData);

};
