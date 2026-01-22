import { createTimeline, utils, onScroll } from '../../../dist/modules/index.js';

const $wrapper = utils.$('.hero_wrapper')[0];
const $hero = utils.$('.hero')[0];

const timeline = createTimeline({
  autoplay: onScroll({
    target: $wrapper,
    enter: 'top top',
    leave: 'top bottom',
    sync: true
  })
})

timeline.add($hero, { height: [() => '100svh', '8rem'] })
timeline.init();

window.addEventListener('resize', () => timeline.refresh())