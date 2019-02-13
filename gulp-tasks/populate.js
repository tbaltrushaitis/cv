/*!
 * Project:     cv
 * File:        ./gulp-tasks/populate.js
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

const readConfig = require('read-config');
const vinylPaths = require('vinyl-paths');
const gulpif     = require('gulp-if');
const headfoot   = require('gulp-headerfooter');
const merge      = require('merge-stream');
const replace    = require('gulp-token-replace');


//  ------------------------------------------------------------------------  //
//  ----------------------------  CONFIGURATION  ---------------------------  //
//  ------------------------------------------------------------------------  //

let ME = Object.assign({}, global.ME || {});
utin.defaultOptions = Object.assign({}, ME.pkg.options.iopts || {});

const modName = path.basename(module.filename, '.js');
const modPath = path.relative(ME.WD, path.dirname(module.filename));
const modConfigFile = `${path.join(ME.WD, 'config', modPath, modName)}.json`;
const modConfig = readConfig(modConfigFile, Object.assign({}, ME.pkg.options.readconf));

ME.Config = Object.assign({}, ME.Config || {}, modConfig || {});


//  ------------------------------------------------------------------------  //
//  ------------------------------  FUNCTIONS  -----------------------------  //
//  ------------------------------------------------------------------------  //

const populate = function (gulp) {
  console.log(`[${new Date().toISOString()}][${modPath}/${modName}] with [${utin(modConfigFile)}]`);

  let CONF = Object.assign({}, ME.Config); // require('./config/person.json'); // ME.Config
  let SRC = path.join(ME.SRC);
  let DEST = path.join(ME.BUILD);
  let RESO = path.join('resources');

  let Void = [
      path.join(SRC, '*.html')
    , path.join(SRC, '*.txt')
  ];
  let JS = path.join('assets/js');
  let CSS = path.join('assets/css');
  let DATA = path.join('data');


  //--------------//
  // STATIC FILES //
  //--------------//
  let srcVoid = gulp.src(Void)
    .pipe(vinylPaths(function (paths) {
      console.log(`[${new Date().toISOString()}][${modName.toUpperCase()}] STATIC: \t ${paths}`);
      return Promise.resolve(paths);
    }))
    .pipe(replace({global: CONF}))
    .pipe(gulp.dest(path.resolve(DEST)));


  //--------------//
  // JAVASCRIPTS //
  //--------------//
  let srcJS = gulp.src([
        path.join(SRC, JS, '**/*.js')
    ])
    .pipe(vinylPaths(function (paths) {
      console.log(`[${new Date().toISOString()}][${modName.toUpperCase()}] JS: \t ${paths}`);
      return Promise.resolve(paths);
    }))
    .pipe(replace({global: CONF}))
    .pipe(gulp.dest(path.resolve(DEST, RESO, JS)));


  //--------------//
  //    DATA      //
  //--------------//
  let srcData = gulp.src([
      path.join(SRC, DATA, '**/*.*')
    ])
    .pipe(vinylPaths(function (paths) {
      console.log(`[${new Date().toISOString()}][${modName.toUpperCase()}] DATA: \t ${paths}`);
      return Promise.resolve(paths);
    }))
    .pipe(gulp.dest(path.resolve(DEST, DATA)));

  return merge(srcVoid, srcJS, srcData);

};


/**
 * EXPOSE
 * @public
 */

module.exports = exports = populate;
