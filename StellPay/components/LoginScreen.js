import React, { useState } from 'react';
import { View, Text, TouchableOpacity, TextInput, StyleSheet } from 'react-native';
// import LinearGradient from 'react-native-linear-gradient';

const LoginScreen = ({ navigation }) => {
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [saveInfo, setSaveInfo] = useState(false);

  const handleLogin = () => {
    console.log('Phone:', phone);
    console.log('Password:', password);
    console.log('Save Info:', saveInfo);
    navigation.navigate('WalletScreen');
  };

  return (
    <View style={styles.container}>
      <View style={styles.content}>
        <Text style={styles.appName}>StellPay</Text>
        <Text style={styles.tagline}>All Your Finances Inside</Text>
        <Text style={styles.tagline}>a Fancy App</Text>

        <TextInput
          style={[styles.input, { borderColor: '#4CAF50' }]} // Green border
          placeholder="+1 566 344"
          placeholderTextColor="#ccc"
          value={phone}
          onChangeText={setPhone}
          keyboardType="phone-pad"
        />
        <TextInput
          style={[styles.input, { borderColor: '#4CAF50' }]} // Green border
          placeholder="Password"
          placeholderTextColor="#ccc"
          value={password}
          onChangeText={setPassword}
          secureTextEntry
        />

        <View style={styles.saveInfoContainer}>
          <TouchableOpacity
            style={styles.checkbox}
            onPress={() => setSaveInfo(!saveInfo)}
          >
            {saveInfo && <View style={styles.checkboxInner} />}
          </TouchableOpacity>
          <Text style={styles.saveInfoText}>Save my info?</Text>
        </View>

        <TouchableOpacity style={styles.loginButton} onPress={handleLogin}>
          <Text style={styles.buttonText}>LOGIN</Text>
        </TouchableOpacity>

        <TouchableOpacity onPress={() => navigation.navigate('ForgotPassword')}>
          <Text style={styles.forgotPasswordText}>Forgot Password?</Text>
        </TouchableOpacity>

        <View style={styles.orContainer}>
          <View style={styles.divider} />
          <Text style={styles.orText}>OR</Text>
          <View style={styles.divider} />
        </View>

        <TouchableOpacity style={styles.scanButton} onPress={() => {}}>
          <Text style={styles.buttonText}>Scan</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#000', // Dark background
  },
  content: {
    alignItems: 'center',
    width: '80%',
  },
  appName: {
    fontSize: 48,
    fontWeight: 'bold',
    color: '#fff', // White text
    marginBottom: 10,
    fontFamily: 'Arial',
  },
  tagline: {
    fontSize: 20,
    color: '#fff', // White text
    marginBottom: 50,
    fontFamily: 'Arial',
    textAlign: 'center',
  },
  input: {
    backgroundColor: 'rgba(255, 255, 255, 0.1)', // Light, transparent background
    paddingVertical: 15,
    paddingHorizontal: 20,
    borderRadius: 30,
    marginBottom: 20,
    width: '100%',
    color: '#fff', // White text
    borderWidth: 1,
    borderColor: '#4CAF50', // Green border
  },
  loginButton: {
    backgroundColor: '#4CAF50', // Green background
    paddingVertical: 15,
    paddingHorizontal: 120,
    borderRadius: 30,
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 5,
    width: '100%',
    alignItems: 'center',
  },
  buttonText: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#fff', // White text
  },
  forgotPasswordText: {
    fontSize: 16,
    color: '#fff', // White text
    textDecorationLine: 'underline',
    marginBottom: 20,
  },
  orContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    width: '100%',
    marginBottom: 20,
  },
  divider: {
    flex: 1,
    height: 1,
    backgroundColor: '#fff', // White divider
  },
  orText: {
    color: '#fff', // White text
    marginHorizontal: 10,
    fontSize: 16,
  },
  scanButton: {
    backgroundColor: 'transparent', // No background
    paddingVertical: 15,
    paddingHorizontal: 120,
    borderRadius: 30,
    width: '100%',
    alignItems: 'center',
        borderColor: '#fff', // White border
        borderWidth: 2
  },
  saveInfoContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
    width: '100%',
  },
  checkbox: {
    width: 20,
    height: 20,
    borderRadius: 5,
    borderWidth: 2,
    borderColor: '#fff', // White border
    marginRight: 10,
    justifyContent: 'center',
    alignItems: 'center',
  },
  checkboxInner: {
    width: 10,
    height: 10,
    borderRadius: 2.5,
    backgroundColor: '#4CAF50', // Green checkmark
  },
  saveInfoText: {
    color: '#fff', // White text
    fontSize: 16,
  },
});

export default LoginScreen;
