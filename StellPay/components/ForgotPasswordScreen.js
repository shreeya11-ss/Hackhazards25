import React, { useState } from 'react';
import { View, Text, TouchableOpacity, TextInput, StyleSheet } from 'react-native';
// import LinearGradient from 'react-native-linear-gradient';

const ForgotPasswordScreen = ({ navigation }) => {
  const [email, setEmail] = useState('');

  const handleRecover = () => {
    console.log('Phone:', email);
    //removed  navigation.navigate('Login');
    navigation.navigate('OTPScreen', { phone: email, userId: 'someUserId' }); //changed
  };

  return (
    <View style={styles.container}>
      <View style={styles.content}>
        <Text style={styles.title}>Forgot Password?</Text>
        <Text style={styles.description}>
          Please enter you phone number to get OTP
        </Text>

        <TextInput
          style={styles.input}
          placeholder="Phone Number"
          placeholderTextColor="#ccc"
          value={email}
          onChangeText={setEmail}
          keyboardType="Phone Number"
        />

        <TouchableOpacity style={styles.recoverButton} onPress={handleRecover}>
          <Text style={styles.buttonText}>RECOVER</Text>
        </TouchableOpacity>

        <TouchableOpacity onPress={() => navigation.navigate('Login')}>
          <Text style={styles.loginText}>Remember password? Login</Text>
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
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#fff', // White text
    marginBottom: 10,
    fontFamily: 'Arial',
    textAlign: 'center',
  },
  description: {
    fontSize: 16,
    color: '#fff', // White text
    marginBottom: 30,
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
  recoverButton: {
    backgroundColor: '#4CAF50', // Green background
    paddingVertical: 15,
    paddingHorizontal: 120,
    borderRadius: 30,
    marginTop: 20,
    width: '100%',
    alignItems: 'center',
  },
  buttonText: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#fff', // White text
  },
  loginText: {
    color: '#fff', // White text
    marginTop: 20,
    fontSize: 16,
    textDecorationLine: 'underline',
  },
});

export default ForgotPasswordScreen;
