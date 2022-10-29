/*!
 * Project:     cv
 * File:        ./gulpfile.js
 * Copyright(c) 2016-present Baltrushaitis Tomas <tbaltrushaitis@gmail.com>
 * License:     MIT
 */

'use strict';

//  Reads configuration from .env file
require('dotenv').config();

//  ------------------------------------------------------------------------  //
//  -----------------------------  DEPENDENCIES  ---------------------------  //
//  ------------------------------------------------------------------------  //
const fs   = require('fs');
const path = require('path');
const utin = require('util').inspect;

const _          = require('lodash');
const argv       = require('yargs').argv;
const dateFormat = require('dateformat');
const readConfig = require('read-config');
const vPaths     = require('vinyl-paths');

const {series, parallel} = require('gulp');

const pkg = require('./package.json');


//  ------------------------------------------------------------------------  //
//  ----------------------------  CONFIGURATION  ---------------------------  //
//  ------------------------------------------------------------------------  //
let now = new Date();
let ME  = {};
globalThis.ME = ME ;

ME.WD   = path.join(__dirname);
ME.CFGD = path.join(ME.WD, 'config');

ME.pkg        = Object.assign({}, pkg || {});
ME.version    = ME.pkg.version;
ME.pkg.built  = `${dateFormat(now, 'yyyy-mm-dd')}T${dateFormat(now, 'HH:MM:ss')} ${dateFormat(now, 'Z')}`;
ME.pkg.year   = `${dateFormat(now, 'yyyy')}`;
ME.pkg.options.readconf = Object.assign({}, ME.pkg.options.readconf, {
  basedir: `${ME.CFGD}`
});
utin.defaultOptions = { ...ME.pkg.options.iopts };

ME.NODE_ENV = process.env.NODE_ENV
  ? process.env.NODE_ENV
  : argv.env
    ? argv.env
    : fs.existsSync('./NODE_ENV')
      ? fs.readFileSync('./NODE_ENV', ME.pkg.options.file).split('\n')[0].trim()
      : fs.existsSync(`${ME.CFGD}/.NODE_ENV`)
        ? fs.readFileSync(`${ME.CFGD}/.NODE_ENV`, ME.pkg.options.file).split('\n')[0].trim()
        : ME.NODE_ENV || 'test';

process.env.NODE_ENV = `${ME.NODE_ENV}`;
ME.ENV = ME.NODE_ENV;

ME.VERSION = fs.existsSync('./VERSION') ? fs.readFileSync('./VERSION', ME.pkg.options.file).trim() : ME.version;
ME.COMMIT  = fs.existsSync('./COMMIT') ? fs.readFileSync('./COMMIT', ME.pkg.options.file).trim() : 'COMMIT_UNKNOWN';

let BUILD_FILE = path.join(ME.WD, `BUILD-${ME.VERSION}`);
ME.CNTR = fs.existsSync(`${BUILD_FILE}`)
            ? fs.readFileSync(`${BUILD_FILE}`, ME.pkg.options.file).trim()
            : 'tmp';

const modsPath = path.join(ME.WD, 'modules');
const confBase = path.join(ME.CFGD, ME.NODE_ENV + '.json');

let config = readConfig(confBase, Object.assign({}, ME.pkg.options.readconf));
ME.Config = config;

let C = ME.Config.colors;
ME.L = `\n${C.W}${'-'.repeat(80)}${C.N}\n`;
ME.d = (() => {
  return `[${C.Gray}${dateFormat(Date.now(), 'HH:MM:ss')}${C.N}][${C.G}${ME.pkg.name}${C.N}:${C.Gr}${ME.VERSION}${C.N}]`;
})();

ME.DIR    = {};
ME.CURDIR = path.join(process.cwd());
ME.DOC    = path.join('docs');
ME.TMP    = path.join('tmp');
ME.SRC    = path.join('src');
ME.BUILD  = path.join(`build-${ME.VERSION}-${ME.CNTR}-${ME.ENV}`);
ME.DIST   = path.join(`dist-${ME.VERSION}-${ME.CNTR}-${ME.ENV}`);
ME.WEB    = path.join(`web-${ME.VERSION}-${ME.CNTR}-${ME.ENV}`);
ME.BOWER  = JSON.parse(fs.existsSync('.bowerrc')
  ? fs.readFileSync('.bowerrc')
  : '{"directory": "bower_modules"}'
).directory;

let headTplName = path.join(ME.CFGD, 'header.tpl');
let footTplName = path.join(ME.CFGD, 'footer.tpl');
let headTplCtx = fs.existsSync( headTplName )
                  ? fs.readFileSync( headTplName )
                  : `
/*!
 * =========================================================================== *
 * <%= pkg.name %>@<%= pkg.version %>
 * =========================================================================== *
**/
`;
let footTplCtx = fs.existsSync( footTplName )
  ? fs.readFileSync( footTplName )
  : `
/*!
 * <%= pkg.name %>@<%= pkg.version %> - <%= pkg.title %> [${dateFormat(now, 'yyyy-mm-dd')}T${dateFormat(now, 'HH:MM:ss')}Z ${dateFormat(now, 'Z')}]
 * =========================================================================== *
**/
`;

let headTpl = _.template(`${headTplCtx}`);
let footTpl = _.template(`${footTplCtx}`);

const Banner = {
    header: headTpl({pkg: ME.pkg, ME: ME})
  , footer: footTpl({pkg: ME.pkg, ME: ME})
};
ME.Banner = Banner;

console.log(`${ME.L}`);
console.log(`${ME.d} ${C.Y}ARGUMENTS${C.N} = [${utin(argv)}]`);
console.log(`${ME.d} ${C.BY}NPM_LIFECYCLE_EVENT${C.N} = [${C.Orange}${process.env.npm_lifecycle_event}${C.N}]`);
console.log(`${ME.d} ${C.Y}ME.ENV${C.N} = [${C.BR}${ME.ENV}${C.N}]`);
console.log(`${ME.d} ${C.Y}ME.NODE_ENV${C.N} = [${C.BR}${ME.NODE_ENV}${C.N}]`);
console.log(`${ME.d} ${C.Y}ME.WD${C.N} = [${C.Purple}${ME.WD}${C.N}]`);
console.log(`${ME.d} ${C.Y}ME.BUILD${C.N} = [${C.Blue}${ME.BUILD}${C.N}]`);
console.log(`${ME.d} ${C.Y}ME.DIST${C.N} = [${C.Blue}${ME.DIST}${C.N}]`);
console.log(`${ME.d} ${C.Y}ME.WEB${C.N} = [${C.Blue}${ME.WEB}${C.N}]`);
console.log(`${ME.L}`);

//  ------------------------------------------------------------------------  //
//  -------------------------------  TASKS  --------------------------------  //
//  ------------------------------------------------------------------------  //
const Tasks = require(`./gulp-tasks`);


//  ------------------------------------------------------------------------  //
//  ----------------------  DEFAULT Scenario Route  ------------------------  //
//  ------------------------------------------------------------------------  //
function defaultTask (cb) {

  console.log(`[defaultTask] CallBack(${typeof cb})`);
  console.log(`Tasks.default(${typeof Tasks.default}) =`, Tasks.default);
  console.log(`Tasks.data(${typeof Tasks.data}) =`, Tasks.data);

  //  ROUTE by ENV
  // (function () {
  //
  //   let TaskMap = {
  //       _:            'usage'
  //     , default:      'usage'
  //     , test:         'test'
  //     , dev:          'dev'
  //     , development:  'dev'
  //     , prod:         'prod'
  //     , production:   'prod'
  //     , local:        'local'
  //   }
  //   let TaskRun = TaskMap._
  //
  //   if ('string' === typeof ME.NODE_ENV) {
  //     TaskRun = TaskMap[ `${ME.NODE_ENV}` ]
  //   }
  //node -v

  //   console.log(`${ME.d} ${C.Y}Starting ${C.BW}${C.OnBlue}${TaskRun.toUpperCase()}${C.N}`)
  //   return gulp.start(`${TaskRun}`);
  //
  // })();

  Tasks.data.help();

  // console.log(`${ME.d}[${C.Y}DEFAULT${C.N}] task ${C.BW}${C.OnBlue}FINISHED${C.N}`);
  if ('function' === typeof cb) {
    cb();
  }

}


/**
 * @_EXPOSE
 */
exports.bower     = Tasks.bower;
exports.build     = Tasks.build;
exports.help      = Tasks.help;
exports.lint      = Tasks.lint;
exports.test      = Tasks.test;
exports.populate  = Tasks.populate;
exports.usage     = Tasks.usage;


/**
 * @_EXPORTS
 */
exports.default = defaultTask;

/*  EOF: ROOT/gulpfile.js  */
