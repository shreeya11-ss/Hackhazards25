import React, { useState } from 'react';
import { View, TextInput, Button, Text, StyleSheet } from 'react-native';
import { saveScheduledTransaction } from '../utils/ScheduledTx';

export default function ScheduledTransactionScreen() {
  const [recipient, setRecipient] = useState('');
  const [amount, setAmount] = useState('');
  const [delay, setDelay] = useState('10'); // in seconds

  const scheduleTransaction = async () => {
    const tx = {
      recipient,
      amount,
      delay: parseInt(delay),
      createdAt: Date.now(),
    };
    await saveScheduledTransaction(tx);
    alert('Transaction scheduled!');
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Schedule a Transaction</Text>
      <TextInput placeholder="Recipient Public Key" style={styles.input} onChangeText={setRecipient} />
      <TextInput placeholder="Amount" style={styles.input} keyboardType="numeric" onChangeText={setAmount} />
      <TextInput placeholder="Delay in seconds" style={styles.input} keyboardType="numeric" onChangeText={setDelay} />
      <Button title="Schedule" onPress={scheduleTransaction} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, justifyContent: 'center' },
  input: { borderWidth: 1, borderColor: '#ccc', marginBottom: 10, padding: 10, borderRadius: 6 },
  title: { fontSize: 20, marginBottom: 20, textAlign: 'center' },
});
