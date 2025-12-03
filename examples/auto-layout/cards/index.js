import { createLayout, animate, utils, stagger } from '../../../dist/modules/index.js';

const groups = [
  "Reactive nonmetal",
  "Noble gas",
  "Alkali metal",
  "Alkaline earth metal",
  "Metalloid",
  "Post-transition metal",
  "Transition metal",
  "Lanthanide",
  "Actinide",
  "Unknown"
];

const colors = [
  "red",
  "corail",
  "yellow",
  "citrus",
  "lime",
  "green",
  "emerald",
  "turquoise",
  "cyan",
  "sega"
];

const elements = [
  "H","Hydrogen","Lightest element ",0,1,1,
  "He","Helium","Inert gas ",1,18,1,
  "Li","Lithium","Soft reactive metal ",2,1,2,
  "Be","Beryllium","Hard light metal ",3,2,2,
  "B","Boron","Brittle metalloid ",4,13,2,
  "C","Carbon","Basis of life ",0,14,2,
  "N","Nitrogen","Major air component ",0,15,2,
  "O","Oxygen","Supports combustion ",0,16,2,
  "F","Fluorine","Most electronegative ",0,17,2,
  "Ne","Neon","Glows in signs ",1,18,2,
  "Na","Sodium","Reacts with water ",2,1,3,
  "Mg","Magnesium","Light structural metal ",3,2,3,
  "Al","Aluminium","Common light metal ",5,13,3,
  "Si","Silicon","Used in chips ",4,14,3,
  "P","Phosphorus","Essential for life ",0,15,3,
  "S","Sulfur","Yellow nonmetal ",0,16,3,
  "Cl","Chlorine","Green gas disinfectant ",0,17,3,
  "Ar","Argon","Inert in air ",1,18,3,
  "K","Potassium","Reactive soft metal ",2,1,4,
  "Ca","Calcium","Bone component ",3,2,4,
  "Sc","Scandium","Rare light metal ",6,3,4,
  "Ti","Titanium","Strong light metal ",6,4,4,
  "V","Vanadium","Steel alloys ",6,5,4,
  "Cr","Chromium","Chromium plating ",6,6,4,
  "Mn","Manganese","Steel additive ",6,7,4,
  "Fe","Iron","Structural metal ",6,8,4,
  "Co","Cobalt","Magnetic metal ",6,9,4,
  "Ni","Nickel","Corrosion-resistant ",6,10,4,
  "Cu","Copper","Conductive metal ",6,11,4,
  "Zn","Zinc","Galvanizing metal ",5,12,4,
  "Ga","Gallium","Melts in hand ",5,13,4,
  "Ge","Germanium","Semiconductor ",4,14,4,
  "As","Arsenic","Toxic metalloid ",4,15,4,
  "Se","Selenium","Photoconductor ",0,16,4,
  "Br","Bromine","Red-brown liquid ",0,17,4,
  "Kr","Krypton","Inert gas ",1,18,4,
  "Rb","Rubidium","Very reactive metal ",2,1,5,
  "Sr","Strontium","Red flame color ",3,2,5,
  "Y","Yttrium","Used in phosphors ",6,3,5,
  "Zr","Zirconium","Corrosion-resistant ",6,4,5,
  "Nb","Niobium","Superconducting alloys ",6,5,5,
  "Mo","Molybdenum","High-strength alloys ",6,6,5,
  "Tc","Technetium","Radioactive metal ",6,7,5,
  "Ru","Ruthenium","Platinum-group metal ",6,8,5,
  "Rh","Rhodium","Catalyst metal ",6,9,5,
  "Pd","Palladium","Catalyst & jewelry ",6,10,5,
  "Ag","Silver","Precious metal ",6,11,5,
  "Cd","Cadmium","Batteries, toxic ",5,12,5,
  "In","Indium","Used in displays ",5,13,5,
  "Sn","Tin","Solder component ",5,14,5,
  "Sb","Antimony","Flame retardants ",4,15,5,
  "Te","Tellurium","Alloying agent ",4,16,5,
  "I","Iodine","Purple halogen ",0,17,5,
  "Xe","Xenon","Bright discharge lamps ",1,18,5,
  "Cs","Cesium","Very soft, reactive ",2,1,6,
  "Ba","Barium","Contrast agents ",3,2,6,
  "Hf","Hafnium","Neutron absorber ",6,4,6,
  "Ta","Tantalum","Capacitor metal ",6,5,6,
  "W","Tungsten","High melting point ",6,6,6,
  "Re","Rhenium","High-temp superalloys ",6,7,6,
  "Os","Osmium","Very dense metal ",6,8,6,
  "Ir","Iridium","Corrosion-resistant ",6,9,6,
  "Pt","Platinum","Precious catalyst ",6,10,6,
  "Au","Gold","Precious yellow metal ",6,11,6,
  "Hg","Mercury","Liquid metal ",5,12,6,
  "Tl","Thallium","Toxic heavy metal ",5,13,6,
  "Pb","Lead","Dense soft metal ",5,14,6,
  "Bi","Bismuth","Low-toxicity heavy metal ",5,15,6,
  "Po","Polonium","Highly radioactive ",4,16,6,
  "At","Astatine","Rare halogen ",0,17,6,
  "Rn","Radon","Radioactive gas ",1,18,6,
  "Fr","Francium","Extremely rare ",2,1,7,
  "Ra","Radium","Highly radioactive ",3,2,7,
  "Rf","Rutherfordium","Synthetic element ",6,4,7,
  "Db","Dubnium","Synthetic element ",6,5,7,
  "Sg","Seaborgium","Synthetic element ",6,6,7,
  "Bh","Bohrium","Synthetic element ",6,7,7,
  "Hs","Hassium","Synthetic element ",6,8,7,
  "Mt","Meitnerium","Superheavy element ",9,9,7,
  "Ds","Darmstadtium","Superheavy element ",9,10,7,
  "Rg","Roentgenium","Superheavy element ",9,11,7,
  "Cn","Copernicium","Superheavy element ",9,12,7,
  "Nh","Nihonium","Superheavy element ",9,13,7,
  "Fl","Flerovium","Superheavy element ",9,14,7,
  "Mc","Moscovium","Superheavy element ",9,15,7,
  "Lv","Livermorium","Superheavy element ",9,16,7,
  "Ts","Tennessine","Superheavy element ",9,17,7,
  "Og","Oganesson","Superheavy element ",9,18,7,
  "La","Lanthanum","First lanthanide ",7,3,8,
  "Ce","Cerium","Polishing powders ",7,4,8,
  "Pr","Praseodymium","Magnet alloys ",7,5,8,
  "Nd","Neodymium","Strong magnets ",7,6,8,
  "Pm","Promethium","Radioactive ",7,7,8,
  "Sm","Samarium","Magnets & reactors ",7,8,8,
  "Eu","Europium","Red phosphors ",7,9,8,
  "Gd","Gadolinium","MRI contrast ",7,10,8,
  "Tb","Terbium","Green phosphors ",7,11,8,
  "Dy","Dysprosium","High-temp magnets ",7,12,8,
  "Ho","Holmium","Magnetic research ",7,13,8,
  "Er","Erbium","Optical fibers ",7,14,8,
  "Tm","Thulium","X-ray devices ",7,15,8,
  "Yb","Ytterbium","Laser materials ",7,16,8,
  "Lu","Lutetium","Catalysts, PET scans ",7,17,8,
  "Ac","Actinium","Strongly radioactive ",8,3,9,
  "Th","Thorium","Nuclear fuel ",8,4,9,
  "Pa","Protactinium","Rare radioactive ",8,5,9,
  "U","Uranium","Nuclear fuel ",8,6,9,
  "Np","Neptunium","Synthetic actinide ",8,7,9,
  "Pu","Plutonium","Nuclear material ",8,8,9,
  "Am","Americium","Smoke detectors ",8,9,9,
  "Cm","Curium","Synthetic actinide ",8,10,9,
  "Bk","Berkelium","Research element ",8,11,9,
  "Cf","Californium","Neutron source ",8,12,9,
  "Es","Einsteinium","Highly radioactive ",8,13,9,
  "Fm","Fermium","Synthetic element ",8,14,9,
  "Md","Mendelevium","Synthetic element ",8,15,9,
  "No","Nobelium","Synthetic element ",8,16,9,
  "Lr","Lawrencium","Synthetic element ",8,17,9
];

const latin = [
  "lorem", "ipsum", "dolor", "sit", "amet", "consectetur", "adipiscing", "elit",
  "sed", "do", "eiusmod", "tempor", "incididunt", "ut", "labore", "et",
  "dolore", "magna", "aliqua", "enim", "minim", "veniam", "quis", "nostrud",
  "exercitation", "ullamco", "laboris", "nisi", "aliquip", "ex", "ea",
  "commodo", "consequat", "duis", "aute", "irure", "dolor", "in", "reprehenderit", "voluptate"
]

let nextElementIndex = 0;

const buttons = utils.$('.controls button');
const toggles = utils.$('.controls button.toggle');
const [ $root ] = utils.$('#root');

function loremIpsum(words = 100) {
  let text = [];
  for (let i = 0; i < words; i++) {
    const w = latin[Math.floor(Math.random() * latin.length)];
    text.push(w);
  }
  let sentence = text.join(" ");
  return sentence.charAt(0).toUpperCase() + sentence.slice(1) + ".";
}

const actions = {
  add: () => {
    if (nextElementIndex >= elements.length) return;
    const template = utils.$('#element')[0];
    const $removed = utils.$('#root .element.is-removed')[0];
    let $elementTarget = $removed;
    if (!$elementTarget) {
      const clone = template.content.cloneNode(true);
      const $element = clone.querySelector('.element');
      if (!$element) return;
      const $image = $element.querySelector('.element-symbol');
      // const $title = $element.querySelector('.element-title');
      // const $group = $element.querySelector('.element-group');
      // const $intro = $element.querySelector('.element-intro-description');
      // const $description = $element.querySelector('.element-more-info');
      $image.textContent = elements[nextElementIndex + 0];
      // $title.textContent = elements[nextElementIndex + 1];
      // $group.textContent = groups[elements[nextElementIndex + 3]];
      // $intro.textContent = elements[nextElementIndex + 2] + loremIpsum(6);
      $element.dataset.x = elements[nextElementIndex + 4];
      $element.dataset.y = elements[nextElementIndex + 5];
      $element.dataset.color = elements[nextElementIndex + 3];
      $element.style.gridColumn = $element.dataset.x;
      $element.style.gridRow = $element.dataset.y;
      // $description.textContent = loremIpsum(utils.random(100, 150));
      nextElementIndex += 6;
      $elementTarget = $element;
      $root.appendChild(clone);
    }
    $elementTarget.classList.remove('is-removed');
  },
  remove: test=> {
    const $randomCard = utils.$('#root .element:not(.is-removed)').pop();
    if ($randomCard) $randomCard.classList.add('is-removed');
    // if ($randomCard) $randomCard.remove();
  }
}

const initialCards = elements.length;
// const initialCards = 10;
for (let i = 0; i < initialCards && nextElementIndex < elements.length; i++) {
  actions.add();
}

const elementsLayout = createLayout($root, {
  children: ['.element'],
  added: {
    transform: `translateY(150%) scale(.5)`,
  },
  removed: {
    opacity: 0,
    transform: (_, i) => {
      const seededRandom = utils.createSeededRandom(i);
      const direction = seededRandom(0, 1) ? -1 : 1;
      return `translateX(${150 * direction}%) rotate(${seededRandom(35, 90) * direction}deg)`;
    },
  }
});

buttons.forEach($button => {
  $button.onclick = () => {
    const seededRandom = utils.createSeededRandom(0);
    const isToggle = $button.classList.contains('toggle');
    const isAction = $button.classList.contains('action');
    const buttonId = $button.id;
    elementsLayout.update(() => {
      if (isToggle) {
        toggles.forEach(toggle => toggle.classList.remove('is-active'));
        $button.classList.add('is-active');
      } else if (isAction) {
        actions[buttonId]();
      }
      const elements = utils.$('#root .element:not(.is-removed)');
      const layoutType = utils.$('button.is-active')[0].id;
      const total = elements.length;
      const depthSteps = 1000;

      $root.dataset.layout = layoutType;

      if (total && layoutType === 'sphere') {
        const radius = 220;
        elements.forEach((el, i) => {
          const phi = Math.acos(-1 + (2 * i) / total);
          const theta = Math.sqrt(total * Math.PI) * phi;
          const sinPhi = Math.sin(phi);
          const x = radius * sinPhi * Math.cos(theta);
          const y = radius * Math.cos(phi);
          const z = 400 + (radius * sinPhi * Math.sin(theta));
          const yaw = Math.atan2(x, z);
          const pitch = -Math.atan2(y, Math.hypot(x, z));
          el.style.transform = `translate3d(${x}px, ${y}px, ${z}px) rotateY(${yaw}rad) rotateX(${pitch}rad)`;

          const normalizedZ = (z + radius) / (radius * 2);     // 0 → far back, 1 → closest
          el.style.zIndex = Math.round(normalizedZ * depthSteps);
        });
      }
    }, {
      duration: isAction ? 1000 : 1000,
      ease: isAction ? 'out(3)' : 'inOut(3)',
      delay: isAction ? 0 : stagger([0, 2000])
    });
  }
});
