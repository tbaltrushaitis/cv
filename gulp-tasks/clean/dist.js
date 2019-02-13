/*!
 * Project:     cv
 * File:        ./gulp-tasks/clean/dist.js
 * Copyright(c) 2016-nowdays Baltrushaitis Tomas
 * License:     MIT
 */

'use strict';

//--------------//
// DEPENDENCIES //
//--------------//

const del        = require('del');
const vinylPaths = require('vinyl-paths');


//--------------//
//   EXPORTS    //
//--------------//

module.exports = function (gulp) {
  console.log(`LOADED: [${module.filename}]`);
  return gulp.src([ME.DIST]).pipe(vinylPaths(del));
};
