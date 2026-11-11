const log = document.getElementById('chat-log');
document.getElementById('chat-input').addEventListener('keydown', async (e) => {
  if (e.key !== 'Enter') return;
  const text = e.target.value;
  e.target.value = '';
  log.innerHTML += `<p class="me">${text}</p>`;
  const res = await fetch('/api/chat', { method: 'POST', body: JSON.stringify({ text }) });
  const { reply } = await res.json();
  log.innerHTML += `<p class="lan">${reply}</p>`;
});
