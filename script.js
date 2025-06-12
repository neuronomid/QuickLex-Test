// script.js

document.addEventListener('DOMContentLoaded', () => {
  const planToggle = document.getElementById('plan-toggle');
  const themeIcon  = document.getElementById('theme-icon');
  const searchIcon = document.getElementById('searchIcon');
  const container  = document.getElementById('container');
  const body       = document.body;
  const input      = document.getElementById('word-input');
  const result     = document.getElementById('result');

  const QUICK_URL = 'https://celebrated-beauty-production.up.railway.app/webhook/dce640b0-1af0-48b4-b8bf-1bd6f5c6f9c3';
  const PRO_URL   = 'https://celebrated-beauty-production.up.railway.app/webhook/aee5dce3-dcef-4660-9e1b-668d7028fc1c';

  // Quick ↔ Pro
  planToggle.addEventListener('change', () => {
    container.classList.toggle('pro-mode', planToggle.checked);
  });

  // Light ↔ Dark with immediate theme toggle and rotate animation
  themeIcon.addEventListener('click', () => {
    const enteringDark = !body.classList.contains('dark-mode');
    // Immediately toggle the theme
    body.classList.toggle('dark-mode', enteringDark);
    body.classList.toggle('light-mode', !enteringDark);

    // Choose animation class
    const animClass = enteringDark ? 'animate-sun' : 'animate-moon';
    themeIcon.classList.add(animClass);

    // When rotation animation ends, swap the icon image
    themeIcon.addEventListener('animationend', function handler() {
      themeIcon.removeEventListener('animationend', handler);
      themeIcon.classList.remove(animClass);
      themeIcon.src = enteringDark ? 'moon.svg' : 'sun.svg';
      themeIcon.alt = enteringDark ? 'Dark Mode' : 'Light Mode';
    }, { once: true });
  });

  // Search on 🔎 click or Enter
  function doSearch() {
    const word = input.value.trim();
    if (!word) return;
    search(word);
  }
  searchIcon.addEventListener('click', doSearch);
  input.addEventListener('keyup', e => {
    if (e.key === 'Enter') doSearch();
  });

  // POST + render response
  async function search(word) {
    result.textContent = 'Loading…';
    const url = planToggle.checked ? PRO_URL : QUICK_URL;
    try {
      const res = await fetch(url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ text: word })
      });
      if (!res.ok) throw new Error(res.statusText || 'Load failed');
      let txt = await res.text();

      // break before emoji lines
      txt = txt.replace(/(^|\n)(?=.*(?:✏️|☑️|⚪️))/g, '\n');

      const emojiPattern = /^(✏️|☑️|⚪️)/;
      const lines = txt.split('\n');
      result.innerHTML = lines.map(line => {
        const isRTL   = /[\u0600-\u06FF]/.test(line);
        const isEmoji = emojiPattern.test(line.trim());
        return `<span dir="${isRTL ? 'rtl' : 'ltr'}"${isEmoji ? ' class="emoji-header"' : ''}>${line}</span>`;
      }).join('\n');
    } catch (err) {
      result.textContent = 'Error: ' + (err.message || 'Load failed');
    }
  }
});
