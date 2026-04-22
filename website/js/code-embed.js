/* ============================================
   CODE-EMBED.JS — Accordion + code loader
   ============================================ */

function escapeHtml(str) {
  return str
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

// Simple C++ syntax highlight — no external lib needed
function highlightCpp(code) {
  const keywords = ['class','public','private','protected','void','int','float','bool',
    'true','false','return','if','else','while','for','const','struct','auto',
    'new','delete','nullptr','this','static','inline','include','pragma','define'];
  const types = ['Rectangle','Vector2','Color','Sound','Music','std::string',
    'std::vector','std::ostringstream'];

  let out = escapeHtml(code);

  // strings
  out = out.replace(/(&quot;[^&]*?&quot;)/g, '<span class="c-str">$1</span>');
  // single-line comments
  out = out.replace(/(\/\/[^\n]*)/g, '<span class="c-comment">$1</span>');
  // preprocessor
  out = out.replace(/^(#\w+)/gm, '<span class="c-pp">$1</span>');
  // keywords
  keywords.forEach(kw => {
    out = out.replace(new RegExp(`\\b(${kw})\\b`, 'g'), '<span class="c-kw">$1</span>');
  });
  // types
  types.forEach(t => {
    const safe = t.replace(':','\\:');
    out = out.replace(new RegExp(`\\b(${safe})\\b`, 'g'), '<span class="c-type">$1</span>');
  });
  // function calls  word(
  out = out.replace(/\b([A-Z][A-Za-z0-9_]*)\s*(?=\()/g, '<span class="c-fn">$1</span>');

  return out;
}

// Load code into a <code> element
async function loadCode(el) {
  const src = el.dataset.src;
  if (!src || el.dataset.loaded) return;
  try {
    const res = await fetch(src);
    const text = await res.text();
    el.innerHTML = highlightCpp(text);
    el.dataset.loaded = 'true';
  } catch (e) {
    el.textContent = '// Could not load source file.';
  }
}

// Accordion toggle
document.querySelectorAll('.accordion-toggle').forEach(btn => {
  const targetId = btn.dataset.target;
  const body = document.getElementById(targetId);
  if (!body) return;

  btn.addEventListener('click', () => {
    const isOpen = body.classList.contains('open');

    // Close all in same article first
    const article = btn.closest('.project-showcase');
    article.querySelectorAll('.accordion-body.open').forEach(b => {
      b.classList.remove('open');
      const sib = article.querySelector(`[data-target="${b.id}"]`);
      if (sib) sib.querySelector('.acc-icon').textContent = '▶';
    });

    if (!isOpen) {
      body.classList.add('open');
      btn.querySelector('.acc-icon').textContent = '▼';
      // Load code on first open
      const codeEl = body.querySelector('.cpp-code');
      if (codeEl) loadCode(codeEl);
    }
  });
});
