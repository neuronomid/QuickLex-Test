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

  // Quick ↔ Pro toggling
  planToggle.addEventListener('change', () => {
    container.classList.toggle('pro-mode', planToggle.checked);
  });

  // Light ↔ Dark with rotate animation
  themeIcon.addEventListener('click', () => {
    const enteringDark = !body.classList.contains('dark-mode');
    body.classList.toggle('dark-mode', enteringDark);
    body.classList.toggle('light-mode', !enteringDark);
    themeIcon.src = enteringDark ? 'moon.svg' : 'sun.svg';
    themeIcon.alt = enteringDark ? 'Dark Mode' : 'Light Mode';
    const animClass = enteringDark ? 'animate-sun' : 'animate-moon';
    themeIcon.classList.add(animClass);
    themeIcon.addEventListener('animationend', function handler() {
      themeIcon.classList.remove(animClass);
      themeIcon.removeEventListener('animationend', handler);
    }, { once: true });
  });

  // Search on 🔎 click or Enter key (keydown for mobile)
  function doSearch() {
    const word = input.value.trim();
    if (!word) return;
    search(word);
    // Clear input and blur to hide keyboard
    input.value = '';
    input.blur();
  }
  searchIcon.addEventListener('click', doSearch);
  input.addEventListener('keydown', e => {
    if (e.key === 'Enter') {
      e.preventDefault();
      doSearch();
    }
  });

  // Fetch definition/translation and render
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
      // Insert newline before emoji lines
      txt = txt.replace(/(^|\n)(?=.*(?:✏️|☑️|⚪️))/g, '\n');
      const emojiPattern = /^(✏️|☑️|⚪️)/;
      const lines = txt.split('\n');
      result.innerHTML = lines.map(line => {
        const isRTL   = /[\u0600-\u06FF]/.test(line);
        const isEmoji = emojiPattern.test(line.trim());
        return `<span dir="${isRTL ? 'rtl' : 'ltr'}"${isEmoji ? ' class=\"emoji-header\"' : ''}>${line}</span>`;
      }).join('\n');
    } catch (err) {
      result.textContent = 'Error: ' + (err.message || 'Load failed');
    }
  }
});
