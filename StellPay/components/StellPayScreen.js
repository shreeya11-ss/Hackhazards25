import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
// import LinearGradient from 'react-native-linear-gradient'; // Removed

const StellPayScreen = ({ navigation }) => {
  return (
    <View style={styles.container}>
      <View style={styles.content}>
        <Text style={styles.appName}>StellPay</Text>
        <Text style={styles.tagline}>All Your Finances Inside</Text>
        <Text style={styles.tagline}>a Fancy App</Text>

        <TouchableOpacity
          style={styles.loginButton}
          onPress={() => navigation.navigate('Login')}
        >
          <Text style={styles.buttonText}>LOGIN</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.signUpButton}
          onPress={() => navigation.navigate('Register')}
        >
          <Text style={styles.buttonText}>SIGN UP</Text>
        </TouchableOpacity>

        <Text style={styles.designer}>Designed by TechBiz</Text>
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
  signUpButton: {
    backgroundColor: 'rgba(255, 255, 255, 0.1)', // Light, transparent background
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
        borderWidth: 1,
        borderColor: '#fff'
  },
  buttonText: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#fff', // White text
  },
  designer: {
    fontSize: 14,
    color: '#fff', // White text
    marginTop: 80,
    fontFamily: 'Arial',
  },
});

export default StellPayScreen;
