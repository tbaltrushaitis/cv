/*!
 * Project:     cv
 * File:        ./gulp-tasks/usage.js
 * Copyright(c) 2018-nowdays Baltrushaitis Tomas <tbaltrushaitis@gmail.com>
 * License:     MIT
 */

'use strict';

//  ------------------------------------------------------------------------  //
//  -----------------------------  DEPENDENCIES  ---------------------------  //
//  ------------------------------------------------------------------------  //
const path = require('path');
const utin = require('util').inspect;

const { series, parallel, src, dest } = require('gulp');

const readConfig = require('read-config');


//  ------------------------------------------------------------------------  //
//  ----------------------------  CONFIGURATION  ---------------------------  //
//  ------------------------------------------------------------------------  //
let ME = Object.assign({}, globalThis.ME || {});
utin.defaultOptions = Object.assign({}, ME.pkg.options.iopts || {});

const modName       = path.basename(module.filename, '.js');
const modPath       = path.relative(ME.WD, path.dirname(module.filename));
const modConfigFile = `${path.join(ME.WD, 'config', modPath, modName)}.json`;
const modConfig     = readConfig(modConfigFile, Object.assign({}, ME.pkg.options.readconf || {}));

ME.Config = Object.assign({}, ME.Config || {}, modConfig || {});
let C = ME.Config.colors;


//  ------------------------------------------------------------------------  //
//  ------------------------------  FUNCTIONS  -----------------------------  //
//  ------------------------------------------------------------------------  //
function usageTask (cb) {
  console.log(`${ME.L}${ME.d}[${C.O}${modPath}/${modName}${C.N}] with [${C.Blue}${modConfigFile}${C.N}]`);

  console.log(`
${ME.L}${C.O}Usage${C.N}:
    ${C.BW}gulp${C.N} <${C.C}task${C.N}> \t - Run gulp task(s) specified

  , where ${C.C}task${C.N} is one of:

    ${C.Y}usage${C.N} \t\t - Show help topic
    show:config \t - Show Configuration file
    show:src \t\t - Log File Paths in the Stream

    clean \t\t - Empty given folders and Delete files
    clean:build \t - Clean directory with current BUILD
    clean:dist \t\t - Distro files
    clean:resources \t - Static CSS, JS and Images
    clean:public \t - Directory visible from Internet
${ME.L}
  `);

  if ('function' === typeof cb) {
    cb();
  }

};


//
//  Print configuration
//
function showConfig (cb) {

  console.log(`${ME.L}`);
  console.log(`ME.Config = [${utin(ME.Config)}]`);
  console.log(`${ME.L}`);

  if ('function' === typeof cb) {
    cb();      //  SYNCH
    // return cb();  //  ASYNC
  }
};


/**
 * @_EXPOSE
 */
exports.usage   = usageTask;
exports.config  = showConfig;


/**
 * @_EXPORTS
 */
exports.default = series(showConfig, usageTask);
