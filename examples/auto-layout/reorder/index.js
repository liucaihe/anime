import { createLayout, utils } from '../../../../dist/modules/index.js';

const layout = createLayout('.container', { duration: 1000 });
const cards = [...utils.$('.card')];
const [ $list ] = utils.$('.list');

let shuffled = false;

const shuffleCards = $card => {
  utils.shuffle(utils.$('.card')).forEach($card => {
    $list.appendChild($card);
  })
}

document.addEventListener('click', e => {
  const $card = e.target.closest('.card');
  if ($card) layout.update(() => shuffleCards($card));
});
