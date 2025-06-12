const webhookQuick = 'https://celebrated-beauty-production.up.railway.app/webhook/dce640b0-1af0-48b4-b8bf-1bd6f5c6f9c3';
const webhookPro = 'https://celebrated-beauty-production.up.railway.app/webhook/aee5dce3-dcef-4660-9e1b-668d7028fc1c';

const input = document.getElementById('wordInput');
const cancelBtn = document.getElementById('cancelBtn');
const doneBtn = document.getElementById('doneBtn');
const responseArea = document.getElementById('responseArea');
const toggle = document.getElementById('modeToggle');
const container = document.getElementById('mainContainer');

cancelBtn.onclick = () => {
  input.value = '';
  responseArea.innerHTML = '';
  input.focus();
};

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

    // فقط یک \n قبل از هر ایموجی موردنظر
    text = text.replace(/(^|\n)(?=.*(?:✏️|☑️|⚪️))/g, '\n');

    // هر خط را span کن، اگر با ایموجی دلخواه شروع شد، کلاس بده
    const emojiPattern = /^(✏️|☑️|⚪️)/;
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

doneBtn.onclick = doFetch;

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

if ('serviceWorker' in navigator) {
  navigator.serviceWorker.register('sw.js');
}
