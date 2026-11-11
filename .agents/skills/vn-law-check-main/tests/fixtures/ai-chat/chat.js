document.getElementById('send').onclick = async () => {
  const text = document.getElementById('msg').innerText;
  const res = await fetch('https://api.openai.com/v1/chat/completions', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ model: 'gpt-x', messages: [{ role: 'user', content: text }] })
  });
  const data = await res.json();
  document.getElementById('chat').innerText += data.choices[0].message.content;
};
