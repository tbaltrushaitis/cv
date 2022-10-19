/*!
 * Project:     cv
 * File:        ./gulp-tasks/lint.js
 * Copyright(c) 2018-nowdays Baltrushaitis Tomas <tbaltrushaitis@gmail.com>
 * License:     MIT
 */

'use strict';

//  ------------------------------------------------------------------------  //
//  -----------------------------  DEPENDENCIES  ---------------------------  //
//  ------------------------------------------------------------------------  //
const fs   = require('fs');
const path = require('path');
const utin = require('util').inspect;

const { series, parallel, src, dest } = require('gulp');

const filter     = require('gulp-filter');
const gulpif     = require('gulp-if');
const readConfig = require('read-config');
const vPaths     = require('vinyl-paths');

const jscs       = require('gulp-jscs');
const jshint     = require('gulp-jshint');


//  ------------------------------------------------------------------------  //
//  ----------------------------  CONFIGURATION  ---------------------------  //
//  ------------------------------------------------------------------------  //
let ME = Object.assign({}, globalThis.ME || {});
utin.defaultOptions = Object.assign({}, ME.pkg.options.iopts || {});

const modName       = path.basename(module.filename, '.js');
const modPath       = path.relative(ME.WD, path.dirname(module.filename));
const modConfigFile = `${path.join(ME.WD, 'config', modPath, modName)}.json`;
const modConfig     = readConfig(modConfigFile, Object.assign({}, ME.pkg.options.readconf));

ME.Config = Object.assign({}, ME.Config || {}, modConfig || {});
let C = ME.Config.colors;


//  ------------------------------------------------------------------------  //
//  -------------------------------  LINTERS  ------------------------------  //
//  ------------------------------------------------------------------------  //
let CONF = Object.assign({}, ME.Config);
let SRC  = path.join(ME.SRC);
let DEST = path.join(ME.BUILD);
let RESO = path.join('resources');

let VOID = [
    path.join(SRC, '*.*')
  , path.join(SRC, '.*')
];
let JS   = path.join('assets/js');
let CSS  = path.join('assets/css');
let DATA = path.join('data');


//--------------//
//    JSCS      //
//--------------//
function Jscs () {
  return src([
        path.join(ME.SRC, JS, '**/*.js')
      , path.join(ME.SRC, JS, '**/*.json')
    ])
    .pipe(filter([
        '**'
      , '!**/plugins/*'
    ]))
    .pipe(vPaths(function (p) {
      console.log(`${ME.d}[${C.O}${modName.toUpperCase()}${C.N}] ${C.Y}JSCS${C.N}:\t [${C.Gray}${p}${C.N}]`);
      return Promise.resolve(p);
    }))
    .pipe(jscs({configPath: 'config/.jscsrc'}))
    .pipe(jscs.reporter())
  ;
}


//--------------//
//    JSHint    //
//--------------//
function Jshint () {
  let ConfigFile = path.join(ME.CFGD, '.jshintrc');
  let Config = JSON.parse(fs.existsSync(ConfigFile)
    ? fs.readFileSync(ConfigFile)
    : {}
  );
  Config.lookup = false;

  return src([
      path.join(ME.SRC, JS, '**/*.js')
    ])
    .pipe(filter([
        '**'
      , '!**/plugins/*'
    ]))
    .pipe(vPaths(function (p) {
      console.log(`${ME.d}[${C.O}${modName.toUpperCase()}${C.N}] ${C.Y}JSHINT${C.N}:\t [${C.Gray}${p}${C.N}]`);
      return Promise.resolve(p);
    }))
    .pipe(jshint(Config))
    .pipe(gulpif(['production', ''].includes(ME.NODE_ENV)
      , jshint.reporter('jshint-stylish', {verbose: true})
      , jshint.reporter('default',        {verbose: true})
      , jshint.reporter('fail',           {verbose: true})
    ))
  ;
}


/**
 * @_EXPOSE
 */
exports.jscs    = Jscs;
exports.jshint  = Jshint;
exports.lint    = series(Jscs, Jshint);


/**
 * @_EXPORTS
 */
exports.default = series(Jscs, Jshint);
