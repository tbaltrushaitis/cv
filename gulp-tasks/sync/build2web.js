/*!
 * File:        ./gulp-tasks/sync/build2web.js
 * Copyright(c) 2016-2017 Baltrushaitis Tomas
 * License:     MIT
 */

'use strict';

//--------------//
// DEPENDENCIES //
//--------------//

const path = require('path');
const util = require('util');

const merge   = require('merge-stream');
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
  console.log(`[${new Date().toISOString()}][${modPath}/${modName}] INSTANCE ACTIVATED with modConfig = [${utin(modConfig)}]`);

  let wFiles =  gulp.src([
                    path.join(ME.BUILD, 'index.html')
                  , path.join(ME.BUILD, 'robots.txt')
                ])
                .pipe(changed(ME.WEB))
                .pipe(gulp.dest(ME.WEB))
                .on('error', console.error.bind(console));

  let wAssets = gulp.src('')
                  .pipe(dirSync(
                      path.join(ME.BUILD, 'assets')
                    , path.join(ME.WEB, 'assets')
                    , ME.pkg.options.sync
                  ))
                  .on('error', console.error.bind(console));

  return merge(wFiles, wAssets);
};
