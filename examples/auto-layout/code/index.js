import { createLayout, stagger } from '../../../../dist/modules/index.js';

const keywordSet = /^(const|let|var|function|return|if|else|for|while|new|this|true|false|null|undefined|async|await|import|export|from|class|extends)$/;
const tokenRegex = /(['"`])(?:\\.|[^\\])*?\1|[a-zA-Z_$][a-zA-Z0-9_$]*|\s+|[^a-zA-Z_$'"`\s]+/g;

function highlightCode(el) {
  const code = el.textContent;
  const tokens = code.match(tokenRegex) || [];
  const counts = {};
  let html = '';

  for (let i = 0; i < tokens.length; i++) {
    const t = tokens[i];
    const escaped = t.replace(/</g, '&lt;').replace(/>/g, '&gt;');

    // Whitespace - keep as is
    if (/^\s+$/.test(t)) {
      html += escaped;
      continue;
    }

    // Track occurrence count
    counts[t] = (counts[t] || 0) + 1;
    const dataAttr = `data-layout-id="${t}-${counts[t]}"`;

    // String
    if (/^['"`]/.test(t)) {
      html += `<span class="str" ${dataAttr}>${escaped}</span>`;
    }
    // Identifier
    else if (/^[a-zA-Z_$]/.test(t)) {
      const rest = tokens.slice(i + 1).join('').trimStart();
      const isFunction = rest.startsWith('(');
      const cls = keywordSet.test(t) ? 'kw' : isFunction ? 'fn' : 'var';
      html += `<span class="${cls}" ${dataAttr}>${escaped}</span>`;
    }
    // Punctuation/operators
    else {
      html += `<span class="op" ${dataAttr}>${escaped}</span>`;
    }
  }

  el.innerHTML = html;
}

document.querySelectorAll('code').forEach(highlightCode);

const layout = createLayout('.container', {
  children: ['code', 'span'],
  duration: 1500,
  delay: stagger([0, 250])
});

const animate = () => {
  return layout.update(({root}) => {
    root.classList.toggle('show-animejs');
  }).timeline.then(animate);
}

animate();