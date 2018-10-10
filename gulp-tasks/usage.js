/*!
 * File:        ./gulp-tasks/usage.js
 * Copyright(c) 2018-nowdays Baltrushaitis Tomas
 * License:     MIT
 */

'use strict';

//--------------//
// DEPENDENCIES //
//--------------//

const _ = require('lodash');

const path  = require('path');
const util  = require('util');
const utin  = util.inspect;

//---------------//
// CONFIGURATION //
//---------------//

const modName = path.basename(module.filename, '.js');
const modPath = path.relative(global.ME.WD, path.dirname(module.filename));

const modConfigFile = `config/${path.join(modPath, modName)}.json`;
const modConfig = require('read-config')(modConfigFile);


//--------------//
//  EXPOSE      //
//--------------//

module.exports = function (gulp) {
  console.log(`[${new Date().toISOString()}][${modPath}/${modName}] ACTIVATED with modConfig = [${utin(modConfig)}]`);

  console.log('\n' + (new Array(50).join('-')));
  console.info('\nUsage:\n\t gulp <task>\t-\tRun gulp task(s) specified');
  console.info('\nwhere <task> is one of:\n');
  console.warn('\tusage' + '\t\t', 'Show this topic');
  console.warn('\tshow:config' + '\t', 'Show Configuration file');
  console.warn('\tshow:src' + '\t', 'Log File Paths in the Stream');
  console.warn('\n\tclean' + '\t\t', 'Empty given folders and Delete files');
  console.warn('\tclean:build' + '\t', 'Clean directory with BUILD');
  console.warn('\tclean:dist' + '\t', 'Distro files');
  console.warn('\tclean:resources' + '\t', 'Static CSS, JS and Images');
  console.warn('\tclean:public' + '\t', 'Directory visible from Internet');
  console.log('\n' + (new Array(50).join('-')) + '\n');

  return Promise.resolve();
};
