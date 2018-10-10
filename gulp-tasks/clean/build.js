/*!
 * File:        ./gulp-tasks/clean/build.js
 * Copyright(c) 2016-2017 Baltrushaitis Tomas
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
  return gulp.src([ME.BUILD]).pipe(vinylPaths(del));
};
