// Proxy tới OpenAI để widget "Chị Lan" trả lời khách
export default async function handler(req, res) {
  const { text } = JSON.parse(req.body);
  const r = await fetch('https://api.openai.com/v1/chat/completions', {
    method: 'POST',
    headers: { Authorization: `Bearer ${process.env.OPENAI_API_KEY}`, 'Content-Type': 'application/json' },
    body: JSON.stringify({
      model: 'gpt-x',
      messages: [
        { role: 'system', content: 'Bạn là chị Lan, nhân viên tư vấn của Cà phê Đồi Sương. Xưng chị, thân thiện.' },
        { role: 'user', content: text }
      ]
    })
  });
  const data = await r.json();
  res.json({ reply: data.choices[0].message.content });
}
