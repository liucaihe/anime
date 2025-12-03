import { createLayout, utils, createScope, stagger, spring } from '../../../dist/modules/index.js';

const duration = 1000;

const [ $animateAll ] = utils.$('#animate-all');
const [ $revertAll ] = utils.$('#revert-all');

$animateAll.addEventListener('click', () => {
  tests.forEach(test => {
    test.data.$button.click();
  })
})

$revertAll.addEventListener('click', () => {
  tests.forEach(test => {
    test.revert();
  })
})

const tests = [
  createScope({ root: '#simple-fixed-root' }).add(({ data }) => {
    data.$button = utils.$('button')[0];
    data.layout = createLayout('.container');
    data.$button.addEventListener('click', () => {
      data.layout.update(({ root }) => {
        root.classList.toggle('vertical');
      }, { duration })
    });
  }),
  createScope({ root: '#simple-absolute-root' }).add(({ data }) => {
    data.$button = utils.$('button')[0];
    data.layout = createLayout('.container');
    data.$button.addEventListener('click', () => {
      data.layout.update(({ root }) => {
        root.classList.toggle('vertical');
      }, { duration })
    });
  }),
  createScope({ root: '#simple-sticky-root' }).add(({ data }) => {
    data.$button = utils.$('button')[0];
    data.layout = createLayout('.container');
    data.$button.addEventListener('click', () => {
      data.layout.update(({ root }) => {
        root.classList.toggle('vertical');
      }, { duration })
    });
  }),
  createScope({ root: '#simple-relative-root' }).add(({ data }) => {
    data.$button = utils.$('button')[0];
    data.layout = createLayout('.container');
    data.$button.addEventListener('click', () => {
      data.layout.update(({ root }) => {
        root.classList.toggle('vertical');
      }, { duration })
    });
  }),
  createScope({ root: '#simple-static-root' }).add(({ data }) => {
    data.$button = utils.$('button')[0];
    data.layout = createLayout('.container');
    data.$button.addEventListener('click', () => {
      data.layout.update(({ root }) => {
        root.classList.toggle('vertical');
      }, { duration })
    });
  }),
  createScope({ root: '#specific-children' }).add(({ data }) => {
    data.$button = utils.$('button')[0];
    data.layout = createLayout('.container', {
      children: ['.child', '.child > span'],
    });
    data.$button.addEventListener('click', () => {
      data.layout.update(({ root }) => {
        root.classList.toggle('vertical');
      }, { duration })
    });
  }),
  createScope({ root: '#specific-properties' }).add(({ data }) => {
    data.$button = utils.$('button')[0];
    data.layout = createLayout('.container', {
      properties: ['background-color', 'color'],
    });
    data.$button.addEventListener('click', () => {
      data.layout.update(({ root }) => {
        root.classList.toggle('vertical');
      }, { duration })
    });
  }),
  createScope({ root: '#hide-display-none' }).add(({ data }) => {
    data.$button = utils.$('button')[0];
    data.layout = createLayout('.container', {
      children: ['.child', '.child > span'],
    });
    data.$button.addEventListener('click', () => {
      data.layout.update(({ root }) => {
        const $child = root.querySelector('.child');
        root.classList.toggle('vertical');
        $child.style.display = $child.style.display === 'none' ? 'block' : 'none';
      }, { duration })
    });
  }),
  createScope({ root: '#hide-visibility-hidden' }).add(({ data }) => {
    data.$button = utils.$('button')[0];
    data.layout = createLayout('.container', {
      children: ['.child', '.child > span'],
    });
    data.$button.addEventListener('click', () => {
      data.layout.update(({ root }) => {
        const $child = root.querySelector('.child');
        root.classList.toggle('vertical');
        $child.style.visibility = $child.style.visibility === 'hidden' ? 'visible' : 'hidden';
      }, { duration })
    });
  }),
  createScope({ root: '#frozen-properties' }).add(({ data }) => {
    data.$button = utils.$('button')[0];
    data.layout = createLayout('.container', {
      children: ['.child', '.child > span'],
      frozen: {
        color: 'var(--red-1)',
        borderColor: 'var(--red-1)',
        filter: 'blur(5px)',
      }
    });
    data.$button.addEventListener('click', () => {
      data.layout.update(({ root }) => {
        root.classList.toggle('vertical');
      }, { duration, frozen: { color: 'var(--green-1)' } })
    });
  }),
  createScope({ root: '#removed-properties' }).add(({ data }) => {
    data.$button = utils.$('button')[0];
    data.layout = createLayout('.container', {
      children: ['.child', '.child > span'],
      properties: ['background-color'],
      removed: {
        transform: 'rotate(45deg) scale(0)',
      },
    });
    data.$button.addEventListener('click', () => {
      data.layout.update(({ root }) => {
        const $child = root.querySelector('.child');
        root.classList.toggle('vertical');
        $child.style.display = $child.style.display === 'none' ? 'block' : 'none';
      }, { duration, removed: { 'background-color': 'var(--red-1)' } })
    });
  }),
  createScope({ root: '#added-properties' }).add(({ data }) => {
    data.$button = utils.$('button')[0];
    data.layout = createLayout('.container', {
      properties: ['background-color'],
      children: ['.child', '.child > span'],
      added: {
        transform: 'rotate(-45deg) scale(0)',
      },
    });
    data.$button.addEventListener('click', () => {
      data.layout.update(({ root }) => {
        root.classList.toggle('vertical');
        const $child = root.querySelector('.child');
        $child.style.display = $child.style.display === 'none' ? 'block' : 'none';
      }, { duration, added: { 'background-color': 'var(--green-1)' } })
    });
  }),
  createScope({ root: '#custom-timings' }).add(({ data }) => {
    data.$button = utils.$('button')[0];
    data.layout = createLayout('.container', {
      duration: 1000,
      ease: 'outExpo',
    });
    data.$button.addEventListener('click', () => {
      const isVertical = data.layout.root.classList.contains('vertical');
      data.layout.update(({ root }) => {
        root.classList.toggle('vertical');
      }, {
        delay: stagger([0, 400], { from: isVertical ? 'last' : 'first' }),
        duration,
      })
    });
  }),
  createScope({ root: '#spring-ease' }).add(({ data }) => {
    data.$button = utils.$('button')[0];
    data.layout = createLayout('.container', {
      duration: 1000,
      ease: spring(),
      delay: stagger(25)
    });
    data.$button.addEventListener('click', () => {
      data.layout.update(({ root }) => {
        root.classList.toggle('vertical');
      }, { duration })
    });
  }),
  createScope({ root: '#layout-id' }).add(({ data }) => {
    data.$button = utils.$('button')[0];
    data.layout = createLayout('.container');
    data.$button.addEventListener('click', () => {
      data.layout.update(({ root }) => {
        root.classList.toggle('vertical');
      }, { duration })
    });
  }),
  createScope({ root: '#swap-outside-fixed-root' }).add(({ root, data }) => {
    data.$button = utils.$('button')[0];
    data.layout = createLayout('.demo', {
      delay: stagger([0, 100]),
    });
    data.$button.addEventListener('click', () => {
      const $newContainer = root.querySelector('.container.target-container');
      const $oldContainer = root.querySelector('.container:not(.target-container)');
      data.layout.update(({root}) => {
        $newContainer.classList.remove('target-container');
        $oldContainer.classList.add('target-container');
      }, { duration })
    });
  }),
  createScope({ root: '#swap-inside-root' }).add(({ data }) => {
    data.$button = utils.$('button')[0];
    data.layout = createLayout('.demo');
    data.$button.addEventListener('click', () => {
      data.layout.update(({ root }) => {
        root.querySelectorAll('.container').forEach($container => $container.classList.toggle('vertical'));
        const $child = root.querySelector('.child');
        const $parent = $child.parentElement;
        const $nextParent = $parent.nextElementSibling || $parent.previousElementSibling;
        $parent.style.zIndex = '0';
        $nextParent.style.zIndex = '1';
        $nextParent.appendChild($child);
      }, { duration })
    });
  }),
  createScope({ root: '#swap-outside-root' }).add(({ root, data }) => {
    data.$button = utils.$('button')[0];
    data.layout = createLayout('.container-b', {
      children: ['.container', '.child', '.child > span'],
      delay: stagger([0, 100]),
    });
    data.$button.addEventListener('click', () => {
      const $newContainer = root.querySelector('.container.target-container');
      const $oldContainer = root.querySelector('.container:not(.target-container)');
      data.layout.update(({root}) => {
        root.classList.toggle('vertical');
        $newContainer.classList.remove('target-container');
        $oldContainer.classList.add('target-container');
      }, { duration })
    });
  }),
]