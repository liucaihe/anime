import { createLayout, animate, utils } from '../../dist/modules/index.js';

const [ $list ] = utils.$('.list');
const [ $reorder ] = utils.$('button');

const layout = createLayout('.list');

$reorder.addEventListener("click", () => {
  layout.update(() => {
    $list.classList.toggle("horizontal");
  });
});
