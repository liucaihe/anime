export class Spring {
    /**
     * @param {SpringParams} [parameters]
     */
    constructor(parameters?: SpringParams);
    timeStep: number;
    restThreshold: number;
    restDuration: number;
    maxDuration: number;
    maxRestSteps: number;
    maxIterations: number;
    m: number;
    s: number;
    d: number;
    v: number;
    w0: number;
    zeta: number;
    wd: number;
    b: number;
    solverDuration: number;
    duration: number;
    /** @type {EasingFunction} */
    ease: EasingFunction;
    solve(time: number): number;
    compute(): void;
    set mass(v: number);
    get mass(): number;
    set stiffness(v: number);
    get stiffness(): number;
    set damping(v: number);
    get damping(): number;
    set velocity(v: number);
    get velocity(): number;
}
export function createSpring(parameters?: SpringParams): Spring;
import type { EasingFunction } from '../types/index.js';
import type { SpringParams } from '../types/index.js';
