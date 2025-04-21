import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, Button, StyleSheet } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
// import AsyncStorage from '@react-native-async-storage/async-storage';

import { ScheduledTransaction } from '../types';

export default function ScheduledScreen() {
  const [transactions, setTransactions] = useState<ScheduledTransaction[]>([]);

  useEffect(() => {
    const loadTransactions = async () => {
      const data = await AsyncStorage.getItem('scheduledTransactions');
      if (data) {
        try {
          const parsed = JSON.parse(data);
          if (Array.isArray(parsed)) {
            setTransactions(parsed.filter(item => item.time && item.destination && item.amount));
          }
        } catch (e) {
          console.error('Error parsing stored transactions', e);
        }
      }
    };

    loadTransactions();
  }, []);

  const runDueTransactions = async () => {
    const now = new Date();
    const due = transactions.filter(tx => new Date(tx.time).getTime() <= now.getTime());

    for (const tx of due) {
      try {
        await sendStellarTransaction(tx.destination, tx.amount, tx.asset);
        console.log(`Transaction to ${tx.destination} sent`);
      } catch (error) {
        console.log('Error sending transaction:', error);
      }
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Scheduled Transactions</Text>
      <FlatList
        data={transactions}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <View style={styles.card}>
            <Text>To: {item.destination}</Text>
            <Text>Amount: {item.amount} {item.asset}</Text>
            <Text>Time: {item.time ? new Date(item.time).toLocaleString() : 'Invalid time'}</Text>
          </View>
        )}
      />
      <Button title="Run Due Transactions" onPress={runDueTransactions} />
    </View>
  );
}

async function sendStellarTransaction(destination: string, amount: string, asset: string) {
  // Temporary placeholder logic
  console.log(`Pretend sending ${amount} ${asset} to ${destination}`);
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20 },
  title: { fontSize: 24, marginBottom: 20 },
  card: { marginBottom: 15, padding: 10, backgroundColor: '#eee', borderRadius: 8 },
});
