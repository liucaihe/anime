export type DefaultsParams = {
    id?: number | string;
    keyframes?: PercentageKeyframes | DurationKeyframes;
    playbackEase?: EasingParam;
    playbackRate?: number;
    frameRate?: number;
    loop?: number | boolean;
    reversed?: boolean;
    alternate?: boolean;
    autoplay?: boolean | ScrollObserver;
    duration?: number | FunctionValue;
    delay?: number | FunctionValue;
    loopDelay?: number;
    ease?: EasingParam;
    composition?: "none" | "replace" | "blend" | compositionTypes;
    modifier?: (v: any) => any;
    onBegin?: (tickable: Tickable) => void;
    onBeforeUpdate?: (tickable: Tickable) => void;
    onUpdate?: (tickable: Tickable) => void;
    onLoop?: (tickable: Tickable) => void;
    onPause?: (tickable: Tickable) => void;
    onComplete?: (tickable: Tickable) => void;
    onRender?: (renderable: Renderable) => void;
};
export type Renderable = JSAnimation | Timeline;
export type Tickable = Timer | Renderable;
export type CallbackArgument = Timer & JSAnimation & Timeline;
export type Revertible = Animatable | Tickable | WAAPIAnimation | Draggable | ScrollObserver | TextSplitter | Scope;
export type StaggerFunction<T> = (target?: Target, index?: number, length?: number, tl?: Timeline) => T;
export type StaggerParams = {
    start?: number | string;
    from?: number | "first" | "center" | "last" | "random";
    reversed?: boolean;
    grid?: Array<number>;
    axis?: ("x" | "y");
    use?: string | ((target: Target, i: number, length: number) => number);
    total?: number;
    ease?: EasingParam;
    modifier?: TweenModifier;
};
export type DOMTarget = HTMLElement | SVGElement;
export type JSTarget = Record<string, any>;
export type Target = DOMTarget | JSTarget;
export type TargetSelector = Target | NodeList | string;
export type DOMTargetSelector = DOMTarget | NodeList | string;
export type DOMTargetsParam = Array<DOMTargetSelector> | DOMTargetSelector;
export type DOMTargetsArray = Array<DOMTarget>;
export type JSTargetsParam = Array<JSTarget> | JSTarget;
export type JSTargetsArray = Array<JSTarget>;
export type TargetsParam = Array<TargetSelector> | TargetSelector;
export type TargetsArray = Array<Target>;
export type EasingFunction = (time: number) => number;
export type EaseStringParamNames = ("linear" | "linear(x1, x2 25%, x3)" | "in" | "out" | "inOut" | "inQuad" | "outQuad" | "inOutQuad" | "inCubic" | "outCubic" | "inOutCubic" | "inQuart" | "outQuart" | "inOutQuart" | "inQuint" | "outQuint" | "inOutQuint" | "inSine" | "outSine" | "inOutSine" | "inCirc" | "outCirc" | "inOutCirc" | "inExpo" | "outExpo" | "inOutExpo" | "inBounce" | "outBounce" | "inOutBounce" | "inBack" | "outBack" | "inOutBack" | "inElastic" | "outElastic" | "inOutElastic" | "irregular" | "cubicBezier" | "steps" | "in(p = 1.675)" | "out(p = 1.675)" | "inOut(p = 1.675)" | "inBack(overshoot = 1.70158)" | "outBack(overshoot = 1.70158)" | "inOutBack(overshoot = 1.70158)" | "inElastic(amplitude = 1, period = .3)" | "outElastic(amplitude = 1, period = .3)" | "inOutElastic(amplitude = 1, period = .3)" | "irregular(length = 10, randomness = 1)" | "cubicBezier(x1, y1, x2, y2)" | "steps(steps = 10)");
export type PowerEasing = (power?: number | string) => EasingFunction;
export type BackEasing = (overshoot?: number | string) => EasingFunction;
export type ElasticEasing = (amplitude?: number | string, period?: number | string) => EasingFunction;
export type EasingFunctionWithParams = PowerEasing | BackEasing | ElasticEasing;
export type EasingParam = (string & {}) | EaseStringParamNames | EasingFunction | Spring;
export type SpringParams = {
    /**
     * - Mass, default 1
     */
    mass?: number;
    /**
     * - Stiffness, default 100
     */
    stiffness?: number;
    /**
     * - Damping, default 10
     */
    damping?: number;
    /**
     * - Initial velocity, default 0
     */
    velocity?: number;
};
export type Callback<T> = (self: T, e?: PointerEvent) => any;
export type TickableCallbacks<T extends unknown> = {
    onBegin?: Callback<T>;
    onBeforeUpdate?: Callback<T>;
    onUpdate?: Callback<T>;
    onLoop?: Callback<T>;
    onPause?: Callback<T>;
    onComplete?: Callback<T>;
};
export type RenderableCallbacks<T extends unknown> = {
    onRender?: Callback<T>;
};
export type TimerOptions = {
    id?: number | string;
    duration?: TweenParamValue;
    delay?: TweenParamValue;
    loopDelay?: number;
    reversed?: boolean;
    alternate?: boolean;
    loop?: boolean | number;
    autoplay?: boolean | ScrollObserver;
    frameRate?: number;
    playbackRate?: number;
};
export type TimerParams = TimerOptions & TickableCallbacks<Timer>;
export type FunctionValue = (target: Target, index: number, length: number) => number | string | TweenObjectValue | Array<number | string | TweenObjectValue>;
export type TweenModifier = (value: number) => number | string;
export type ColorArray = [number, number, number, number];
export type Tween = {
    id: number;
    parent: JSAnimation;
    property: string;
    target: Target;
    _value: string | number;
    _func: Function | null;
    _ease: EasingFunction;
    _fromNumbers: Array<number>;
    _toNumbers: Array<number>;
    _strings: Array<string>;
    _fromNumber: number;
    _toNumber: number;
    _numbers: Array<number>;
    _number: number;
    _unit: string;
    _modifier: TweenModifier;
    _currentTime: number;
    _delay: number;
    _updateDuration: number;
    _startTime: number;
    _changeDuration: number;
    _absoluteStartTime: number;
    _tweenType: tweenTypes;
    _valueType: valueTypes;
    _composition: number;
    _isOverlapped: number;
    _isOverridden: number;
    _renderTransforms: number;
    _prevRep: Tween;
    _nextRep: Tween;
    _prevAdd: Tween;
    _nextAdd: Tween;
    _prev: Tween;
    _next: Tween;
};
export type TweenDecomposedValue = {
    /**
     * - Type
     */
    t: number;
    /**
     * - Single number value
     */
    n: number;
    /**
     * - Value unit
     */
    u: string;
    /**
     * - Value operator
     */
    o: string;
    /**
     * - Array of Numbers (in case of complex value type)
     */
    d: Array<number>;
    /**
     * - Strings (in case of complex value type)
     */
    s: Array<string>;
};
export type TweenPropertySiblings = {
    _head: null | Tween;
    _tail: null | Tween;
};
export type TweenLookups = Record<string, TweenPropertySiblings>;
export type TweenReplaceLookups = WeakMap<Target, TweenLookups>;
export type TweenAdditiveLookups = Map<Target, TweenLookups>;
export type TweenParamValue = number | string | FunctionValue;
export type TweenPropValue = TweenParamValue | [TweenParamValue, TweenParamValue];
export type TweenComposition = (string & {}) | "none" | "replace" | "blend" | compositionTypes;
export type TweenParamsOptions = {
    duration?: TweenParamValue;
    delay?: TweenParamValue;
    ease?: EasingParam;
    modifier?: TweenModifier;
    composition?: TweenComposition;
};
export type TweenValues = {
    from?: TweenParamValue;
    to?: TweenPropValue;
    fromTo?: TweenPropValue;
};
export type TweenKeyValue = TweenParamsOptions & TweenValues;
export type ArraySyntaxValue = Array<TweenKeyValue | TweenPropValue>;
export type TweenOptions = TweenParamValue | ArraySyntaxValue | TweenKeyValue;
export type TweenObjectValue = Partial<{
    to: TweenParamValue | Array<TweenParamValue>;
    from: TweenParamValue | Array<TweenParamValue>;
    fromTo: TweenParamValue | Array<TweenParamValue>;
}>;
export type PercentageKeyframeOptions = {
    ease?: EasingParam;
};
export type PercentageKeyframeParams = Record<string, TweenParamValue>;
export type PercentageKeyframes = Record<string, PercentageKeyframeParams & PercentageKeyframeOptions>;
export type DurationKeyframes = Array<Record<string, TweenOptions | TweenModifier | boolean> & TweenParamsOptions>;
export type AnimationOptions = {
    keyframes?: PercentageKeyframes | DurationKeyframes;
    playbackEase?: EasingParam;
};
export type AnimationParams = Record<string, TweenOptions | Callback<JSAnimation> | TweenModifier | boolean | PercentageKeyframes | DurationKeyframes | ScrollObserver> & TimerOptions & AnimationOptions & TweenParamsOptions & TickableCallbacks<JSAnimation> & RenderableCallbacks<JSAnimation>;
/**
 * Accepts:<br>
 * - `Number` - Absolute position in milliseconds (e.g., `500` places element at exactly 500ms)<br>
 * - `'+=Number'` - Addition: Position element X ms after the last element (e.g., `'+=100'`)<br>
 * - `'-=Number'` - Subtraction: Position element X ms before the last element's end (e.g., `'-=100'`)<br>
 * - `'*=Number'` - Multiplier: Position element at a fraction of the total duration (e.g., `'*=.5'` for halfway)<br>
 * - `'<'` - Previous end: Position element at the end position of the previous element<br>
 * - `'<<'` - Previous start: Position element at the start position of the previous element<br>
 * - `'<<+=Number'` - Combined: Position element relative to previous element's start (e.g., `'<<+=250'`)<br>
 * - `'label'` - Label: Position element at a named label position (e.g., `'My Label'`)
 */
export type TimelinePosition = number | `+=${number}` | `-=${number}` | `*=${number}` | "<" | "<<" | `<<+=${number}` | `<<-=${number}` | string;
/**
 * Accepts:<br>
 * - `Number` - Absolute position in milliseconds (e.g., `500` places animation at exactly 500ms)<br>
 * - `'+=Number'` - Addition: Position animation X ms after the last animation (e.g., `'+=100'`)<br>
 * - `'-=Number'` - Subtraction: Position animation X ms before the last animation's end (e.g., `'-=100'`)<br>
 * - `'*=Number'` - Multiplier: Position animation at a fraction of the total duration (e.g., `'*=.5'` for halfway)<br>
 * - `'<'` - Previous end: Position animation at the end position of the previous animation<br>
 * - `'<<'` - Previous start: Position animation at the start position of the previous animation<br>
 * - `'<<+=Number'` - Combined: Position animation relative to previous animation's start (e.g., `'<<+=250'`)<br>
 * - `'label'` - Label: Position animation at a named label position (e.g., `'My Label'`)<br>
 * - `stagger(String|Nummber)` - Stagger multi-elements animation positions (e.g., 10, 20, 30...)
 */
export type TimelineAnimationPosition = TimelinePosition | StaggerFunction<number | string>;
export type TimelineOptions = {
    defaults?: DefaultsParams;
    playbackEase?: EasingParam;
};
export type TimelineParams = TimerOptions & TimelineOptions & TickableCallbacks<Timeline> & RenderableCallbacks<Timeline>;
export type WAAPITweenValue = string | number | Array<string> | Array<number>;
export type WAAPIFunctionValue = (target: DOMTarget, index: number, length: number) => WAAPITweenValue;
export type WAAPIKeyframeValue = WAAPITweenValue | WAAPIFunctionValue | Array<string | number | WAAPIFunctionValue>;
export type WAAPICallback = (animation: WAAPIAnimation) => void;
export type WAAPITweenOptions = {
    to?: WAAPIKeyframeValue;
    from?: WAAPIKeyframeValue;
    duration?: number | WAAPIFunctionValue;
    delay?: number | WAAPIFunctionValue;
    ease?: EasingParam;
    composition?: CompositeOperation;
};
export type WAAPIAnimationOptions = {
    loop?: number | boolean;
    Reversed?: boolean;
    Alternate?: boolean;
    autoplay?: boolean | ScrollObserver;
    playbackRate?: number;
    duration?: number | WAAPIFunctionValue;
    delay?: number | WAAPIFunctionValue;
    ease?: EasingParam;
    composition?: CompositeOperation;
    onComplete?: WAAPICallback;
};
export type WAAPIAnimationParams = Record<string, WAAPIKeyframeValue | WAAPIAnimationOptions | boolean | ScrollObserver | WAAPICallback | EasingParam | WAAPITweenOptions> & WAAPIAnimationOptions;
export type AnimatablePropertySetter = (to: number | Array<number>, duration?: number, ease?: EasingParam) => AnimatableObject;
export type AnimatablePropertyGetter = () => number | Array<number>;
export type AnimatableProperty = AnimatablePropertySetter & AnimatablePropertyGetter;
export type AnimatableObject = Animatable & Record<string, AnimatableProperty>;
export type AnimatablePropertyParamsOptions = {
    unit?: string;
    duration?: TweenParamValue;
    ease?: EasingParam;
    modifier?: TweenModifier;
    composition?: TweenComposition;
};
export type AnimatableParams = Record<string, TweenParamValue | EasingParam | TweenModifier | TweenComposition | AnimatablePropertyParamsOptions> & AnimatablePropertyParamsOptions;
export type ReactRef = {
    current?: HTMLElement | SVGElement | null;
};
export type AngularRef = {
    nativeElement?: HTMLElement | SVGElement;
};
export type ScopeParams = {
    root?: DOMTargetSelector | ReactRef | AngularRef;
    defaults?: DefaultsParams;
    mediaQueries?: Record<string, string>;
};
export type ScopedCallback<T> = (scope: Scope) => T;
export type ScopeCleanupCallback = (scope?: Scope) => any;
export type ScopeConstructorCallback = (scope?: Scope) => ScopeCleanupCallback | void;
export type ScopeMethod = (...args: any[]) => ScopeCleanupCallback | void;
export type ScrollThresholdValue = string | number;
export type ScrollThresholdParam = {
    target?: ScrollThresholdValue;
    container?: ScrollThresholdValue;
};
export type ScrollObserverAxisCallback = (self: ScrollObserver) => "x" | "y";
export type ScrollThresholdCallback = (self: ScrollObserver) => ScrollThresholdValue | ScrollThresholdParam;
export type ScrollObserverParams = {
    id?: number | string;
    sync?: boolean | number | string | EasingParam;
    container?: TargetsParam;
    target?: TargetsParam;
    axis?: "x" | "y" | ScrollObserverAxisCallback | ((observer: ScrollObserver) => "x" | "y" | ScrollObserverAxisCallback);
    enter?: ScrollThresholdValue | ScrollThresholdParam | ScrollThresholdCallback | ((observer: ScrollObserver) => ScrollThresholdValue | ScrollThresholdParam | ScrollThresholdCallback);
    leave?: ScrollThresholdValue | ScrollThresholdParam | ScrollThresholdCallback | ((observer: ScrollObserver) => ScrollThresholdValue | ScrollThresholdParam | ScrollThresholdCallback);
    repeat?: boolean | ((observer: ScrollObserver) => boolean);
    debug?: boolean;
    onEnter?: Callback<ScrollObserver>;
    onLeave?: Callback<ScrollObserver>;
    onEnterForward?: Callback<ScrollObserver>;
    onLeaveForward?: Callback<ScrollObserver>;
    onEnterBackward?: Callback<ScrollObserver>;
    onLeaveBackward?: Callback<ScrollObserver>;
    onUpdate?: Callback<ScrollObserver>;
    onSyncComplete?: Callback<ScrollObserver>;
};
export type DraggableAxisParam = {
    mapTo?: string;
    modifier?: TweenModifier;
    composition?: TweenComposition;
    snap?: number | Array<number> | ((draggable: Draggable) => number | Array<number>);
};
export type DraggableCursorParams = {
    onHover?: string;
    onGrab?: string;
};
export type DraggableParams = {
    trigger?: DOMTargetSelector;
    container?: DOMTargetSelector | Array<number> | ((draggable: Draggable) => DOMTargetSelector | Array<number>);
    x?: boolean | DraggableAxisParam;
    y?: boolean | DraggableAxisParam;
    modifier?: TweenModifier;
    snap?: number | Array<number> | ((draggable: Draggable) => number | Array<number>);
    containerPadding?: number | Array<number> | ((draggable: Draggable) => number | Array<number>);
    containerFriction?: number | ((draggable: Draggable) => number);
    releaseContainerFriction?: number | ((draggable: Draggable) => number);
    dragSpeed?: number | ((draggable: Draggable) => number);
    scrollSpeed?: number | ((draggable: Draggable) => number);
    scrollThreshold?: number | ((draggable: Draggable) => number);
    minVelocity?: number | ((draggable: Draggable) => number);
    maxVelocity?: number | ((draggable: Draggable) => number);
    velocityMultiplier?: number | ((draggable: Draggable) => number);
    releaseMass?: number;
    releaseStiffness?: number;
    releaseDamping?: number;
    releaseEase?: EasingParam;
    cursor?: boolean | DraggableCursorParams | ((draggable: Draggable) => boolean | DraggableCursorParams);
    onGrab?: Callback<Draggable>;
    onDrag?: Callback<Draggable>;
    onRelease?: Callback<Draggable>;
    onUpdate?: Callback<Draggable>;
    onSettle?: Callback<Draggable>;
    onSnap?: Callback<Draggable>;
    onResize?: Callback<Draggable>;
    onAfterResize?: Callback<Draggable>;
};
export type SplitTemplateParams = {
    class?: false | string;
    wrap?: boolean | "hidden" | "clip" | "visible" | "scroll" | "auto";
    clone?: boolean | "top" | "right" | "bottom" | "left" | "center";
};
export type SplitValue = boolean | string;
export type SplitFunctionValue = (value?: Node | HTMLElement) => any;
export type TextSplitterParams = {
    lines?: SplitValue | SplitTemplateParams | SplitFunctionValue;
    words?: SplitValue | SplitTemplateParams | SplitFunctionValue;
    chars?: SplitValue | SplitTemplateParams | SplitFunctionValue;
    accessible?: boolean;
    includeSpaces?: boolean;
    debug?: boolean;
};
export type DrawableSVGGeometry = SVGGeometryElement & {
    setAttribute(name: "draw", value: `${number} ${number}`): void;
    draw: `${number} ${number}`;
};
import type { ScrollObserver } from '../events/scroll.js';
import type { compositionTypes } from '../core/consts.js';
import type { JSAnimation } from '../animation/animation.js';
import type { Timeline } from '../timeline/timeline.js';
import type { Timer } from '../timer/timer.js';
import type { Animatable } from '../animatable/animatable.js';
import type { WAAPIAnimation } from '../waapi/waapi.js';
import type { Draggable } from '../draggable/draggable.js';
import type { TextSplitter } from '../text/split.js';
import type { Scope } from '../scope/scope.js';
import type { Spring } from '../spring/spring.js';
import type { tweenTypes } from '../core/consts.js';
import type { valueTypes } from '../core/consts.js';
