/*!
 * File:        ./gulp-tasks/sync/src2build.js
 * Copyright(c) 2016-2017 Baltrushaitis Tomas
 * License:     MIT
 */

'use strict';

//  ------------------------------------------------------------------------  //
//  -----------------------------  DEPENDENCIES  ---------------------------  //
//  ------------------------------------------------------------------------  //

const path = require('path');
const util = require('util');

const dirSync = require('gulp-directory-sync');
const utin = util.inspect;

const modName = path.basename(module.filename, '.js');
const modPath = path.relative(global.ME.WD, path.dirname(module.filename));

const modConfigFile = `config/${path.join(modPath, modName)}.json`;
const modConfig = require('read-config')(modConfigFile);


//--------------//
//  EXPORTS     //
//--------------//

module.exports = function (gulp) {
  console.log(`[${new Date().toISOString()}][${modPath}/${modName}] INSTANCE ACTIVATED with modConfig = [${utin(modConfig)}]`);

  return  gulp.src('')
            .pipe(dirSync(
                ME.SRC
              , ME.BUILD
              , ME.pkg.options.sync)
            )
            .on('error', console.error.bind(console));

};
