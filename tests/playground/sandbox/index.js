import { animate, clamp, createTimer, onScroll, random } from '../../../dist/modules/index.js';

animate('square', {
  x: 100,
  duration: 200,
  autoplay: onScroll({
    target: '.container',
    sync: 1,
  })
});

animate('.square', {
  duration: () => random(1, 200)
});

const value = clamp()