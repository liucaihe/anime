/**
 * @import {
 *   EasingFunction,
 *   PowerEasing,
 *   EasingFunctionWithParams,
 * } from '../types/index.js'
*/
/** @type {PowerEasing} */
export const easeInPower: PowerEasing;
/**
 * @callback EaseType
 * @param {EasingFunction} Ease
 * @return {EasingFunction}
 */
/** @type {Record<String, EaseType>} */
export const easeTypes: Record<string, EaseType>;
export function parseEaseString(string: string, easesFunctions: Record<string, EasingFunctionWithParams | EasingFunction>, easesLookups: any): EasingFunction;
export type EaseType = (Ease: EasingFunction) => EasingFunction;
import type { PowerEasing } from '../types/index.js';
import type { EasingFunctionWithParams } from '../types/index.js';
import type { EasingFunction } from '../types/index.js';
