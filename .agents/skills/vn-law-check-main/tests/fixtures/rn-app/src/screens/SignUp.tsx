import { TextInput, Button } from 'react-native';
import analytics from '@react-native-firebase/analytics';

export function SignUp({ navigation }) {
  return (
    <>
      <TextInput placeholder="Email" keyboardType="email-address" />
      <TextInput placeholder="Số điện thoại" keyboardType="phone-pad" />
      <Button title="Đăng ký" onPress={() => { analytics().logSignUp({ method: 'email' }); navigation.navigate('Home'); }} />
      <Button title="Đã có tài khoản? Đăng nhập" onPress={() => navigation.navigate('/login')} />
    </>
  );
}
