import { waapi, animate, onScroll, $, set, stagger, spring, random, utils } from '../../../dist/modules/index.js';

const container = document.querySelector("main");
animate(".rectangle", {
  x: "70px",
  ease: "inOutCirc",
  delay: 1000,
  loopDelay: 1000,
  loop: true,
  autoplay: onScroll({
    container,
    debug: true
  })
});
