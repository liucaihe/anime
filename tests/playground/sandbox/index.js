import { waapi, animate, $, set, stagger, spring, random, utils } from '../../../dist/modules/index.js';

// const targets = $('.green');

// const [$red] = $('.red');

// set(targets, { y: () => random(-200, 200), x: () => random(-200, 200) });

// set(targets, { backgroundColor: '#FF0000' });

// let reverse = false;

// const animation = animate(targets, {
//   x: 'var(--x)',
//   y: 'var(--y)',
//   backgroundColor: 'var(--test-color, #FF00FF)',
//   borderRadius: '40%',
//   rotate: 90,
//   scale: 1.25,
//   delay: stagger(100),
//   loop: true,
//   alternate: true,
//   onComplete: () => {
//     console.log('completed');
//   }
// });

// document.body.addEventListener('click', () => {
//   animation.revert();
// });

// Set the CSS variables as properties on the animated elements
utils.set('.square', {
  '--radius': '4px',
  '--x': '0rem',
  '--pseudo-el-after-scale': '1', // applied to the pseudo element "::after"
  borderRadius: 'var(--radius)',
  translateX: 'var(--x)',
});

// Animate the values of the CSS variables
animate('.square', {
  '--radius': '20px',
  '--x': '16.5rem',
  '--pseudo-el-after-scale': '1.55' // Animates the ":after" pseudo element of the element
});