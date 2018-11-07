/*!
 * File:        ./gulp-tasks/usage.js
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


//  ------------------------------------------------------------------------  //
//  --------------------------------  EXPOSE  ------------------------------  //
//  ------------------------------------------------------------------------  //

module.exports = function (gulp) {
  console.log(`[${new Date().toISOString()}][${modPath}/${modName}] with [${utin(modConfigFile)}]`);
  let C = ME.Config.colors;
  let L = `\n${C.White}${(new Array(50).join('-'))}${C.NC}`;

  console.log(L);
  console.log(`\n${C.Cyan}Usage${C.NC}:`);
  console.log(`\t${C.BYellow}gulp ${C.Purple}<task>${C.NC}\t-\tRun gulp task(s) specified`);
  console.log(`\n, where ${C.Purple}<task>${C.NC} is one of:\n`);
  console.log(`\t${C.Yellow}usage${C.NC} \t\t - Show this topic`);
  console.log(`\tshow:config \t - Show Configuration file`);
  console.log(`\tshow:src \t - Log File Paths in the Stream`);
  console.log(`\n\tclean \t\t - Empty given folders and Delete files`);
  console.log(`\tclean:build \t - Clean directory with BUILD`);
  console.log(`\tclean:dist \t - Distro files`);
  console.log(`\tclean:resources  - Static CSS, JS and Images`);
  console.log(`\tclean:public \t - Directory visible from Internet`);
  console.log(L);

  return Promise.resolve();
};
