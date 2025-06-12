const webhookQuick = 'https://celebrated-beauty-production.up.railway.app/webhook/dce640b0-1af0-48b4-b8bf-1bd6f5c6f9c3';
const webhookPro   = 'https://celebrated-beauty-production.up.railway.app/webhook/aee5dce3-dcef-4660-9e1b-668d7028fc1c';

const input        = document.getElementById('wordInput');
const responseArea = document.getElementById('responseArea');
const toggle       = document.getElementById('modeToggle');
const container    = document.getElementById('mainContainer');
const modeBtn      = document.getElementById('modeBtn');
const modeIcon     = document.getElementById('modeIcon');

async function doFetch() {
  const word = input.value.trim();
  if (!word) return;
  responseArea.textContent = 'Loading...';
  const url = toggle.checked ? webhookPro : webhookQuick;
  try {
    const res = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ word })
    });
    let text = await res.text();

    // فقط یک \n قبل از هر ایموجی خاص
    text = text.replace(/(^|\n)(?=.*(?:✏️|☑️|⚪️)/g, '\n');

    // هر خط را span کن، اگر با ایموجی شروع شد، کلاس بده
    const emojiPattern = /^[\u2190-\u2BFF\u2600-\u27BF\uFE0F\u1F000-\u1FFFF]/;
    const lines = text.split('\n');
    responseArea.innerHTML = lines.map(line => {
      const isRTL = /[\u0600-\u06FF]/.test(line);
      const isEmoji = emojiPattern.test(line.trim());
      return `<span dir="${isRTL ? 'rtl' : 'ltr'}"${isEmoji ? ' class="emoji-header"' : ''}>${line}</span>`;
    }).join('\n');
    input.value = '';
    input.blur();
  } catch (err) {
    responseArea.textContent = 'Error: ' + err.message;
  }
}

input.addEventListener('keydown', e => {
  if (e.key === 'Enter') {
    e.preventDefault();
    doFetch();
    setTimeout(() => {
      input.blur();
    }, 200);
  }
});

toggle.addEventListener('change', () => {
  container.classList.toggle('pro-mode', toggle.checked);
});

// Mode toggle (Light/Dark)
let darkMode = false;
modeBtn.onclick = () => {
  darkMode = !darkMode;
  document.body.classList.toggle('dark', darkMode);

  // تغییر آیکون با انیمیشن
  modeIcon.style.transform = 'rotateY(90deg)';
  setTimeout(() => {
    modeIcon.src = darkMode ? 'moon_17822640.png' : 'brightness_6716602.png';
    modeIcon.alt = darkMode ? 'Dark mode' : 'Light mode';
    modeIcon.style.transform = 'rotateY(0deg)';
  }, 200);
};

if ('serviceWorker' in navigator) {
  navigator.serviceWorker.register('sw.js');
}
