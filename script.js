document.addEventListener('DOMContentLoaded', () => {
  const planToggle = document.getElementById('plan-toggle');
  const themeIcon  = document.getElementById('theme-icon');
  const container  = document.getElementById('container');
  const body       = document.body;
  const input      = document.getElementById('word-input');
  const cancelBtn  = document.getElementById('cancelBtn');
  const doneBtn    = document.getElementById('doneBtn');
  const result     = document.getElementById('result');

  // Quick ↔ Pro
  planToggle.addEventListener('change', () => {
    container.classList.toggle('pro-mode', planToggle.checked);
  });

  // Light ↔ Dark
  themeIcon.addEventListener('click', () => {
    const isDark = body.classList.toggle('dark-mode');
    body.classList.toggle('light-mode', !isDark);
    themeIcon.src = isDark ? 'moon.svg' : 'sun.svg';
    themeIcon.alt = isDark ? 'Dark Mode' : 'Light Mode';
  });

  // Cancel
  cancelBtn.addEventListener('click', () => {
    input.value = '';
    result.textContent = '';
  });

  // Done (click یا Enter)
  function doSearch() {
    const word = input.value.trim();
    if (word) search(word);
  }
  doneBtn.addEventListener('click', doSearch);
  input.addEventListener('keyup', e => {
    if (e.key === 'Enter') doSearch();
  });

  // تابع جستجو
  async function search(word) {
    result.textContent = 'Loading…';
    try {
      const res = await fetch(
        'https://celebrated-beauty-production.up.railway.app/webhook/8251cd3e-edb7-496b-8bf85cccda89', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ text: word })
        }
      );
      if (!res.ok) throw new Error(res.statusText);
      const data = await res.json();
      result.textContent = data.result ?? JSON.stringify(data, null, 2);
    } catch (err) {
      result.textContent = 'Error: ' + err.message;
    }
  }
});
