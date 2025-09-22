import { animate, onScroll, utils } from '../../../lib/anime.esm.js';

animate('.red', {
  id: 'test',
  rotate: 360,
  autoplay: onScroll()
});

utils.$('.green').forEach($el => {
  setTimeout(() => {
    onScroll({
      target: $el,
      repeat: false,
      debug: true,
      onEnter: () => {
        console.log("enter scroll")
      }
    })
  }, 60)
})
