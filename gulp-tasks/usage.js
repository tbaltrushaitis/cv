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
let L = `\n${C.White}${(new Array(80).join('-'))}${C.NC}\n`;

//  ------------------------------------------------------------------------  //
//  ------------------------------  FUNCTIONS  -----------------------------  //
//  ------------------------------------------------------------------------  //

const usage = function (gulp) {
  console.log(`${L}[${new Date().toISOString()}][${C.Yellow}${modPath}/${modName}${C.NC}] with [${modConfigFile}]`);

  console.log(`${L}
${C.Cyan}Usage${C.NC}:
    ${C.BYellow}gulp${C.NC} <${C.Purple}task${C.NC}> \t - \t Run gulp task(s) specified

  , where ${C.Purple}task${C.NC} is one of:

    ${C.Yellow}usage${C.NC} \t\t - \t Show this topic
    show:config \t - \t Show Configuration file
    show:src \t\t - \t Log File Paths in the Stream

    clean \t\t - \t Empty given folders and Delete files
    clean:build \t - \t Clean directory with current BUILD
    clean:dist \t\t - \t Distro files
    clean:resources \t - \t Static CSS, JS and Images
    clean:public \t - \t Directory visible from Internet
${L}`);

  return Promise.resolve();
};


/**
 * EXPOSE
 * @public
 */

module.exports = exports = usage;
