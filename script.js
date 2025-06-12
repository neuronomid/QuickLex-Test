document.addEventListener('DOMContentLoaded', () => {
  const planToggle = document.getElementById('plan-toggle');
  const themeIcon = document.getElementById('theme-icon');
  const container = document.getElementById('container');
  const body = document.body;
  const input = document.getElementById('word-input');
  const result = document.getElementById('result');

  // ۱) حالت Quick↔Pro
  planToggle.addEventListener('change', () => {
    container.classList.toggle('pro-mode', planToggle.checked);
  });

  // ۲) حالت Light↔Dark
  themeIcon.addEventListener('click', () => {
    const dark = body.classList.toggle('dark-mode');
    body.classList.toggle('light-mode', !dark);
    themeIcon.src = dark ? 'moon.svg' : 'sun.svg';
    themeIcon.alt = dark ? 'Dark Mode' : 'Light Mode';
  });

  // ۳) جستجو با Enter
  input.addEventListener('keyup', e => {
    if (e.key === 'Enter') {
      const word = input.value.trim();
      if (!word) return;
      search(word);
    }
  });

  function search(word) {
    // اینجا کد واقعی جستجو رو بذار
    result.textContent = `Searching for: "${word}"…`;
  }
});
