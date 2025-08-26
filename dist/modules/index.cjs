/**
 * Anime.js - CJS
 * @version v4.2.0
 * @license MIT
 * @copyright 2025 - Julian Garnier
 */

'use strict';

var timer = require('./timer/timer.cjs');
var animation = require('./animation/animation.cjs');
var timeline = require('./timeline/timeline.cjs');
var animatable = require('./animatable/animatable.cjs');
var draggable = require('./draggable/draggable.cjs');
var scope = require('./scope/scope.cjs');
var scroll = require('./events/scroll.cjs');
var spring = require('./spring/spring.cjs');
var engine = require('./engine/engine.cjs');
var index = require('./easings/index.cjs');
var index$1 = require('./utils/index.cjs');
var index$2 = require('./svg/index.cjs');
var index$3 = require('./text/index.cjs');
var waapi = require('./waapi/waapi.cjs');
var none = require('./easings/none.cjs');
var cubicBezier = require('./easings/cubic-bezier.cjs');
var steps = require('./easings/steps.cjs');
var linear = require('./easings/linear.cjs');
var irregular = require('./easings/irregular.cjs');
var eases = require('./easings/eases.cjs');
var chainable = require('./utils/chainable.cjs');
var random = require('./utils/random.cjs');
var time = require('./utils/time.cjs');
var styles = require('./core/styles.cjs');
var targets = require('./core/targets.cjs');
var target = require('./utils/target.cjs');
var stagger = require('./utils/stagger.cjs');
var motionpath = require('./svg/motionpath.cjs');
var drawable = require('./svg/drawable.cjs');
var morphto = require('./svg/morphto.cjs');
var split = require('./text/split.cjs');



exports.Timer = timer.Timer;
exports.createTimer = timer.createTimer;
exports.JSAnimation = animation.JSAnimation;
exports.animate = animation.animate;
exports.Timeline = timeline.Timeline;
exports.createTimeline = timeline.createTimeline;
exports.Animatable = animatable.Animatable;
exports.createAnimatable = animatable.createAnimatable;
exports.Draggable = draggable.Draggable;
exports.createDraggable = draggable.createDraggable;
exports.Scope = scope.Scope;
exports.createScope = scope.createScope;
exports.ScrollObserver = scroll.ScrollObserver;
exports.onScroll = scroll.onScroll;
exports.scrollContainers = scroll.scrollContainers;
exports.Spring = spring.Spring;
exports.createSpring = spring.createSpring;
exports.engine = engine.engine;
exports.easings = index;
exports.utils = index$1;
exports.svg = index$2;
exports.text = index$3;
exports.WAAPIAnimation = waapi.WAAPIAnimation;
exports.waapi = waapi.waapi;
exports.none = none.none;
exports.cubicBezier = cubicBezier.cubicBezier;
exports.steps = steps.steps;
exports.linear = linear.linear;
exports.irregular = irregular.irregular;
exports.eases = eases.eases;
exports.clamp = chainable.clamp;
exports.damp = chainable.damp;
exports.degToRad = chainable.degToRad;
exports.lerp = chainable.lerp;
exports.mapRange = chainable.mapRange;
exports.padEnd = chainable.padEnd;
exports.padStart = chainable.padStart;
exports.radToDeg = chainable.radToDeg;
exports.round = chainable.round;
exports.roundPad = chainable.roundPad;
exports.snap = chainable.snap;
exports.wrap = chainable.wrap;
exports.createSeededRandom = random.createSeededRandom;
exports.random = random.random;
exports.randomPick = random.randomPick;
exports.shuffle = random.shuffle;
exports.keepTime = time.keepTime;
exports.sync = time.sync;
exports.cleanInlineStyles = styles.cleanInlineStyles;
exports.$ = targets.registerTargets;
exports.get = target.get;
exports.remove = target.remove;
exports.set = target.set;
exports.stagger = stagger.stagger;
exports.createMotionPath = motionpath.createMotionPath;
exports.createDrawable = drawable.createDrawable;
exports.morphTo = morphto.morphTo;
exports.TextSplitter = split.TextSplitter;
exports.split = split.split;
exports.splitText = split.splitText;
