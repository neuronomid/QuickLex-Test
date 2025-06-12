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

  planToggle.addEventListener('change', () => {
    container.classList.toggle('pro-mode', planToggle.checked);
  });

  themeIcon.addEventListener('click', () => {
    const isDark = body.classList.toggle('dark-mode');
    body.classList.toggle('light-mode', !isDark);
    themeIcon.src = isDark ? 'moon.svg' : 'sun.svg';
    themeIcon.alt = isDark ? 'Dark Mode' : 'Light Mode';
  });

  function doSearch() {
    const word = input.value.trim();
    if (!word) return;
    search(word);
  }
  searchIcon.addEventListener('click', doSearch);
  input.addEventListener('keyup', e => {
    if (e.key === 'Enter') doSearch();
  });

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
      const txt = await res.text();

      // اینجا فقط RTL/Farsi رو تشخیص می‌ده و برای هر سطر dir تنظیم می‌کنه
      const lines = txt.split('\n');
      result.innerHTML = lines
        .map(line => {
          const isRTL = /[\u0600-\u06FF]/.test(line);
          return `<span dir="${isRTL ? 'rtl' : 'ltr'}">${line}</span>`;
        })
        .join('');

    } catch (err) {
      result.textContent = 'Error: ' + (err.message || 'Load failed');
    }
  }
});
