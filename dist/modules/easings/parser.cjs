/**
 * Anime.js - easings - CJS
 * @version v4.2.0
 * @license MIT
 * @copyright 2025 - Julian Garnier
 */

'use strict';

var helpers = require('../core/helpers.cjs');
var none = require('./none.cjs');

/**
 * @import {
 *   EasingFunction,
 *   PowerEasing,
 *   EasingFunctionWithParams,
 * } from '../types/index.js'
*/

/** @type {PowerEasing} */
const easeInPower = (p = 1.68) => t => helpers.pow(t, +p);

/**
 * @callback EaseType
 * @param {EasingFunction} Ease
 * @return {EasingFunction}
 */

/** @type {Record<String, EaseType>} */
const easeTypes = {
  in: easeIn => t => easeIn(t),
  out: easeIn => t => 1 - easeIn(1 - t),
  inOut: easeIn => t => t < .5 ? easeIn(t * 2) / 2 : 1 - easeIn(t * -2 + 2) / 2,
  outIn: easeIn => t => t < .5 ? (1 - easeIn(1 - t * 2)) / 2 : (easeIn(t * 2 - 1) + 1) / 2,
};

/**
 * @param  {String} string
 * @param  {Record<String, EasingFunctionWithParams|EasingFunction>} easesFunctions
 * @param  {Object} easesLookups
 * @return {EasingFunction}
 */
const parseEaseString = (string, easesFunctions, easesLookups) => {
  if (easesLookups[string]) return easesLookups[string];
  if (string.indexOf('(') <= -1) {
    const hasParams = easeTypes[string] || string.includes('Back') || string.includes('Elastic');
    const parsedFn = /** @type {EasingFunction} */(hasParams ? /** @type {EasingFunctionWithParams} */(easesFunctions[string])() : easesFunctions[string]);
    return parsedFn ? easesLookups[string] = parsedFn : none.none;
  } else {
    const split = string.slice(0, -1).split('(');
    const parsedFn = /** @type {EasingFunctionWithParams} */(easesFunctions[split[0]]);
    return parsedFn ? easesLookups[string] = parsedFn(...split[1].split(',')) : none.none;
  }
};

exports.easeInPower = easeInPower;
exports.easeTypes = easeTypes;
exports.parseEaseString = parseEaseString;
