const { series, parallel }  = require('gulp');

const { default:Bower }     = require('./bower');
const { default:Build }     = require('./build');
// const { default:DirSync }   = require('./dirsync');
const { default:Lint }      = require('./lint');
const { default:Populate }  = require('./populate');
const {
    default: Help
  , config: Config
  , usage: Usage
} = require('./usage');


const Data = (function () {
  return {
      bower:    Bower
    , build:    Build
    , config:   Config
    // , dirsync:  DirSync
    , help:     Help
    , lint:     Lint
    , populate: Populate
    , usage:    Usage
  }
})();


/**
 * @_EXPOSE
 */
exports.bower     = Bower
exports.build     = Build
exports.config    = Config
exports.data      = Data
// exports.dirsync   = DirSync
exports.help      = Help
exports.lint      = Lint
exports.test      = Lint
exports.populate  = Populate
exports.usage     = Usage


/**
 * @_EXPORTS
 */
exports.default = Help;
