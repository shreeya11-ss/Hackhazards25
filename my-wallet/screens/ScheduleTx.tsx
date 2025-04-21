import React, { useState } from 'react';
import { View, Text, TextInput, Button, StyleSheet, Alert } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

const TX_KEY = 'scheduled_transactions';

const ScheduleTx = () => {
  const [recipient, setRecipient] = useState('');
  const [amount, setAmount] = useState('');
  const [delay, setDelay] = useState('');

  const handleSchedule = async () => {
    if (!recipient || !amount || !delay) {
      Alert.alert('Error', 'Please fill all fields');
      return;
    }

    const tx = {
      recipient,
      amount,
      delay: parseInt(delay),
      createdAt: Date.now()
    };

    try {
      const existing = await AsyncStorage.getItem(TX_KEY);
      const parsed = existing ? JSON.parse(existing) : [];
      parsed.push(tx);
      await AsyncStorage.setItem(TX_KEY, JSON.stringify(parsed));
      Alert.alert('Success', 'Transaction scheduled successfully');
      setRecipient('');
      setAmount('');
      setDelay('');
    } catch (error) {
      Alert.alert('Error', 'Failed to schedule transaction');
      console.error('ScheduleTx error:', error);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Schedule Transaction</Text>

      <Text style={styles.label}>Recipient Public Key</Text>
      <TextInput
        style={styles.input}
        value={recipient}
        onChangeText={setRecipient}
        placeholder="G..."
      />

      <Text style={styles.label}>Amount (XLM)</Text>
      <TextInput
        style={styles.input}
        value={amount}
        onChangeText={setAmount}
        keyboardType="decimal-pad"
        placeholder="e.g., 10"
      />

      <Text style={styles.label}>Delay (seconds)</Text>
      <TextInput
        style={styles.input}
        value={delay}
        onChangeText={setDelay}
        keyboardType="numeric"
        placeholder="e.g., 60"
      />

      <Button title="Schedule Transaction" onPress={handleSchedule} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 20,
    flex: 1,
    justifyContent: 'flex-start',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center'
  },
  label: {
    fontSize: 16,
    marginTop: 10,
  },
  input: {
    borderWidth: 1,
    borderColor: '#aaa',
    padding: 10,
    marginTop: 5,
    borderRadius: 8,
  },
});

export default ScheduleTx;
