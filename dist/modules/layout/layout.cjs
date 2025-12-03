/**
 * Anime.js - layout - CJS
 * @version v4.3.0-beta.1
 * @license MIT
 * @copyright 2025 - Julian Garnier
 */

'use strict';

var helpers = require('../core/helpers.cjs');
var targets = require('../core/targets.cjs');
var values = require('../core/values.cjs');
var consts = require('../core/consts.cjs');
var timeline = require('../timeline/timeline.cjs');
var waapi = require('../waapi/waapi.cjs');
var globals = require('../core/globals.cjs');

/**
 * @import {
 *   AnimationParams,
 * } from '../types/index.js'
*/

/**
 * @import {
 *   Timeline,
 * } from '../timeline/timeline.js'
*/

/**
 * @import {
 *   WAAPIAnimation
 * } from '../waapi/waapi.js'
*/

/**
 * @import {
 *   DOMTarget,
 *   DOMTargetSelector,
 *   FunctionValue,
 *   EasingParam,
 *   Callback,
 } from '../types/index.js'
*/

/**
 * @typedef {DOMTargetSelector|Array<DOMTargetSelector>} LayoutChildrenParam
 */

/**
 * @typedef {Record<String, Number|String>} LayoutStateParams
 */

/**
 * @typedef {Object} LayoutAnimationParams
 * @property {Number|FunctionValue} [delay]
 * @property {Number|FunctionValue} [duration]
 * @property {EasingParam} [ease]
 * @property {LayoutStateParams} [frozen]
 * @property {LayoutStateParams} [added]
 * @property {LayoutStateParams} [removed]
 * @property {Callback<AutoLayout>} [onComplete]
 */

/**
 * @typedef {LayoutAnimationParams & {
 *   children?: LayoutChildrenParam,
 *   properties?: Array<String>,
 * }} AutoLayoutParams
 */

/**
 * @typedef {Record<String, Number|String> & {
 *   transform: String,
 *   x: Number,
 *   y: Number,
 *   left: Number,
 *   top: Number,
 *   clientLeft: Number,
 *   clientTop: Number,
 *   width: Number,
 *   height: Number,
 * }} LayoutNodeProperties
 */

/**
 * @typedef {Object} LayoutNode
 * @property {String} id
 * @property {DOMTarget} $el
 * @property {Number} index
 * @property {Number} total
 * @property {Number} delay
 * @property {Number} duration
 * @property {DOMTarget} $measure
 * @property {LayoutSnapshot} state
 * @property {AutoLayout} layout
 * @property {LayoutNode|null} parentNode
 * @property {Boolean} isTarget
 * @property {Boolean} hasTransform
 * @property {Boolean} isAnimated
 * @property {Array<String>} inlineStyles
 * @property {String|null} inlineTransforms
 * @property {String|null} inlineTransition
 * @property {Boolean} branchAdded
 * @property {Boolean} branchRemoved
 * @property {Boolean} branchNotRendered
 * @property {Boolean} sizeChanged
 * @property {Boolean} isInlined
 * @property {Boolean} hasVisibilitySwap
 * @property {Boolean} hasDisplayNone
 * @property {Boolean} hasVisibilityHidden
 * @property {String|null} measuredInlineTransform
 * @property {String|null} measuredInlineTransition
 * @property {String|null} measuredDisplay
 * @property {String|null} measuredVisibility
 * @property {String|null} measuredPosition
 * @property {Boolean} measuredHasDisplayNone
 * @property {Boolean} measuredHasVisibilityHidden
 * @property {Boolean} measuredIsVisible
 * @property {Boolean} measuredIsRemoved
 * @property {Boolean} measuredIsInsideRoot
 * @property {LayoutNodeProperties} properties
 * @property {LayoutNode|null} _head
 * @property {LayoutNode|null} _tail
 * @property {LayoutNode|null} _prev
 * @property {LayoutNode|null} _next
 */

/**
 * @callback LayoutNodeIterator
 * @param {LayoutNode} node
 * @param {Number} index
 * @return {void}
 */

let layoutId = 0;
let nodeId = 0;

/**
 * @param {DOMTarget} root
 * @param {DOMTarget} $el
 * @return {Boolean}
 */
const isElementInRoot = (root, $el) => {
  if (!root || !$el) return false;
  return root === $el || root.contains($el);
};

/**
 * @param {Node} node
 * @param {'previousSibling'|'nextSibling'} direction
 * @return {Boolean}
 */
const hasTextSibling = (node, direction) => {
  let sibling = node[direction];
  while (sibling && sibling.nodeType === Node.TEXT_NODE && !sibling.textContent.trim()) {
    sibling = sibling[direction];
  }
  return sibling && sibling.nodeType === Node.TEXT_NODE;
};

/**
 * @param {DOMTarget} $el
 * @return {Boolean}
 */
const isElementSurroundedByText = $el => hasTextSibling($el, 'previousSibling') || hasTextSibling($el, 'nextSibling');

/**
 * @param {DOMTarget|null} $el
 * @return {String|null}
 */
const muteElementTransition = $el => {
  if (!$el) return null;
  const style = $el.style;
  const transition = style.transition || '';
  style.setProperty('transition', 'none', 'important');
  return transition;
};

/**
 * @param {DOMTarget|null} $el
 * @param {String|null} transition
 */
const restoreElementTransition = ($el, transition) => {
  if (!$el) return;
  const style = $el.style;
  if (transition) {
    style.transition = transition;
  } else {
    style.removeProperty('transition');
  }
};

/**
 * @param {LayoutNode} node
 */
const muteNodeTransition = node => {
  const store = node.layout.transitionMuteStore;
  const $el = node.$el;
  const $measure = node.$measure;
  if ($el && !store.has($el)) store.set($el, muteElementTransition($el));
  if ($measure && !store.has($measure)) store.set($measure, muteElementTransition($measure));
};

/**
 * @param {Map<DOMTarget, String|null>} store
 */
const restoreLayoutTransition = store => {
  store.forEach((value, $el) => restoreElementTransition($el, value));
  store.clear();
};

const hiddenComputedStyle = /** @type {CSSStyleDeclaration} */({
  display: 'none',
  visibility: 'hidden',
  opacity: '0',
  transform: 'none',
  position: 'static',
});

/**
 * @param {LayoutNode|null} node
 */
const detachNode = node => {
  if (!node) return;
  const parent = node.parentNode;
  if (!parent) return;
  if (parent._head === node) parent._head = node._next;
  if (parent._tail === node) parent._tail = node._prev;
  if (node._prev) node._prev._next = node._next;
  if (node._next) node._next._prev = node._prev;
  node._prev = null;
  node._next = null;
  node.parentNode = null;
};

/**
 * @param {DOMTarget} $el
 * @param {LayoutNode|null} parentNode
 * @param {LayoutSnapshot} state
 * @param {LayoutNode} [recycledNode]
 * @return {LayoutNode}
 */
const createNode = ($el, parentNode, state, recycledNode) => {
  let dataId = $el.dataset.layoutId;
  if (!dataId) dataId = $el.dataset.layoutId = `node-${nodeId++}`;
  const node = recycledNode ? recycledNode : /** @type {LayoutNode} */({});
  node.$el = $el;
  node.$measure = $el;
  node.id = dataId;
  node.index = 0;
  node.total = 1;
  node.delay = 0;
  node.duration = 0;
  node.state = state;
  node.layout = state.layout;
  node.parentNode = parentNode || null;
  node.isTarget = false;
  node.hasTransform = false;
  node.isAnimated = false;
  node.inlineStyles = [];
  node.inlineTransforms = null;
  node.inlineTransition = null;
  node.branchAdded = false;
  node.branchRemoved = false;
  node.branchNotRendered = false;
  node.sizeChanged = false;
  node.isInlined = false;
  node.hasVisibilitySwap = false;
  node.hasDisplayNone = false;
  node.hasVisibilityHidden = false;
  node.measuredInlineTransform = null;
  node.measuredInlineTransition = null;
  node.measuredDisplay = null;
  node.measuredVisibility = null;
  node.measuredPosition = null;
  node.measuredHasDisplayNone = false;
  node.measuredHasVisibilityHidden = false;
  node.measuredIsVisible = false;
  node.measuredIsRemoved = false;
  node.measuredIsInsideRoot = false;
  node.properties = /** @type {LayoutNodeProperties} */({
    transform: 'none',
    x: 0,
    y: 0,
    left: 0,
    top: 0,
    clientLeft: 0,
    clientTop: 0,
    width: 0,
    height: 0,
  });
  node.layout.properties.forEach(prop => node.properties[prop] = 0);
  node._head = null;
  node._tail = null;
  node._prev = null;
  node._next = null;
  return node;
};

/**
 * @param {LayoutNode} node
 * @param {DOMTarget} $measure
 * @param {CSSStyleDeclaration} computedStyle
 * @param {Boolean} skipMeasurements
 * @return {LayoutNode}
 */
const recordNodeState = (node, $measure, computedStyle, skipMeasurements) => {
  const $el = node.$el;
  const root = node.layout.root;
  const isRoot = root === $el;
  const properties = node.properties;
  const rootNode = node.state.rootNode;
  const parentNode = node.parentNode;
  const computedTransforms = computedStyle.transform;
  const inlineTransforms = $el.style.transform;
  const parentNotRendered = parentNode ? parentNode.measuredIsRemoved : false;
  const position = computedStyle.position;
  if (isRoot) node.layout.absoluteCoords = position === 'fixed' || position === 'absolute';
  node.$measure = $measure;
  node.inlineTransforms = inlineTransforms;
  node.hasTransform = computedTransforms && computedTransforms !== 'none';
  node.measuredIsInsideRoot = isElementInRoot(root, $measure);
  node.measuredInlineTransform = null;
  node.measuredDisplay = computedStyle.display;
  node.measuredVisibility = computedStyle.visibility;
  node.measuredPosition = position;
  node.measuredHasDisplayNone = computedStyle.display === 'none';
  node.measuredHasVisibilityHidden = computedStyle.visibility === 'hidden';
  node.measuredIsVisible = !(node.measuredHasDisplayNone || node.measuredHasVisibilityHidden);
  node.measuredIsRemoved = node.measuredHasDisplayNone || node.measuredHasVisibilityHidden || parentNotRendered;
  node.isInlined = node.measuredDisplay.includes('inline') && isElementSurroundedByText($el);

  // Mute transforms (and transition to avoid triggering an animation) before the position calculation
  if (node.hasTransform && !skipMeasurements) {
    const transitionMuteStore = node.layout.transitionMuteStore;
    if (!transitionMuteStore.get($el)) node.inlineTransition = muteElementTransition($el);
    if ($measure === $el) {
      $el.style.transform = 'none';
    } else {
      if (!transitionMuteStore.get($measure)) node.measuredInlineTransition = muteElementTransition($measure);
      node.measuredInlineTransform = $measure.style.transform;
      $measure.style.transform = 'none';
    }
  }

  let left = 0;
  let top = 0;
  let width = 0;
  let height = 0;

  if (!skipMeasurements) {
    const rect = $measure.getBoundingClientRect();
    left = rect.left;
    top = rect.top;
    width = rect.width;
    height = rect.height;
  }

  for (let name in properties) {
    const computedProp = name === 'transform' ? computedTransforms : computedStyle[name] || (computedStyle.getPropertyValue && computedStyle.getPropertyValue(name));
    if (!helpers.isUnd(computedProp)) properties[name] = computedProp;
  }

  properties.left = left;
  properties.top = top;
  properties.clientLeft = skipMeasurements ? 0 : $measure.clientLeft;
  properties.clientTop = skipMeasurements ? 0 : $measure.clientTop;
  // Compute local x/y relative to parent
  let absoluteLeft, absoluteTop;
  if (isRoot) {
    if (!node.layout.absoluteCoords) {
      absoluteLeft = 0;
      absoluteTop = 0;
    } else {
      absoluteLeft = left;
      absoluteTop = top;
    }
  } else {
    const p = parentNode || rootNode;
    const parentLeft = p.properties.left;
    const parentTop = p.properties.top;
    const borderLeft = p.properties.clientLeft;
    const borderTop = p.properties.clientTop;
    if (!node.layout.absoluteCoords) {
      if (p === rootNode) {
        const rootLeft = rootNode.properties.left;
        const rootTop = rootNode.properties.top;
        const rootBorderLeft = rootNode.properties.clientLeft;
        const rootBorderTop = rootNode.properties.clientTop;
        absoluteLeft = left - rootLeft - rootBorderLeft;
        absoluteTop = top - rootTop - rootBorderTop;
      } else {
        absoluteLeft = left - parentLeft - borderLeft;
        absoluteTop = top - parentTop - borderTop;
      }
    } else {
      absoluteLeft = left - parentLeft - borderLeft;
      absoluteTop = top - parentTop - borderTop;
    }
  }
  properties.x = absoluteLeft;
  properties.y = absoluteTop;
  properties.width = width;
  properties.height = height;
  return node;
};

/**
 * @param {LayoutNode} node
 * @param {LayoutStateParams} [props]
 */
const updateNodeProperties = (node, props) => {
  if (!props) return;
  for (let name in props) {
    node.properties[name] = props[name];
  }
};

/**
 * @param {LayoutNode} node
 */
const recordNodeInlineStyles = node => {
  const style = node.$el.style;
  const stylesStore = node.inlineStyles;
  stylesStore.length = 0;
  node.layout.recordedProperties.forEach(prop => {
    stylesStore.push(prop, style[prop] || '');
  });
};

/**
 * @param {LayoutNode} node
 */
const restoreNodeInlineStyles = node => {
  const style = node.$el.style;
  const stylesStore = node.inlineStyles;
  for (let i = 0, l = stylesStore.length; i < l; i += 2) {
    const property = stylesStore[i];
    const styleValue = stylesStore[i + 1];
    if (styleValue && styleValue !== '') {
      style[property] = styleValue;
    } else {
      style[property] = '';
      style.removeProperty(property);
    }
  }
};

/**
 * @param {LayoutNode} node
 */
const restoreNodeTransform = node => {
  const inlineTransforms = node.inlineTransforms;
  const nodeStyle = node.$el.style;
  if (!node.hasTransform || !inlineTransforms || (node.hasTransform && nodeStyle.transform === 'none') || (inlineTransforms && inlineTransforms === 'none')) {
    nodeStyle.removeProperty('transform');
  } else if (inlineTransforms) {
    nodeStyle.transform = inlineTransforms;
  }
  const $measure = node.$measure;
  if (node.hasTransform && $measure !== node.$el) {
    const measuredStyle = $measure.style;
    const measuredInline = node.measuredInlineTransform;
    if (measuredInline && measuredInline !== '') {
      measuredStyle.transform = measuredInline;
    } else {
      measuredStyle.removeProperty('transform');
    }
  }
  node.measuredInlineTransform = null;
  if (node.inlineTransition !== null) {
    restoreElementTransition(node.$el, node.inlineTransition);
    node.inlineTransition = null;
  }
  if ($measure !== node.$el && node.measuredInlineTransition !== null) {
    restoreElementTransition($measure, node.measuredInlineTransition);
    node.measuredInlineTransition = null;
  }
};

/**
 * @param {LayoutNode} node
 */
const restoreNodeVisualState = node => {
  if (node.measuredIsRemoved || node.hasVisibilitySwap) {
    node.$el.style.removeProperty('display');
    node.$el.style.removeProperty('visibility');
    if (node.hasVisibilitySwap) {
      node.$measure.style.removeProperty('display');
      node.$measure.style.removeProperty('visibility');
    }
  }
  if (node.measuredIsRemoved) {
    node.layout.pendingRemoved.delete(node.$el);
  }
};

/**
 * @param {LayoutNode} node
 * @param {LayoutNode} targetNode
 * @param {LayoutSnapshot} newState
 * @return {LayoutNode}
 */
const cloneNodeProperties = (node, targetNode, newState) => {
  targetNode.properties = /** @type {LayoutNodeProperties} */({ ...node.properties });
  targetNode.state = newState;
  targetNode.isTarget = node.isTarget;
  targetNode.hasTransform = node.hasTransform;
  targetNode.inlineTransforms = node.inlineTransforms;
  targetNode.measuredIsVisible = node.measuredIsVisible;
  targetNode.measuredDisplay = node.measuredDisplay;
  targetNode.measuredIsRemoved = node.measuredIsRemoved;
  targetNode.measuredHasDisplayNone = node.measuredHasDisplayNone;
  targetNode.measuredHasVisibilityHidden = node.measuredHasVisibilityHidden;
  targetNode.hasDisplayNone = node.hasDisplayNone;
  targetNode.isInlined = node.isInlined;
  targetNode.hasVisibilityHidden = node.hasVisibilityHidden;
  return targetNode;
};

class LayoutSnapshot {
  /**
   * @param {AutoLayout} layout
   */
  constructor(layout) {
    /** @type {AutoLayout} */
    this.layout = layout;
    /** @type {LayoutNode|null} */
    this.rootNode = null;
    /** @type {Set<LayoutNode>} */
    this.rootNodes = new Set();
    /** @type {Map<String, LayoutNode>} */
    this.nodes = new Map();
    /** @type {Number} */
    this.scrollX = 0;
    /** @type {Number} */
    this.scrollY = 0;
  }

  /**
   * @return {this}
   */
  revert() {
    this.forEachNode(node => {
      node.$el.removeAttribute('data-layout-id');
      node.$measure.removeAttribute('data-layout-id');
    });
    this.rootNode = null;
    this.rootNodes.clear();
    this.nodes.clear();
    return this;
  }

  /**
   * @param {DOMTarget} $el
   * @return {LayoutNodeProperties|undefined}
   */
  get($el) {
    const node = this.nodes.get($el.dataset.layoutId);
    if (!node) {
      console.warn(`No node found on state`);
      return;
    }
    return node.properties;
  }

  /**
   * @param {DOMTarget} $el
   * @param {String} prop
   * @return {Number|String|undefined}
   */
  getValue($el, prop) {
    if (!$el || !$el.dataset) {
      console.warn(`No element found on state (${$el})`);
      return;
    }
    const node = this.nodes.get($el.dataset.layoutId);
    if (!node) {
      console.warn(`No node found on state`);
      return;
    }
    const value = node.properties[prop];
    if (!helpers.isUnd(value)) return values.getFunctionValue(value, $el, node.index, node.total);
  }

  /**
   * @param {LayoutNode|null} rootNode
   * @param {LayoutNodeIterator} cb
   */
  forEach(rootNode, cb) {
    let node = rootNode;
    let i = 0;
    while (node) {
      cb(node, i++);
      if (node._head) {
        node = node._head;
      } else if (node._next) {
        node = node._next;
      } else {
        while (node && !node._next) {
          node = node.parentNode;
        }
        if (node) node = node._next;
      }
    }
  }

  /**
   * @param {LayoutNodeIterator} cb
   */
  forEachRootNode(cb) {
    this.forEach(this.rootNode, cb);
  }

  /**
   * @param {LayoutNodeIterator} cb
   */
  forEachNode(cb) {
    for (const rootNode of this.rootNodes) {
      this.forEach(rootNode, cb);
    }
  }

  /**
   * @param {DOMTarget} $el
   * @param {LayoutNode|null} parentNode
   * @return {LayoutNode|null}
   */
  registerElement($el, parentNode) {
    if (!$el || $el.nodeType !== 1) return null;

    if (!this.layout.transitionMuteStore.has($el)) this.layout.transitionMuteStore.set($el, muteElementTransition($el));

    /** @type {Array<DOMTarget|LayoutNode|null>} */
    const stack = [$el, parentNode];
    const root = this.layout.root;
    let firstNode = null;

    while (stack.length) {
      /** @type {LayoutNode|null} */
      const $parent = /** @type {LayoutNode|null} */(stack.pop());
      /** @type {DOMTarget|null} */
      const $current = /** @type {DOMTarget|null} */(stack.pop());
      if (!$current || $current.nodeType !== 1 || helpers.isSvg($current)) continue;

      const skipMeasurements = $parent ? $parent.measuredIsRemoved : false;

      const computedStyle = skipMeasurements ? hiddenComputedStyle : getComputedStyle($current);
      const hasDisplayNone = skipMeasurements ? true : computedStyle.display === 'none';
      const hasVisibilityHidden = skipMeasurements ? true : computedStyle.visibility === 'hidden';
      const isVisible = !hasDisplayNone && !hasVisibilityHidden;
      const existingId = $current.dataset.layoutId;
      const isInsideRoot = isElementInRoot(root, $current);

      let node = existingId ? this.nodes.get(existingId) : null;

      if (node && node.$el !== $current) {
        const nodeInsideRoot = isElementInRoot(root, node.$el);
        const measuredVisible = node.measuredIsVisible;
        const shouldReassignNode = !nodeInsideRoot && (isInsideRoot || (!isInsideRoot && !measuredVisible && isVisible));
        const shouldReuseMeasurements = nodeInsideRoot && !measuredVisible && isVisible;
        // Rebind nodes that move into the root or whose detached twin just became visible
        if (shouldReassignNode) {
          detachNode(node);
          node = createNode($current, $parent, this, node);
        // for hidden element with in-root sibling, keep the hidden node but borrow measurements from its visible in-root twin element
        } else if (shouldReuseMeasurements) {
          recordNodeState(node, $current, computedStyle, skipMeasurements);
          let $child = $current.lastElementChild;
          while ($child) {
            stack.push(/** @type {DOMTarget} */($child), node);
            $child = $child.previousElementSibling;
          }
          if (!firstNode) firstNode = node;
          continue;
        // No reassignment needed so keep walking descendants under the current parent
        } else {
          let $child = $current.lastElementChild;
          while ($child) {
            stack.push(/** @type {DOMTarget} */($child), $parent);
            $child = $child.previousElementSibling;
          }
          if (!firstNode) firstNode = node;
          continue;
        }
      } else {
        node = createNode($current, $parent, this, node);
      }

      node.branchAdded = false;
      node.branchRemoved = false;
      node.branchNotRendered = false;
      node.isTarget = false;
      node.isAnimated = false;
      node.hasVisibilityHidden = hasVisibilityHidden;
      node.hasDisplayNone = hasDisplayNone;
      node.hasVisibilitySwap = (hasVisibilityHidden && !node.measuredHasVisibilityHidden) || (hasDisplayNone && !node.measuredHasDisplayNone);
      // node.hasVisibilitySwap = (hasVisibilityHidden !== node.measuredHasVisibilityHidden) || (hasDisplayNone !== node.measuredHasDisplayNone);

      this.nodes.set(node.id, node);

      node.parentNode = $parent || null;
      node._prev = null;
      node._next = null;

      if ($parent) {
        this.rootNodes.delete(node);
        if (!$parent._head) {
          $parent._head = node;
          $parent._tail = node;
        } else {
          $parent._tail._next = node;
          node._prev = $parent._tail;
          $parent._tail = node;
        }
      } else {
        this.rootNodes.add(node);
      }

      recordNodeState(node, node.$el, computedStyle, skipMeasurements);

      let $child = $current.lastElementChild;
      while ($child) {
        stack.push(/** @type {DOMTarget} */($child), node);
        $child = $child.previousElementSibling;
      }

      if (!firstNode) firstNode = node;
    }

    return firstNode;
  }

  /**
   * @param {DOMTarget} $el
   * @param {Set<DOMTarget>} candidates
   * @return {LayoutNode|null}
   */
  ensureDetachedNode($el, candidates) {
    if (!$el || $el === this.layout.root) return null;
    const existingId = $el.dataset.layoutId;
    const existingNode = existingId ? this.nodes.get(existingId) : null;
    if (existingNode && existingNode.$el === $el) return existingNode;
    let parentNode = null;
    let $ancestor = $el.parentElement;
    while ($ancestor && $ancestor !== this.layout.root) {
      if (candidates.has($ancestor)) {
        parentNode = this.ensureDetachedNode($ancestor, candidates);
        break;
      }
      $ancestor = $ancestor.parentElement;
    }
    return this.registerElement($el, parentNode);
  }

  /**
   * @return {this}
   */
  record() {
    const { children, root } = this.layout;
    const toParse = helpers.isArr(children) ? children : [children];
    const scoped = [];
    const scopeRoot = children === '*' ? root : globals.scope.root;

    for (let i = 0, l = toParse.length; i < l; i++) {
      const child = toParse[i];
      scoped[i] = helpers.isStr(child) ? scopeRoot.querySelectorAll(child) : child;
    }

    const parsedChildren = targets.registerTargets(scoped);

    this.nodes.clear();
    this.rootNodes.clear();

    const rootNode = this.registerElement(root, null);
    // Root node are always targets
    rootNode.isTarget = true;
    this.rootNode = rootNode;

    // Track ids of nodes that belong to the current root to filter detached matches
    const inRootNodeIds = new Set();
    this.nodes.forEach((node, id) => {
      if (node && node.measuredIsInsideRoot) {
        inRootNodeIds.add(id);
      }
    });

    // Elements with a layout id outside the root that match the children selector
    const detachedElementsLookup = new Set();
    const orderedDetachedElements = [];

    for (let i = 0, l = parsedChildren.length; i < l; i++) {
      const $el = parsedChildren[i];
      if (!$el || $el.nodeType !== 1 || $el === root) continue;
      const insideRoot = isElementInRoot(root, $el);
      if (!insideRoot) {
        const layoutNodeId = $el.dataset.layoutId;
        if (!layoutNodeId || !inRootNodeIds.has(layoutNodeId)) continue;
      }
      if (!detachedElementsLookup.has($el)) {
        detachedElementsLookup.add($el);
        orderedDetachedElements.push($el);
      }
    }

    for (let i = 0, l = orderedDetachedElements.length; i < l; i++) {
      this.ensureDetachedNode(orderedDetachedElements[i], detachedElementsLookup);
    }

    for (let i = 0, l = parsedChildren.length; i < l; i++) {
      const $el = parsedChildren[i];
      const node = this.nodes.get($el.dataset.layoutId);
      if (node) {
        let cur = node;
        while (cur) {
          if (cur.isTarget) break;
          cur.isTarget = true;
          cur = cur.parentNode;
        }
      }
    }

    this.scrollX = window.scrollX;
    this.scrollY = window.scrollY;

    const total = this.nodes.size;

    this.forEachNode(restoreNodeTransform);
    this.forEachNode((node, i) => {
      node.index = i;
      node.total = total;
    });

    return this;
  }
}

class AutoLayout {
  /**
   * @param {DOMTargetSelector} root
   * @param {AutoLayoutParams} [params]
   */
  constructor(root, params = {}) {
    if (globals.scope.current) globals.scope.current.register(this);
    const frozenParams = params.frozen;
    const addedParams = params.added;
    const removedParams = params.removed;
    const propsParams = params.properties;
    /** @type {AutoLayoutParams} */
    this.params = params;
    /** @type {DOMTarget} */
    this.root = /** @type {DOMTarget} */(targets.registerTargets(root)[0]);
    /** @type {Number} */
    this.id = layoutId++;
    /** @type {LayoutChildrenParam} */
    this.children = params.children || '*';
    /** @type {Boolean} */
    this.absoluteCoords = false;
    /** @type {Number|FunctionValue} */
    this.duration = values.setValue(params.duration, 500);
    /** @type {Number|FunctionValue} */
    this.delay = values.setValue(params.delay, 0);
    /** @type {EasingParam} */
    this.ease = values.setValue(params.ease, 'inOut(3.5)');
    /** @type {Callback<this>} */
    this.onComplete = values.setValue(params.onComplete, /** @type {Callback<this>} */(consts.noop));
    /** @type {LayoutStateParams} */
    this.frozenParams = frozenParams || { opacity: 0 };
    /** @type {LayoutStateParams} */
    this.addedParams = addedParams || { opacity: 0 };
    /** @type {LayoutStateParams} */
    this.removedParams = removedParams || { opacity: 0 };
    /** @type {Set<String>} */
    this.properties = new Set([
      'opacity',
      'borderRadius',
    ]);
    if (frozenParams) for (let name in frozenParams) this.properties.add(name);
    if (addedParams) for (let name in addedParams) this.properties.add(name);
    if (removedParams) for (let name in removedParams) this.properties.add(name);
    if (propsParams) for (let i = 0, l = propsParams.length; i < l; i++) this.properties.add(propsParams[i]);
    /** @type {Set<String>} */
    this.recordedProperties = new Set([
      'display',
      'visibility',
      'translate',
      'position',
      'left',
      'top',
      'marginLeft',
      'marginTop',
      'width',
      'height',
      'maxWidth',
      'maxHeight',
      'minWidth',
      'minHeight',
    ]);
    this.properties.forEach(prop => this.recordedProperties.add(prop));
    /** @type {WeakSet<DOMTarget>} */
    this.pendingRemoved = new WeakSet();
    /** @type {Map<DOMTarget, String|null>} */
    this.transitionMuteStore = new Map();
    /** @type {LayoutSnapshot} */
    this.oldState = new LayoutSnapshot(this);
    /** @type {LayoutSnapshot} */
    this.newState = new LayoutSnapshot(this);
    /** @type {Timeline|null} */
    this.timeline = null;
    /** @type {WAAPIAnimation|null} */
    this.transformAnimation = null;
    /** @type {Array<DOMTarget>} */
    this.frozen = [];
    /** @type {Array<DOMTarget>} */
    this.removed = [];
    /** @type {Array<DOMTarget>} */
    this.added = [];
    // Record the current state as the old state to init the data attributes
    this.oldState.record();
    // And all layout transition muted during the record
    restoreLayoutTransition(this.transitionMuteStore);
  }

  /**
   * @return {this}
   */
  revert() {
    if (this.timeline) {
      this.timeline.complete();
      this.timeline = null;
    }
    if (this.transformAnimation) {
      this.transformAnimation.complete();
      this.transformAnimation = null;
    }
    this.root.classList.remove('is-animated');
    this.frozen.length = this.removed.length = this.added.length = 0;
    this.oldState.revert();
    this.newState.revert();
    requestAnimationFrame(() => restoreLayoutTransition(this.transitionMuteStore));
    return this;
  }

  /**
   * @return {this}
   */
  record() {
    // Commit transforms before measuring
    if (this.transformAnimation) {
      this.transformAnimation.cancel();
      this.transformAnimation = null;
    }
    // Record the old state
    this.oldState.record();
    // Cancel any running timeline
    if (this.timeline) {
      this.timeline.cancel();
      this.timeline = null;
    }
    // Restore previously captured inline styles
    this.newState.forEachRootNode(restoreNodeInlineStyles);
    return this;
  }

  /**
   * @param {LayoutAnimationParams} [params]
   * @return {Timeline}
   */
  animate(params = {}) {
    const delay = values.setValue(params.delay, this.delay);
    const duration = values.setValue(params.duration, this.duration);
    const onComplete = values.setValue(params.onComplete, this.onComplete);
    const frozenParams = params.frozen ? helpers.mergeObjects(params.frozen, this.frozenParams) : this.frozenParams;
    const addedParams = params.added ? helpers.mergeObjects(params.added, this.addedParams) : this.addedParams;
    const removedParams = params.removed ? helpers.mergeObjects(params.removed, this.removedParams) : this.removedParams;
    const oldState = this.oldState;
    const newState = this.newState;
    const added = this.added;
    const removed = this.removed;
    const frozen = this.frozen;
    const pendingRemoved = this.pendingRemoved;

    added.length = removed.length = frozen.length = 0;

    // Mute old state CSS transitions to prevent wrong properties calculation
    oldState.forEachRootNode(muteNodeTransition);
    // Capture the new state before animation
    newState.record();
    newState.forEachRootNode(recordNodeInlineStyles);

    const targets = [];
    const animated = [];
    const transformed = [];
    const animatedFrozen = [];
    const root = newState.rootNode.$el;

    newState.forEachRootNode(node => {
      const $el = node.$el;
      const id = node.id;
      const parent = node.parentNode;
      const parentAdded = parent ? parent.branchAdded : false;
      const parentRemoved = parent ? parent.branchRemoved : false;
      const parentNotRendered = parent ? parent.branchNotRendered : false;

      // Delay and duration must be calculated in the animate() call to support delay override
      node.delay = +(helpers.isFnc(delay) ? delay($el, node.index, node.total) : delay);
      node.duration = +(helpers.isFnc(duration) ? duration($el, node.index, node.total) : duration);

      let oldStateNode = oldState.nodes.get(id);

      const hasNoOldState = !oldStateNode;

      if (hasNoOldState) {
        oldStateNode = cloneNodeProperties(node, /** @type {LayoutNode} */({}), oldState);
        oldState.nodes.set(id, oldStateNode);
        oldStateNode.measuredIsRemoved = true;
      } else if (oldStateNode.measuredIsRemoved && !node.measuredIsRemoved) {
        cloneNodeProperties(node, oldStateNode, oldState);
        oldStateNode.measuredIsRemoved = true;
      }

      const oldParentNode = oldStateNode.parentNode;
      const oldParentId = oldParentNode ? oldParentNode.id : null;
      const newParentId = parent ? parent.id : null;
      const parentChanged = oldParentId !== newParentId;
      const elementChanged = oldStateNode.$el !== node.$el;
      const wasRemovedBefore = oldStateNode.measuredIsRemoved;
      const isRemovedNow = node.measuredIsRemoved;

      // Recalculate postion relative to their parent for elements that have been moved
      if (!oldStateNode.measuredIsRemoved && !isRemovedNow && !hasNoOldState && (parentChanged || elementChanged)) {
        let offsetX = 0;
        let offsetY = 0;
        let current = node.parentNode;
        while (current) {
          offsetX += current.properties.x || 0;
          offsetY += current.properties.y || 0;
          if (current.parentNode === newState.rootNode) break;
          current = current.parentNode;
        }
        let oldOffsetX = 0;
        let oldOffsetY = 0;
        let oldCurrent = oldStateNode.parentNode;
        while (oldCurrent) {
          oldOffsetX += oldCurrent.properties.x || 0;
          oldOffsetY += oldCurrent.properties.y || 0;
          if (oldCurrent.parentNode === oldState.rootNode) break;
          oldCurrent = oldCurrent.parentNode;
        }
        oldStateNode.properties.x += oldOffsetX - offsetX;
        oldStateNode.properties.y += oldOffsetY - offsetY;
      }

      if (node.hasVisibilitySwap) {
        if (node.hasVisibilityHidden) {
          node.$el.style.visibility = 'visible';
          node.$measure.style.visibility = 'hidden';
        }
        if (node.hasDisplayNone) {
          node.$el.style.display = oldStateNode.measuredDisplay || node.measuredDisplay || '';
          // Setting visibility 'hidden' instead of display none to avoid calculation issues
          node.$measure.style.visibility = 'hidden';
          // @TODO: check why setting display here can cause calculation issues
          // node.$measure.style.display = 'none';
        }
      }

      const wasPendingRemoval = pendingRemoved.has($el);
      const wasVisibleBefore = oldStateNode.measuredIsVisible;
      const isVisibleNow = node.measuredIsVisible;
      const becomeVisible = !wasVisibleBefore && isVisibleNow && !parentNotRendered;
      const topLevelAdded = !isRemovedNow && (wasRemovedBefore || wasPendingRemoval) && !parentAdded;
      const newlyRemoved = isRemovedNow && !wasRemovedBefore && !parentRemoved;
      const topLevelRemoved = newlyRemoved || isRemovedNow && wasPendingRemoval && !parentRemoved;

      if (node.measuredIsRemoved && wasVisibleBefore) {
        node.$el.style.display = oldStateNode.measuredDisplay;
        node.$el.style.visibility = 'visible';
        cloneNodeProperties(oldStateNode, node, newState);
      }

      if (newlyRemoved) {
        removed.push($el);
        pendingRemoved.add($el);
      } else if (!isRemovedNow && wasPendingRemoval) {
        pendingRemoved.delete($el);
      }

      // Node is added
      if ((topLevelAdded && !parentNotRendered) || becomeVisible) {
        updateNodeProperties(oldStateNode, addedParams);
        added.push($el);
      // Node is removed
      } else if (topLevelRemoved && !parentNotRendered) {
        updateNodeProperties(node, removedParams);
      }

      // Compute function based propety values before cheking for changes
      for (let name in node.properties) {
        node.properties[name] = newState.getValue(node.$el, name);
        // NOTE: I'm using node.$el to get the value of old state, make sure this is valid instead of oldStateNode.$el
        oldStateNode.properties[name] = oldState.getValue(node.$el, name);
      }

      const hiddenStateChanged = (topLevelAdded || newlyRemoved) && wasRemovedBefore !== isRemovedNow;
      let propertyChanged = false;


      if (node.isTarget && (!node.measuredIsRemoved && wasVisibleBefore || node.measuredIsRemoved && isVisibleNow)) {
        if (!node.isInlined && (node.properties.transform !== 'none' || oldStateNode.properties.transform !== 'none')) {
          node.hasTransform = true;
          propertyChanged = true;
          transformed.push($el);
        }
        for (let name in node.properties) {
          if (name !== 'transform' && (node.properties[name] !== oldStateNode.properties[name] || hiddenStateChanged)) {
            propertyChanged = true;
            animated.push($el);
            break;
          }
        }
      }

      const nodeHasChanged = (propertyChanged || topLevelAdded || topLevelRemoved || becomeVisible);
      const nodeIsAnimated = node.isTarget && nodeHasChanged;

      node.isAnimated = nodeIsAnimated;
      node.branchAdded = parentAdded || topLevelAdded;
      node.branchRemoved = parentRemoved || topLevelRemoved;
      node.branchNotRendered = parentNotRendered || node.measuredIsRemoved;

      const sizeTolerance = 1;
      const widthChanged = Math.abs(node.properties.width - oldStateNode.properties.width) > sizeTolerance;
      const heightChanged = Math.abs(node.properties.height - oldStateNode.properties.height) > sizeTolerance;

      node.sizeChanged = (widthChanged || heightChanged);

      targets.push($el);

      if (!node.isTarget) {
        frozen.push($el);
        if ((nodeHasChanged || node.sizeChanged) && parent && parent.isTarget && parent.isAnimated && parent.sizeChanged) {
          animatedFrozen.push($el);
        }
      }
    });

    const defaults = {
      ease: values.setValue(params.ease, this.ease),
      duration: (/** @type {HTMLElement} */$el) => newState.nodes.get($el.dataset.layoutId).duration,
      delay: (/** @type {HTMLElement} */$el) => newState.nodes.get($el.dataset.layoutId).delay,
    };

    this.timeline = timeline.createTimeline({
      onComplete: () => {
        // Make sure to call .cancel() after restoreNodeInlineStyles(node); otehrwise the commited styles get reverted
        if (this.transformAnimation) this.transformAnimation.cancel();
        newState.forEachRootNode(node => {
          restoreNodeVisualState(node);
          restoreNodeInlineStyles(node);
        });
        for (let i = 0, l = transformed.length; i < l; i++) {
          const $el = transformed[i];
          $el.style.transform = newState.getValue($el, 'transform');
        }
        this.root.classList.remove('is-animated');
        if (onComplete) onComplete(this);
        // Avoid CSS transitions at the end of the animation by restoring them on the next frame
        requestAnimationFrame(() => {
          if (this.root.classList.contains('is-animated')) return;
          restoreLayoutTransition(this.transitionMuteStore);
        });
      },
      onPause: () => {
        if (this.transformAnimation) this.transformAnimation.cancel();
        newState.forEachRootNode(restoreNodeVisualState);
        this.root.classList.remove('is-animated');
        if (onComplete) onComplete(this);
      },
      composition: false,
      defaults,
    });

    if (targets.length) {

      this.root.classList.add('is-animated');

      for (let i = 0, l = targets.length; i < l; i++) {
        const $el = targets[i];
        const id = $el.dataset.layoutId;
        const oldNode = oldState.nodes.get(id);
        const newNode = newState.nodes.get(id);
        const oldNodeState = oldNode.properties;

        // Make sure to mute all CSS transition before applying the oldState styles back
        muteNodeTransition(newNode);

        // Don't animate dimensions and positions of inlined elements
        if (!newNode.isInlined) {
          // Display grid can mess with the absolute positioning, so set it to block during transition
          // if (oldNode.measuredDisplay === 'grid' || newNode.measuredDisplay === 'grid') $el.style.display = 'block';
          $el.style.display = 'block';
          // All children must be in position absolue
          if ($el !== root || this.absoluteCoords) {
            $el.style.position = this.absoluteCoords ? 'fixed' : 'absolute';
            $el.style.left = '0px';
            $el.style.top = '0px';
            $el.style.marginLeft = '0px';
            $el.style.marginTop = '0px';
            $el.style.translate = `${oldNodeState.x}px ${oldNodeState.y}px`;
          }
          if ($el === root && newNode.measuredPosition === 'static') {
            $el.style.position = 'relative';
            // Cancel left / trop in case the static element had muted values now activated by potision relative
            $el.style.left = '0px';
            $el.style.top = '0px';
          }
          $el.style.width = `${oldNodeState.width}px`;
          $el.style.height = `${oldNodeState.height}px`;
          // Overrides user defined min and max to prevents width and height clamping
          $el.style.minWidth = `auto`;
          $el.style.minHeight = `auto`;
          $el.style.maxWidth = `none`;
          $el.style.maxHeight = `none`;
        }
      }

      // Restore the scroll position if the oldState differs from the current state
      if (oldState.scrollX !== window.scrollX || oldState.scrollY !== window.scrollY) {
        // Restoring in the next frame avoids race conditions if for example a waapi animation commit styles that affect the root height
        requestAnimationFrame(() => {
          window.scrollTo(oldState.scrollX, oldState.scrollY);
        });
      }

      for (let i = 0, l = animated.length; i < l; i++) {
        const $el = animated[i];
        const id = $el.dataset.layoutId;
        const oldNode = oldState.nodes.get(id);
        const newNode = newState.nodes.get(id);
        const oldNodeState = oldNode.properties;
        const newNodeState = newNode.properties;
        let hasChanged = false;
        const animatedProps = {
          composition: 'none',
          // delay: (/** @type {HTMLElement} */$el) => newState.nodes.get($el.dataset.layoutId).delay,
        };
        if (!newNode.isInlined) {
          if (oldNodeState.width !== newNodeState.width) {
            animatedProps.width = [oldNodeState.width, newNodeState.width];
            hasChanged = true;
          }
          if (oldNodeState.height !== newNodeState.height) {
            animatedProps.height = [oldNodeState.height, newNodeState.height];
            hasChanged = true;
          }
          // If the node has transforms we handle the translate animation in wappi otherwise translate and other transforms can be out of sync
          // Always animate translate
          if (!newNode.hasTransform) {
            animatedProps.translate = [`${oldNodeState.x}px ${oldNodeState.y}px`, `${newNodeState.x}px ${newNodeState.y}px`];
            hasChanged = true;
          }
        }
        this.properties.forEach(prop => {
          const oldVal = oldNodeState[prop];
          const newVal = newNodeState[prop];
          if (prop !== 'transform' && oldVal !== newVal) {
            animatedProps[prop] = [oldVal, newVal];
            hasChanged = true;
          }
        });
        if (hasChanged) {
          this.timeline.add($el, animatedProps, 0);
        }
      }

    }

    if (frozen.length) {

      for (let i = 0, l = frozen.length; i < l; i++) {
        const $el = frozen[i];
        const oldNode = oldState.nodes.get($el.dataset.layoutId);
        if (!oldNode.isInlined) {
          const oldNodeState = oldState.get($el);
          $el.style.width = `${oldNodeState.width}px`;
          $el.style.height = `${oldNodeState.height}px`;
          // Overrides user defined min and max to prevents width and height clamping
          $el.style.minWidth = `auto`;
          $el.style.minHeight = `auto`;
          $el.style.maxWidth = `none`;
          $el.style.maxHeight = `none`;
          $el.style.translate = `${oldNodeState.x}px ${oldNodeState.y}px`;
        }
        this.properties.forEach(prop => {
          if (prop !== 'transform') {
            $el.style[prop] = `${oldState.getValue($el, prop)}`;
          }
        });
      }

      for (let i = 0, l = frozen.length; i < l; i++) {
        const $el = frozen[i];
        const newNode = newState.nodes.get($el.dataset.layoutId);
        const newNodeState = newState.get($el);
        this.timeline.call(() => {
          if (!newNode.isInlined) {
            $el.style.width = `${newNodeState.width}px`;
            $el.style.height = `${newNodeState.height}px`;
            // Overrides user defined min and max to prevents width and height clamping
            $el.style.minWidth = `auto`;
            $el.style.minHeight = `auto`;
            $el.style.maxWidth = `none`;
            $el.style.maxHeight = `none`;
            $el.style.translate = `${newNodeState.x}px ${newNodeState.y}px`;
          }
          this.properties.forEach(prop => {
            if (prop !== 'transform') {
              $el.style[prop] = `${newState.getValue($el, prop)}`;
            }
          });
        }, newNode.delay + newNode.duration / 2);
      }

      if (animatedFrozen.length) {
        const animatedFrozenParams = /** @type {AnimationParams} */({});
        if (frozenParams) {
          for (let prop in frozenParams) {
            animatedFrozenParams[prop] = [
              { from: (/** @type {HTMLElement} */$el) => oldState.getValue($el, prop), ease: 'in(1.75)', to: frozenParams[prop] },
              { from: frozenParams[prop], to: (/** @type {HTMLElement} */$el) => newState.getValue($el, prop), ease: 'out(1.75)' }
            ];
          }
        }
        this.timeline.add(animatedFrozen, animatedFrozenParams, 0);
      }

    }

    const transformedLength = transformed.length;

    if (transformedLength) {
      // We only need to set the transform property here since translate is alread defined the targets loop
      for (let i = 0; i < transformedLength; i++) {
        const $el = transformed[i];
        $el.style.translate = `${oldState.get($el).x}px ${oldState.get($el).y}px`,
        $el.style.transform = oldState.getValue($el, 'transform');
      }
      this.transformAnimation = waapi.waapi.animate(transformed, {
        translate: (/** @type {HTMLElement} */$el) => `${newState.get($el).x}px ${newState.get($el).y}px`,
        transform: (/** @type {HTMLElement} */$el) => newState.getValue($el, 'transform'),
        autoplay: false,
        persist: true,
        ...defaults,
      });
      this.timeline.sync(this.transformAnimation, 0);
    }

    return this.timeline.init();
  }

  /**
   * @param {(layout: this) => void} callback
   * @param {LayoutAnimationParams} [params]
   * @return {this}
   */
  update(callback, params = {}) {
    this.record();
    callback(this);
    this.animate(params);
    return this;
  }
}

/**
 * @param {DOMTargetSelector} root
 * @param {AutoLayoutParams} [params]
 * @return {AutoLayout}
 */
const createLayout = (root, params) => new AutoLayout(root, params);

exports.AutoLayout = AutoLayout;
exports.createLayout = createLayout;
