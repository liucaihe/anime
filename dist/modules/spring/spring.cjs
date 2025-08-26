/**
 * Anime.js - spring - CJS
 * @version v4.2.0
 * @license MIT
 * @copyright 2025 - Julian Garnier
 */

'use strict';

var consts = require('../core/consts.cjs');
var globals = require('../core/globals.cjs');
var helpers = require('../core/helpers.cjs');
var values = require('../core/values.cjs');

/**
 * @import {
 *   EasingFunction,
 *   SpringParams,
 * } from '../types/index.js'
*/

/*
 * Spring ease solver adapted from https://webkit.org/demos/spring/spring.js
 * (c) 2016 Webkit - Apple Inc
 */

const maxSpringParamValue = consts.K * 10;

class Spring {
  /**
   * @param {SpringParams} [parameters]
   */
  constructor(parameters = {}) {
    this.timeStep = .02; // Interval fed to the solver to calculate duration
    this.restThreshold = .0005; // Values below this threshold are considered resting position
    this.restDuration = 200; // Duration in ms used to check if the spring is resting after reaching restThreshold
    this.maxDuration = 60000; // The maximum allowed spring duration in ms (default 1 min)
    this.maxRestSteps = this.restDuration / this.timeStep / consts.K; // How many steps allowed after reaching restThreshold before stopping the duration calculation
    this.maxIterations = this.maxDuration / this.timeStep / consts.K; // Calculate the maximum iterations allowed based on maxDuration
    this.m = helpers.clamp(values.setValue(parameters.mass, 1), 0, maxSpringParamValue);
    this.s = helpers.clamp(values.setValue(parameters.stiffness, 100), 1, maxSpringParamValue);
    this.d = helpers.clamp(values.setValue(parameters.damping, 10), .1, maxSpringParamValue);
    this.v = helpers.clamp(values.setValue(parameters.velocity, 0), -maxSpringParamValue, maxSpringParamValue);
    this.w0 = 0;
    this.zeta = 0;
    this.wd = 0;
    this.b = 0;
    this.solverDuration = 0;
    this.duration = 0;
    this.compute();
    /** @type {EasingFunction} */
    this.ease = t => t === 0 || t === 1 ? t : this.solve(t * this.solverDuration);
  }

  /** @type {EasingFunction} */
  solve(time) {
    const { zeta, w0, wd, b } = this;
    let t = time;
    if (zeta < 1) {
      t = helpers.exp(-t * zeta * w0) * (1 * helpers.cos(wd * t) + b * helpers.sin(wd * t));
    } else {
      t = (1 + b * t) * helpers.exp(-t * w0);
    }
    return 1 - t;
  }

  compute() {
    const { maxRestSteps, maxIterations, restThreshold, timeStep, m, d, s, v } = this;
    const w0 = this.w0 = helpers.clamp(helpers.sqrt(s / m), consts.minValue, consts.K);
    const zeta = this.zeta = d / (2 * helpers.sqrt(s * m));
    const wd = this.wd = zeta < 1 ? w0 * helpers.sqrt(1 - zeta * zeta) : 0;
    this.b = zeta < 1 ? (zeta * w0 + -v) / wd : -v + w0;
    let solverTime = 0;
    let restSteps = 0;
    let iterations = 0;
    while (restSteps < maxRestSteps && iterations < maxIterations) {
      if (helpers.abs(1 - this.solve(solverTime)) < restThreshold) {
        restSteps++;
      } else {
        restSteps = 0;
      }
      this.solverDuration = solverTime;
      solverTime += timeStep;
      iterations++;
    }
    this.duration = helpers.round(this.solverDuration * consts.K, 0) * globals.globals.timeScale;
  }

  get mass() {
    return this.m;
  }

  set mass(v) {
    this.m = helpers.clamp(values.setValue(v, 1), 0, maxSpringParamValue);
    this.compute();
  }

  get stiffness() {
    return this.s;
  }

  set stiffness(v) {
    this.s = helpers.clamp(values.setValue(v, 100), 1, maxSpringParamValue);
    this.compute();
  }

  get damping() {
    return this.d;
  }

  set damping(v) {
    this.d = helpers.clamp(values.setValue(v, 10), .1, maxSpringParamValue);
    this.compute();
  }

  get velocity() {
    return this.v;
  }

  set velocity(v) {
    this.v = helpers.clamp(values.setValue(v, 0), -maxSpringParamValue, maxSpringParamValue);
    this.compute();
  }
}

/**
 * @param {SpringParams} [parameters]
 * @returns {Spring}
 */
const createSpring = (parameters) => new Spring(parameters);

exports.Spring = Spring;
exports.createSpring = createSpring;
