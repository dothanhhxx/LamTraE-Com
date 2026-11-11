document.getElementById('pay').onclick = async () => {
  const res = await fetch('/api/vnpay/create', { method: 'POST' });
  const { url } = await res.json();
  window.location.href = url;
};
