import { getFirestore, collection, addDoc } from 'firebase/firestore';
// Lưu khách đăng ký nhận ưu đãi vào Firestore
export default async function handler(req, res) {
  const { name, email, phone, marketing } = req.body;
  await addDoc(collection(getFirestore(), 'subscribers'), { name, email, phone, marketing });
  res.redirect('/?subscribed=1');
}
