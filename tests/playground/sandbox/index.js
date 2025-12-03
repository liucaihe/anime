import { animate, utils, stagger, engine } from '../../../dist/modules/index.js';

// engine.fps = 120;
// engine.defaults.frameRate = 120;
// engine.pauseOnDocumentHidden = false;

const duration = 1000;

animate('.anim', {
  marginLeft: [0,"90%"],
  duration,
  loop: true,
  ease: 'linear'
})

document.querySelector('.css').classList.add('animate');