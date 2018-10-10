/*!
 * File:        ./gulp-tasks/sync/build2dist.js
 * Copyright(c) 2016-2018 Baltrushaitis Tomas
 * License:     MIT
 */

'use strict';

//--------------//
// DEPENDENCIES //
//--------------//

const path = require('path');
const util = require('util');

const dirSync = require('gulp-directory-sync');
const changed = require('gulp-changed');

const utin = util.inspect;

const modName = path.basename(module.filename, '.js');
const modPath = path.relative(global.ME.WD, path.dirname(module.filename));

const modConfigFile = `config/${path.join(modPath, modName)}.json`;
const modConfig = require('read-config')(modConfigFile);


//--------------//
//  EXPORTS     //
//--------------//

module.exports = function (gulp) {
  console.log(`LOADED: [${module.filename}]`);

  return  gulp.src('')
            .pipe(dirSync(ME.BUILD, ME.DIST, ME.pkg.options.sync))
            .on('error', console.error.bind(console));

};
