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

const readConfig = require('read-config');

//  ------------------------------------------------------------------------  //
//  ----------------------------  CONFIGURATION  ---------------------------  //
//  ------------------------------------------------------------------------  //

let ME = Object.assign({}, global.ME || {});
utin.defaultOptions = Object.assign({}, ME.pkg.options.iopts || {});

const modName = path.basename(module.filename, '.js');
const modPath = path.relative(ME.WD, path.dirname(module.filename));
const modConfigFile = `${path.join(ME.WD, 'config', modPath, modName)}.json`;
const modConfig = readConfig(modConfigFile, Object.assign({}, ME.pkg.options.readconf || {}));

ME.Config = Object.assign({}, ME.Config || {}, modConfig || {});
let C = ME.Config.colors;

//  ------------------------------------------------------------------------  //
//  ------------------------------  FUNCTIONS  -----------------------------  //
//  ------------------------------------------------------------------------  //

const usage = function (gulp) {
  console.log(`${ME.L}${ME.d}[${C.O}${modPath}/${modName}${C.N}] with [${C.Blue}${modConfigFile}${C.N}]`);

  console.log(`
${ME.L}
${C.C}Usage${C.N}:
    ${C.BY}gulp${C.N} <${C.P}task${C.N}> \t - \t Run gulp task(s) specified

  , where ${C.P}task${C.N} is one of:

    ${C.Y}usage${C.N} \t\t - \t Show this topic
    show:config \t - \t Show Configuration file
    show:src \t\t - \t Log File Paths in the Stream

    clean \t\t - \t Empty given folders and Delete files
    clean:build \t - \t Clean directory with current BUILD
    clean:dist \t\t - \t Distro files
    clean:resources \t - \t Static CSS, JS and Images
    clean:public \t - \t Directory visible from Internet
${ME.L}
  `);

  return Promise.resolve();
};

/**
 * @_EXPOSE
 */
exports = usage;


/**
 * @_EXPORTS
 */
module.exports = exports;
