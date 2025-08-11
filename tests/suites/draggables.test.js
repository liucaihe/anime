import {
  expect,
  getChildAtIndex,
  forEachChildren,
} from '../utils.js';

import {
  createTimer,
  createDraggable,
  utils,
} from '../../src/anime.js';

suite('Draggables', () => {
  test('Triggering a reset in the onSettle callback should correctly set the values', resolve => {
    const draggable = createDraggable('#target-id', {
      container: '#css-tests',
      onSettle: self => {
        self.reset();
        expect(utils.get('#target-id', 'x', false)).to.equal(0);
        expect(utils.get('#target-id', 'y', false)).to.equal(0);
        resolve();
      }
    });
    draggable.animate.translateX(100, 10);
    draggable.animate.translateY(100, 10);
  });

  test('Reverting a draggable should properly disconect the ResizeObserver attached to it', resolve => {
    const [ $container ] = utils.$('#css-tests');
    let resizes = 0;
    const draggable = createDraggable('#target-id', {
      container: $container,
      onResize: () => {
        resizes++;
      }
    });
    draggable.revert();
    setTimeout(() => {
      $container.style.width = '100px';
    }, 1)
    setTimeout(() => {
      expect(resizes).to.equal(0);
      resolve();
    }, 200)
  });

  test('onUpdate should only trigger when the dragged element actually moves', resolve => {
    const [ $target ] = utils.$('#target-id');
    const [ $container ] = utils.$('#css-tests');
    let updates = 0;
    let grabbed = 0;
    let dragged = 0;
    let released = 0;

    const draggable = createDraggable($target, {
      container: $container,
      onUpdate: self => {
        updates++;
        if (self.deltaX || self.deltaY) {
          console.log('only called whe the draggable position updates');
        }
      },
      onGrab: () => grabbed++,
      onDrag: () => dragged++,
      onRelease: () => released++
    });

    expect(updates).to.equal(0);

    const createMouseEvent = ($target, name, x, y) => $target.dispatchEvent(new MouseEvent('mouse' + name, {
      clientX: x,
      clientY: y,
      bubbles: true,
      cancelable: true
    }));

    createMouseEvent($target, 'down', 0, 0);

    createTimer({
      onBegin: () => createMouseEvent(document, 'move', 10, 10),
      onUpdate: () => createMouseEvent(document, 'move', 10, 10),
      onComplete: () => {
        createMouseEvent(document, 'move', 10, 10);
        createMouseEvent(document, 'up', 10, 10);
        expect(grabbed).to.equal(1);
        expect(released).to.equal(1);
        expect(updates).to.equal(1);
        resolve();
        draggable.revert();
      },
      duration: 50,
    });
  });
});
