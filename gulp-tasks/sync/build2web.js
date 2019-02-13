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

const dirSync = require('gulp-directory-sync');
const vinylPaths = require('vinyl-paths');
const merge = require('merge-stream');
const gulpif = require('gulp-if');
const livereload = require('gulp-livereload');
const htmlmin = require('gulp-htmlmin');

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
//  ------------------------------  FUNCTIONS  -----------------------------  //
//  ------------------------------------------------------------------------  //

const build2web = function (gulp) {
  console.log(`[${new Date().toISOString()}][${modPath}/${modName}] with [${utin(modConfigFile)}]`);
  if ('dev' === ME.NODE_ENV || 'development' === ME.NODE_ENV) {
    livereload.listen(ME.pkg.options.livereload);
  }

  let wFiles =  gulp.src([
                    path.join(ME.BUILD, 'index.html')
                  , path.join(ME.BUILD, 'robots.txt')
                ])
                .pipe(gulpif('production' === ME.NODE_ENV, htmlmin(ME.pkg.options.htmlmin)))
                .pipe(gulp.dest(ME.WEB))
                // .pipe(gulpif('dev' === ME.NODE_ENV, livereload()))
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

  // return merge(wAssets, wData, wFiles);
  return merge(wAssets, wData, wFiles)
          .pipe(gulpif('dev' === ME.NODE_ENV, livereload()))
          .on('error', console.error.bind(console));

};


/**
 * EXPOSE
 * @public
 */

module.exports = exports = build2web;
