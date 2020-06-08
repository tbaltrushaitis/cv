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

const gulp         = require('gulp');
const gulpTasks    = require('gulp-require-tasks');
const gulpSequence = require('gulp-sequence').use(gulp);
const changed      = require('gulp-changed');
const gulpif       = require('gulp-if');
const jscs         = require('gulp-jscs');
const jshint       = require('gulp-jshint');
const livereload   = require('gulp-livereload');

const pkg = require('./package.json');

//  ------------------------------------------------------------------------  //
//  ----------------------------  CONFIGURATION  ---------------------------  //
//  ------------------------------------------------------------------------  //

let now = new Date();
let ME = global.ME = {};
ME.WD  = path.join(__dirname);

ME.pkg = Object.assign({}, pkg || {});
ME.version = ME.pkg.version;
ME.pkg.built = `${dateFormat(now, 'yyyy-mm-dd')}T${dateFormat(now, 'HH:MM:ss')} ${dateFormat(now, 'Z')}`;
ME.pkg.year = `${dateFormat(now, 'yyyy')}`;
ME.pkg.options.readconf = Object.assign({}, ME.pkg.options.readconf, {
  basedir: path.join(ME.WD, 'config')
});
utin.defaultOptions = Object.assign({}, ME.pkg.options.iopts);

ME.NODE_ENV = process.env.NODE_ENV
  ? process.env.NODE_ENV
  : argv.env
    ? argv.env
    : fs.existsSync('./NODE_ENV')
      ? fs.readFileSync('./NODE_ENV', ME.pkg.options.file).split('\n')[0].trim()
      : fs.existsSync('config/.NODE_ENV')
        ? fs.readFileSync('config/.NODE_ENV', ME.pkg.options.file).split('\n')[0].trim()
        : ME.NODE_ENV || 'test';

process.env.NODE_ENV = `${ME.NODE_ENV}`;

ME.VERSION = fs.existsSync('./VERSION') ? fs.readFileSync('./VERSION', ME.pkg.options.file).trim() : ME.version;
ME.COMMIT  = fs.existsSync('./COMMIT') ? fs.readFileSync('./COMMIT', ME.pkg.options.file).trim() : 'COMMIT_UNKNOWN';

var BUILD_FILE = path.join(ME.WD, `BUILD-${ME.VERSION}`);
ME.CNTR = fs.existsSync(`${BUILD_FILE}`)
            ? fs.readFileSync(`${BUILD_FILE}`, ME.pkg.options.file).trim()
            : 'tmp';

const modsPath = path.join(ME.WD, 'modules');
const confBase = path.join(ME.WD, 'config', ME.NODE_ENV + '.json');

let config = readConfig(confBase, Object.assign({}, ME.pkg.options.readconf));
ME.Config = config;

let C = ME.Config.colors;
ME.L = `\n${C.W}${(new Array(80).join('-'))}${C.N}\n`;
ME.d = (() => {
  return `[${C.Gray}${dateFormat(Date.now(), 'HH:MM:ss')}${C.N}][${C.Blue}${ME.pkg.name}${C.N}:${C.BC}${ME.VERSION}${C.N}]`;
})();

ME.DIR    = {};
ME.CURDIR = path.join(process.cwd());
ME.DOC    = path.join('docs');
ME.TMP    = path.join('tmp');
ME.SRC    = path.join('src');
ME.DIST   = path.join(`dist-${ME.VERSION}`);
ME.BUILD  = path.join(`build-${ME.VERSION}`);
ME.WEB    = path.join(`web-${ME.VERSION}-${ME.CNTR}`);
ME.BOWER  = JSON.parse(fs.existsSync('.bowerrc')
  ? fs.readFileSync('.bowerrc')
  : '{"directory": "bower_modules"}'
).directory;

let headTplName = path.join(ME.WD, 'config', 'header.tpl');
let footTplName = path.join(ME.WD, 'config', 'footer.tpl');
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
console.log(`${ME.d} ${C.BY}NPM_LIFECYCLE_EVENT${C.N} = [${C.BR}${process.env.npm_lifecycle_event}${C.N}]`);
console.log(`${ME.d} ${C.BY}NODE_ENV${C.N} = [${C.BR}${ME.NODE_ENV}${C.N}]`);
console.log(`${ME.L}`);

//  ------------------------------------------------------------------------  //
//  -------------------------------  TASKS  --------------------------------  //
//  ------------------------------------------------------------------------  //

gulpTasks({
    path:      process.cwd() + '/gulp-tasks'
  , separator: ':'
  , passGulp:  true
});


//  ------------------------------------------------------------------------  //
//  ----------------------  DEFAULT Scenario Route  ------------------------  //
//  ------------------------------------------------------------------------  //

function defaultTask (cb) {

  //  ROUTE by ENV
  (function () {

    let TaskMap = {
        _:            'usage'
      , default:      'usage'
      , test:         'test'
      , dev:          'dev'
      , development:  'dev'
      , prod:         'prod'
      , production:   'prod'
      , local:        'local'
    }
    let TaskRun = TaskMap._

    if ('string' === typeof ME.NODE_ENV) {
      TaskRun = TaskMap[ `${ME.NODE_ENV}` ]
    }

    console.log(`${ME.d} ${C.Y}Starting ${C.BW}${C.OnBlue}${TaskRun.toUpperCase()}${C.N}`)
    return gulp.start(`${TaskRun}`);

  })();

  if ('function' === typeof cb) {
    cb();
  }

}


gulp.task('default', [], (cb) => {

  defaultTask();
  console.log(`${ME.d}[${C.Y}DEFAULT${C.N}] ${C.BW}${C.OnBlue}FINISHED${C.N}`);

  if ('function' === typeof cb) {
    cb();
  }

});


gulp.task('lint', [
        'jscs'
      , 'jshint'
    ]
  , (cb) => {
      console.log(`${ME.d}[${C.Y}LINT${C.N}] ${C.BW}${C.OnBlue}FINISHED${C.N}`);
      if ('function' === typeof cb) {
        return cb();
      }else{
        return Promise.resolve();
      }
    }
);


gulp.task('test', [
        'show:env'
      // , 'show:config'
      , 'lint'
    ]
  , (cb) => {
    console.log(`${ME.d}[${C.Y}TEST${C.N}] ${C.BW}${C.OnBlue}FINISHED${C.N}`);
    if ('function' === typeof cb) {
      return cb();
    }else{
      return Promise.resolve();
    }
  }
);


gulp.task('build:assets', [
      'build:css'
    , 'build:js'
    , 'build:img'
  ], (cb) => {
    console.log(`${ME.d}[${C.O}BUILD${C.N}:${C.W}ASSETS${C.N}] ${C.BW}${C.OnBlue}FINISHED${C.N}`);
    if ('function' === typeof cb) {
      return cb();
    }else{
      return Promise.resolve();
    }
  }
);


gulp.task('build:assets:fast', [
      'build:css'
    , 'build:js'
  ], (cb) => {
    console.log(`${ME.d}[${C.Y}BUILD:ASSETS:FAST${C.N}] ${C.BW}${C.OnBlue}FINISHED${C.N}`);
    if ('function' === typeof cb) {
      return cb();
    }else{
      return Promise.resolve();
    }
  }
);


gulp.task('dev', [
    'build:dev'
  ], (cb) => {
    gulp.start('watch');
    console.log(`${ME.d}[${C.Y}DEV${C.N}] ${C.BW}${C.OnBlue}FINISHED${C.N}`);
    if ('function' === typeof cb) {
      return cb();
    }else{
      return Promise.resolve();
    }
  }
);


gulp.task('prod', [
    'build'
  ], (cb) => {
    gulp.start('deploy');
    console.log(`${ME.d}[${C.Y}PROD${C.N}] ${C.BW}${C.OnBlue}FINISHED${C.N}`);
    if ('function' === typeof cb) {
      return cb();
    }else{
      return Promise.resolve();
    }
  }
);


gulp.task('build:dev', [
      'bower'
    , 'sync:src2build'
  ]
  , (cb) => {
    // gulpSequence(['build:assets', 'deploy'])((err) => {
    gulpSequence('build:assets')((err) => {
      if (err) {
        console.log(`${ME.d}[${C.Y}BUILD:DEV${C.N}] ${C.BR}ERROR${C.N}: [${utin(err)}]`);
        return Promise.reject(1);
      }
      console.log(`${ME.d}[${C.Y}BUILD:DEV${C.N}] ${C.BW}${C.OnBlue}FINISHED${C.N}`);
    });
    if ('function' === typeof cb) {
      return cb();
    }else{
      return Promise.resolve();
    }
  }
);


gulp.task('build', [
//    'bower'
//  , 'sync:src2build'
      'build:assets'
    ]
  , (cb) => {
    console.log(`${ME.d}[${C.O}BUILD${C.N}] ${C.Y}${C.OnG}FINISHED${C.N}`);
    if ('function' === typeof cb) {
      return cb();
    }else{
      return Promise.resolve();
    }
  }
);


gulp.task('build:fast', [
    // 'sync:src2build'
    'build:assets:fast'
  ]
  , (cb) => {
    console.log(`${ME.d}[${C.Y}BUILD:FAST${C.N}] ${C.BW}${C.OnBlue}FINISHED${C.N}`);
    if ('function' === typeof cb) {
      return cb();
    }else{
      return Promise.resolve();
    }
  }
);


gulp.task('deploy', [
    // 'dist'
    'sync:dist2web'
  ]
  , (cb) => {
    console.log(`${ME.d}[${C.Y}DEPLOY${C.N}] ${C.BW}${C.OnBlue}FINISHED${C.N}`);

    if ('function' === typeof cb) {
      return cb();
    }else{
      return Promise.resolve();
    }
  }
);


// gulp.task('critical', ['build'], (cb) => {
//
//   critical.generate({
//     inline: true,
//     base:   `${ME.BUILD}/`,
//     src:    'index.html',
//     dest:   `${ME.DIST}/index-critical.html`,
//     minify:  false,
//     width:   320,
//     height:  480
//   });
//
//   console.log(`${ME.d}[${C.Y}CRITICAL${C.N}] ${C.BW}${C.OnBlue}FINISHED${C.N}`);
//
// });


//--------------//
//   WATCHERS   //
//--------------//

gulp.task('watch', [], (cb) => {

  livereload.listen({
      ...ME.pkg.options.livereload
    , basePath:   'webroot'
    , reloadPage: 'index.html'
  });

  gulp.start('watch:src');
  console.log(`${ME.d}[${C.Y}WATCH${C.N}] ${C.BW}${C.OnBlue}FINISHED${C.N}`);
  if ('function' === typeof cb) {
    return cb();
  }else{
    return Promise.resolve();
  }
});

gulp.task('watch:src', [
      'watch:src:default'
    , 'watch:src:configs'
    , 'watch:src:css'
    , 'watch:src:js'
  ]
  , (cb) => {
    console.log(`${ME.d}[${C.Y}WATCH:SRC${C.N}] ${C.BW}${C.OnBlue}FINISHED${C.N}`);
    if ('function' === typeof cb) {
      return cb();
    }else{
      return Promise.resolve();
    }
  }
);

gulp.task('watch:src:default', function () {
  let wSRC = gulp.watch([
        path.join(ME.SRC, '**/*.html')
      , path.join(ME.SRC, '**/*.txt')
    ]
  , ME.pkg.options.watch
  , function () {
    gulpSequence('populate', 'sync:src2build', 'build:fast', 'sync:build2dist', 'deploy')((err) => {
      if (err) {
        console.log(`${ME.d}[${C.Y}WATCH:SRC:DEFAULT${C.N}] ${C.BR}ERROR${C.N}: [${utin(err)}]`);
        return Promise.reject(1);
      };
      console.log(`${ME.d}[${C.Y}WATCH:SRC:DEFAULT${C.N}] ${C.BW}${C.OnBlue}FINISHED${C.N}`);
    });
  });
  wSRC.on('change', function (e) {
    console.log(`${ME.d}[${C.W}WATCH:SRC:DEFAULT${C.N}] FILE [${C.P}${e.path}${C.N}] was [${C.OnBlue}${e.type}${C.N}], running tasks ...`);
  });
});


gulp.task('watch:src:configs', function () {
  let wCONF = gulp.watch([
        path.join(ME.WD, 'config', '**/*.*')
      , path.join(ME.WD, 'data', '**/*.json')
    ]
  , ME.pkg.options.watch
  , function () {
    gulpSequence('populate', 'build:fast', 'deploy')((err) => {
      if (err) {
        console.log(`${ME.d}[${C.Y}WATCH:SRC:CONFIGS${C.N}] ${C.BR}ERROR${C.N}: [${utin(err)}]`);
        return Promise.reject(1);
      }
      console.log(`${ME.d}[${C.Y}WATCH:SRC:CONFIGS${C.N}] ${C.BW}${C.OnBlue}FINISHED${C.N}`);
    });
  });
  wCONF.on('change', function (e) {
    console.log(`${ME.d}[${C.W}WATCH:SRC${C.N}] CONFIG [${C.P}${e.path}${C.N}] was [${C.W}${e.type}${C.N}], running tasks ...`);
  });
});


gulp.task('watch:src:css', function () {
  let wCSS = gulp.watch([
        path.join(ME.SRC, 'assets/css', '**/*.css')
      ]
    , ME.pkg.options.watch
    , function () {
      gulpSequence('sync:src2build', 'build:css', 'deploy')((err) => {
        if (err) {
          console.log(`${ME.d}[${C.Y}WATCH:SRC:CSS${C.N}] ${C.BR}ERROR${C.N}: [${utin(err)}]`);
          return Promise.reject(1);
        }
        console.log(`${ME.d}[${C.Y}WATCH:SRC:CSS${C.N}] ${C.BW}${C.OnBlue}FINISHED${C.N}`);
      });
    }
  );

  wCSS.on('change', function (e) {
    console.log(`${ME.d}[${C.W}WATCH:SRC${C.N}] CSS [${C.P}${e.path}${C.N}] was [${C.W}${e.type}${C.N}], running tasks ...`);
  });

});

gulp.task('watch:src:js', function () {
  let wScripts = gulp.watch([
      path.join(ME.SRC, 'assets/js', '**/*.js')
    ]
  , ME.pkg.options.watch
  , function () {
    gulpSequence('lint', 'populate', 'sync:src2build', 'build:js', 'deploy')((err) => {
      if (err) {
        console.log(`${ME.d}[${C.Y}WATCH:SRC:JS${C.N}] ${C.BRed}ERROR${C.N}: [${utin(err)}]`);
        return Promise.reject(1);
      }
      console.log(`${ME.d}[${C.Y}WATCH:SRC:JS${C.N}] ${C.BW}${C.OnBlue}FINISHED${C.N}`);
    });
  });
  wScripts.on('change', function (e) {
    console.log(`${ME.d}[${C.W}WATCH:SRC${C.N}] JS [${C.P}${e.path}${C.N}] was [${C.W}${e.type}${C.N}], running tasks ...`);
  });
});


//--------------//
//   LINTERS    //
//--------------//

gulp.task('jscs', function () {
  return gulp.src([
        path.join(ME.SRC, 'assets/js/front', '**/*.js')
      , path.join(ME.SRC, 'assets/js/app', '**/*.js')
    ])
    .pipe(jscs({configPath: 'config/.jscsrc'}))
    .pipe(jscs.reporter());
});


gulp.task('jshint', function () {
  let jshintConfig =  JSON.parse(fs.existsSync('./config/.jshintrc')
                        ? fs.readFileSync('./config/.jshintrc')
                        : {}
                      );
  jshintConfig.lookup = false;
  return gulp.src([
        path.join(ME.SRC, 'assets/js/front', '**/*.js')
      , path.join(ME.SRC, 'assets/js/app', '**/*.js')
    ])
    .pipe(jshint(jshintConfig))
    .pipe(gulpif('production' === ME.NODE_ENV
      , jshint.reporter('jshint-stylish', {verbose: true})
      , jshint.reporter('default',        {verbose: true})
    ));
    //  , jshint.reporter('fail',         {verbose: true})
});


//  Log file paths in the stream
gulp.task('show:src', function () {
  return gulp.src([
      path.join(ME.SRC, '**/*')
    , path.join(ME.SRC, '**/*.*')
    , path.join(ME.SRC, '**/.*')
  ])
  .pipe(changed(path.join(ME.BUILD, 'resources')))
  .pipe(vPaths((p) => {
    console.log(`${ME.d} SOURCE Changed: [${p}]`);
    return Promise.resolve(p);
  }));
});


//  Print configuration
gulp.task('show:config', function (cb) {

  console.log(`${ME.L}`);
  console.log(`ME.Config = [${utin(ME.Config)}]`);
  console.log(`${ME.L}`);

  if ('function' === typeof cb) {
    // cb();      //  SYNCH
    return cb();  //  ASYNC
  }
});


//  Print environment settings
gulp.task('show:env', function (cb) {

  console.log(`${ME.L}`);
  console.log(`${ME.d} ${C.BY}NPM_LIFECYCLE_EVENT${C.N} = [${C.BR}${process.env.npm_lifecycle_event}${C.N}]`);
  console.log(`${ME.d} ${C.BY}NODE_ENV${C.N} = [${C.BR}${ME.NODE_ENV}${C.N}]`);
  console.log(`${ME.L}`);

  if ('function' === typeof cb) {
    return cb();
  }else{
    return Promise.resolve();
  }
});


/**
 * @_EXPOSE
 */
exports = defaultTask;


/**
 * @_EXPORTS
 */
module.exports = exports;
// exports.default = defaultTask;

/*  EOF: ROOT/gulpfile.js  */
