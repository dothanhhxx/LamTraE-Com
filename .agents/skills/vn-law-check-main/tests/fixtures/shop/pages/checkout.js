export async function pay(order) {
  // chuyển sang cổng VNPay
  window.location.href = `/api/vnpay/create?order=${order.id}`;
}
