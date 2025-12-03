import { createLayout, $ } from '../../../dist/modules/index.js';

const $app = document.querySelector('.app');
const $form = document.querySelector('.create');
const $input = document.querySelector('#create');
const $pending = document.querySelector('.pending');
const $completed = document.querySelector('.completed');

const layout = createLayout($app, {
  duration: 500
});

let ids = 0;

const createItem = (text, checked) => {
  const todoId = `todo-${ids}`;
  const $item = document.createElement('li');
  const $label = document.createElement('label');
  const $checkbox = document.createElement('input');
  const $delete = document.createElement('button');
  $item.className = 'item';
  $label.setAttribute('for', todoId);
  $label.append(text);
  $checkbox.id = todoId;
  $checkbox.type = 'checkbox';
  $checkbox.className = 'icon';
  $checkbox.checked = checked;
  $checkbox.addEventListener('change', handleToggle);
  $delete.type = 'button';
  $delete.className = 'delete icon';
  $delete.textContent = '×';
  $delete.addEventListener('click', handleDelete);
  $item.append($checkbox);
  $item.append($label);
  $item.append($delete);
  ids++;
  return $item;
};

const handleToggle = event => {
  const checkbox = /** @type {HTMLInputElement} */(event.currentTarget);
  const $item = checkbox.closest('.item');
  if (!$item) return;
  const $targetList = checkbox.checked ? $completed : $pending;
  $('.list').forEach($el => $el.classList.toggle('is-active', $el === $targetList));
  $('.item').forEach($el => $el.classList.toggle('is-floating', $el === $item));
  layout.update(() => {
    $targetList.insertBefore($item, $targetList.firstElementChild);
  });
};

const handleDelete = event => {
  const button = /** @type {HTMLButtonElement} */(event.currentTarget);
  const $item = button.closest('.item');
  if (!$item) return;
  layout.update(() => {
    $item.style.display = 'none';
  }, {
    onComplete: () => $item.remove()
  });
};

$form.addEventListener('submit', event => {
  event.preventDefault();
  const value = $input.value.trim();
  if (!value) return;
  const newItem = createItem(value, false);
  layout.update(() => {
    $pending.insertBefore(newItem, $pending.firstElementChild);
  });
  $input.value = '';
});

document.querySelectorAll('.item input[type="checkbox"]').forEach(checkbox => {
  checkbox.addEventListener('change', handleToggle);
});
document.querySelectorAll('.item .delete').forEach(button => {
  button.addEventListener('click', handleDelete);
});
