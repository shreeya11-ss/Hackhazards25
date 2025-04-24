import React, { useState, useEffect } from 'react';
import { View, TextInput, TouchableOpacity, Text, StyleSheet, ActivityIndicator } from 'react-native';
import { account,ID } from '../../my-wallet/screens/appwrite'; // Adjust the path to your Appwrite client
//  IMPORTANT:  Set this to false for production!
const USE_FIXED_OTP = true;  //  <---  DEVELOPMENT/TESTING ONLY!!!

const FIXED_OTP = '123456';    //  <---  NEVER USE THIS IN PRODUCTION!!!

export default function OTPScreen({ route, navigation }) {
  const { phone, userId } = route.params;
  const [otp, setOtp] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [timer, setTimer] = useState(60);
  const [resendDisabled, setResendDisabled] = useState(true);

  useEffect(() => {
    console.log('OTPScreen - route.params:', route.params);
  }, []);

  useEffect(() => {
    let intervalId;
    if (timer > 0 && resendDisabled) {
      intervalId = setInterval(() => {
        setTimer((prevTimer) => prevTimer - 1);
      }, 1000);
    } else if (timer === 0) {
      setResendDisabled(false);
      clearInterval(intervalId);
    }
    return () => clearInterval(intervalId);
  }, [timer, resendDisabled]);

  const verifyOTP = async () => {
    setLoading(true);
    setError('');
    try {
      console.log('Verifying OTP for userId:', userId, 'phone:', phone, 'otp:', otp);

      if (USE_FIXED_OTP) {
        if (otp === FIXED_OTP) {
          console.log('Fixed OTP Match - Verification successful');
          setLoading(false);
          alert('Phone verified successfully! (Fixed OTP used)');
          navigation.navigate('Wallet');
          return; //  IMPORTANT:  Return after successful verification
        } else {
          setError('Invalid OTP. (Fixed OTP is ' + FIXED_OTP + ')');
          setLoading(false);
          return;
        }
      }
      // *REAL* OTP Verification (Appwrite)
      await account.updatePhoneSession(userId, otp);
      setLoading(false);
      alert('Phone verified successfully!');
      navigation.navigate('Wallet'); // Navigate to the Wallet screen here
    } catch (err) {
      setLoading(false);
      setError('Error verifying OTP: ' + err.message);
      console.error('OTP Verification Error:', err);
    }
  };

  
  const resendOTP = async () => {
    if (!resendDisabled) {
      setLoading(true);
      setError('');
      try {
        console.log('Resending OTP to:', phone);
        await account.createPhoneToken(phone);
        alert('OTP resent successfully!');
        setTimer(60);
        setResendDisabled(true);
      } catch (err) {
        setError('Error resending OTP: ' + err.message);
        console.error('Resend OTP Error:', err);
      } finally {
        setLoading(false);
      }
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Verify OTP</Text>
      <Text style={styles.subtitle}>Sent to {phone}</Text>

      <TextInput
        style={styles.input}
        placeholder="Enter OTP"
        placeholderTextColor="#ccc"
        keyboardType="number-pad"
        value={otp}
        onChangeText={setOtp}
      />

      {error ? <Text style={styles.errorText}>{error}</Text> : null}

      <TouchableOpacity style={styles.button} onPress={verifyOTP} disabled={loading}>
        {loading ? (
          <ActivityIndicator color="#fff" />
        ) : (
          <Text style={styles.buttonText}>VERIFY</Text>
        )}
      </TouchableOpacity>

      <View style={styles.resendContainer}>
        {resendDisabled ? (
          <Text style={styles.resendText}>Resend OTP in {timer} seconds</Text>
        ) : (
          <TouchableOpacity onPress={resendOTP} disabled={loading}>
            <Text style={styles.resendButtonText}>Resend OTP</Text>
          </TouchableOpacity>
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#000', // Dark background
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#fff', // White text
    marginBottom: 10,
    fontFamily: 'Arial',
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 16,
    color: '#fff', // White text
    marginBottom: 20,
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
  button: {
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
  errorText: {
    color: '#ff4444',
    marginBottom: 10,
    textAlign: 'center',
  },
  resendContainer: {
    marginTop: 20,
    alignItems: 'center',
  },
  resendText: {
    color: '#fff',
  },
  resendButtonText: {
    color: '#4CAF50',
    fontWeight: 'bold',
  },
});
