const { series, parallel } = require('gulp');

const { default:Css } = require('./css');
const { default:Js }  = require('./js');
const { default:Img } = require('./img');


/**
 * @_EXPOSE
 */
exports.css = Css;
exports.js  = Js;
exports.img = Img;


/**
 * @_EXPORTS
 */
exports.default = series(Css, Js, Img);
