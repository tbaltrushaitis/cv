/**
 * @_EXPOSE
 */
exports = {
    ...require('./build2dist')
  , ...require('./build2web')
  , ...require('./dist2web')
  , ...require('./src2build')
};


/**
 * @_EXPORTS
 */
module.exports = exports;
