import React, { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation, useRoute } from '@react-navigation/native';

export default function SendFundsScreen() {
  const [amount, setAmount] = useState('');
  const navigation = useNavigation();
  const route = useRoute();
  const { fullName, mobile } = route.params || {};

  const handleProceed = () => {
    navigation.navigate('ConfirmPayment', {
      amount: parseFloat(amount),
      fullName,
      mobile,
    });
  };

  const handlePress = (value) => {
    setAmount((prev) => prev + value);
  };

  const handleBackspace = () => {
    setAmount((prev) => prev.slice(0, -1));
  };

  const formatAmount = (value) => (value ? `$${value}` : '$0');

  const keypad = [['1', '2', '3'], ['4', '5', '6'], ['7', '8', '9']];

  return (
    <LinearGradient colors={['#2e8b57', '#98fb98']} style={styles.container}>
      <SafeAreaView style={styles.inner}>
        <View style={styles.header}>
          <TouchableOpacity onPress={() => navigation.goBack()}>
            <Ionicons name="arrow-back" size={28} color="white" />
          </TouchableOpacity>
          <Text style={styles.title}>Enter Amount</Text>
        </View>

        <Text style={styles.subtitle}>HOW MUCH?</Text>
        <Text style={styles.amount}>{formatAmount(amount)}</Text>
        <View style={styles.divider} />

        <View style={styles.keypadContainer}>
          {keypad.map((row, i) => (
            <View style={styles.keypadRow} key={i}>
              {row.map((key) => (
                <TouchableOpacity
                  key={key}
                  style={styles.key}
                  onPress={() => handlePress(key)}
                >
                  <Text style={styles.keyText}>{key}</Text>
                </TouchableOpacity>
              ))}
            </View>
          ))}
          <View style={styles.keypadRow}>
            <View style={styles.key} />
            <TouchableOpacity style={styles.key} onPress={() => handlePress('0')}>
              <Text style={styles.keyText}>0</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.key} onPress={handleBackspace}>
              <Ionicons name="backspace" size={24} color="white" />
            </TouchableOpacity>
          </View>
        </View>

        <TouchableOpacity
          style={[
            styles.proceedButton,
            { opacity: amount ? 1 : 0.5 },
          ]}
          onPress={handleProceed}
          disabled={!amount}
        >
          <Text style={styles.proceedText}>PROCEED</Text>
        </TouchableOpacity>
      </SafeAreaView>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  inner: {
    flex: 1,
    padding: 20,
    justifyContent: 'space-between',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 20,
  },
  title: {
    color: '#fff',
    fontSize: 20,
    fontWeight: 'bold',
    marginLeft: 90,
  },
  subtitle: {
    textAlign: 'center',
    color: 'white',
    fontSize: 14,
    fontWeight: 'bold',
    letterSpacing: 1,
    marginTop: 30,
  },
  amount: {
    textAlign: 'center',
    color: 'white',
    fontSize: 40,
    fontWeight: 'bold',
    marginVertical: 10,
  },
  divider: {
    height: 1,
    backgroundColor: 'white',
    marginHorizontal: 50,
    marginBottom: 30,
  },
  keypadContainer: {
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderRadius: 20,
    paddingVertical: 20,
  },
  keypadRow: {
    flexDirection: 'row',
    justifyContent: 'space-evenly',
    marginBottom: 15,
  },
  key: {
    padding: 20,
    minWidth: 60,
    alignItems: 'center',
    justifyContent: 'center',
  },
  keyText: {
    color: 'white',
    fontSize: 26,
    fontWeight: '500',
  },
  proceedButton: {
    backgroundColor: 'white',
    padding: 15,
    borderRadius: 15,
    alignItems: 'center',
    marginTop: 20,
  },
  proceedText: {
    color: '#2e8b57',
    fontSize: 16,
    fontWeight: '600',
  },
});
