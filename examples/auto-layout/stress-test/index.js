import {
  utils,
  createLayout,
} from '../../../dist/modules/index.js';

// Create nested grid structure
function createNestedGrid(level, maxLevel = 2) {
  const grid = document.createElement('div');
  grid.className = `grid-cell level-${level}`;
  grid.dataset.level = level;
  for (let i = 0; i < 10; i++) {
    const square = document.createElement('div');
    square.className = 'square';
    if (level < maxLevel - 1) {
      square.appendChild(createNestedGrid(level + 1, maxLevel));
    }

    grid.appendChild(square);
  }

  return grid;
}

// Shuffle a single grid
function shuffleGrid(grid, removeCount = 2) {
  const squares = Array.from(grid.children).filter(child =>
    child.classList.contains('square')
  );

  if (squares.length < removeCount) return;

  // Remove specified number of random elements
  for (let i = 0; i < removeCount && squares.length > 0; i++) {
    const randomIndex = Math.floor(Math.random() * squares.length);
    const toRemove = squares.splice(randomIndex, 1)[0];
    toRemove.remove();
  }

  // Add same number of new elements back
  const level = parseInt(grid.dataset.level);
  for (let i = 0; i < removeCount; i++) {
    const square = document.createElement('div');
    square.className = 'square';

    // If not at max level, maybe add nested grid
    if (level < 1 && Math.random() > 0.5) {
      square.appendChild(createNestedGrid(level + 1, 2));
    }

    grid.appendChild(square);
  }

  // Get the current number of squares for better layout calculation
  const currentSquares = grid.querySelectorAll(':scope > .square').length;

  utils.set('.square', {
    x: () => utils.random(-100, 100) + 'px',
    y: () => utils.random(-100, 100) + 'px',
    z: () => utils.random(-100, 100) + 'px',
    rotateX: () => utils.random(-45, 45),
    rotateY: () => utils.random(-45, 45),
    rotateZ: () => utils.random(-45, 45),
  })

  // Calculate columns and rows - favor fewer columns for taller appearance
  const cols = Math.max(2, Math.min(4, Math.floor(Math.sqrt(currentSquares) * 0.8)));
  const rows = Math.ceil(currentSquares / cols);

  // Change grid layout randomly - using fewer columns for taller appearance
  const layouts = [
    `repeat(${cols}, 1fr)`,
    `repeat(${Math.max(2, cols - 1)}, 1fr)`,
    'repeat(2, 1fr)',  // Tall with 2 columns
    'repeat(3, 1fr)',  // 3 columns
    'repeat(4, 1fr)',  // Maximum 4 columns
    '1fr 1fr',         // Two equal columns
    '2fr 1fr',         // Asymmetric two columns
    '1fr 2fr',         // Asymmetric two columns
    '1fr 1fr 1fr'      // Three equal columns
  ];

  grid.style.gridTemplateColumns = layouts[Math.floor(Math.random() * layouts.length)];

  // Set rows based on actual content - auto-sized
  const rowLayouts = [
    `repeat(${rows}, auto)`,           // Auto-sized rows based on content
    `repeat(${rows}, minmax(50px, 1fr))`, // Minimum height with flexibility
    `repeat(${Math.max(3, rows)}, auto)`, // At least 3 rows
    'repeat(auto-fit, minmax(50px, 1fr))', // Auto-fit rows
    '1fr 1fr 1fr',                     // 3 equal rows
    '1fr 2fr 1fr',                     // Middle emphasis
    'auto auto auto auto',             // 4 auto rows
    `repeat(${rows}, 1fr)`             // Equal distribution
  ];

  grid.style.gridTemplateRows = rowLayouts[Math.floor(Math.random() * rowLayouts.length)];

}

function shuffleAllGrids(removeCount = 2) {
  utils.set(document.body, {
    '--border-radius': utils.random(0, 32) + 'px',
    '--border-width': utils.random(1, 20) + 'px',
    // '--color': utils.randomPick(['#FF0000', '#FF00FF', '#0000FF']),
  });
  const allGrids = document.querySelectorAll('.grid-cell');
  allGrids.forEach(grid => shuffleGrid(grid, removeCount));

  // Also shuffle the root
  const root = document.getElementById('root');
  shuffleGrid(root, removeCount);
}

const root = document.getElementById('root');
for (let i = 0; i < 10; i++) {
  const square = document.createElement('div');
  square.className = 'square';
  // square.style.translate = `200px 300px`;
  square.appendChild(createNestedGrid(1, 2));
  root.appendChild(square);
}

shuffleAllGrids(0);

const layout = createLayout(root, { relative: true });

document.addEventListener('click', () => {
  layout.update($el => {
    shuffleAllGrids(2);
  });
});