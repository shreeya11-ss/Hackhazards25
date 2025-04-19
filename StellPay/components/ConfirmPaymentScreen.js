import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
} from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';

export default function ConfirmPaymentScreen() {
  const navigation = useNavigation();
  const route = useRoute();
  const { amount } = route.params;

  const [fees, setFees] = useState('0');
  const [total, setTotal] = useState(parseFloat(amount));

  useEffect(() => {
    const feeValue = parseFloat(fees) || 0;
    setTotal(parseFloat(amount) + feeValue);
  }, [fees]);

  const handleSend = () => {
    // Navigate to MoneySent screen
    navigation.navigate('MoneySent');
  };

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Confirm Payment</Text>

      <View style={styles.section}>
        <Text style={styles.label}>TRANSFER FROM</Text>
        <Text style={styles.cardNumber}>+1 (386) •••• 5743</Text>
        <Text style={styles.cardType}>Credit Card</Text>
      </View>

      <View style={styles.section}>
        <Text style={styles.label}>TO</Text>
        <Text style={styles.cardNumber}>8923 •••• 7450</Text>
        <Text style={styles.cardType}>Martin Sdarovetsky</Text>
        <Text style={styles.cardType}>+1 322 222 3322</Text>
      </View>

      <View style={styles.paymentBox}>
        <View style={styles.row}>
          <Text style={styles.rowLabel}>AMOUNT</Text>
          <Text style={styles.rowValue}>${parseFloat(amount).toFixed(2)}</Text>
        </View>

        <View style={styles.row}>
          <Text style={styles.rowLabel}>FEES</Text>
          <TextInput
            style={styles.feeInput}
            placeholder="0.00"
            placeholderTextColor="#aaa"
            keyboardType="numeric"
            value={fees}
            onChangeText={setFees}
          />
        </View>

        <View style={styles.row}>
          <Text style={styles.totalLabel}>TOTAL AMOUNT</Text>
          <Text style={styles.totalValue}>${total.toFixed(2)}</Text>
        </View>
      </View>

      <TouchableOpacity style={styles.sendButton} onPress={handleSend}>
        <Text style={styles.sendText}>SEND ${total.toFixed(2)}</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1.5,
    backgroundColor: '#121212',
    padding: 20,
    paddingTop: 60,
  },
  header: {
    fontSize: 18,
    color: '#fff',
    textAlign: 'center',
    marginBottom: 30,
  },
  section: {
    marginBottom: 30,
    borderBottomColor: '#444',
    borderBottomWidth: 1,
    paddingBottom: 15,
  },
  label: {
    color: '#aaa',
    fontSize: 12,
    marginBottom: 5,
  },
  cardNumber: {
    color: '#fff',
    fontSize: 16,
    letterSpacing: 1,
  },
  cardType: {
    color: '#ccc',
    fontSize: 14,
  },
  paymentBox: {
    backgroundColor: '#1e1e1e',
    borderRadius: 15,
    padding: 20,
    marginBottom: 30,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 50,
    alignItems: 'center',
  },
  rowLabel: {
    color: '#aaa',
    fontSize: 14,
  },
  rowValue: {
    color: '#fff',
    fontSize: 14,
  },
  feeInput: {
    backgroundColor: '#2a2a2a',
    color: '#fff',
    padding: 5,
    borderRadius: 8,
    width: 80,
    textAlign: 'right',
    fontSize: 14,
  },
  totalLabel: {
    color: '#ccc',
    fontSize: 15,
    fontWeight: 'bold',
  },
  totalValue: {
    color: '#fff',
    fontSize: 15,
    fontWeight: 'bold',
  },
  sendButton: {
    backgroundColor: '#2e8b57',
    padding: 15,
    borderRadius: 15,
    alignItems: 'center',
  },
  sendText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
});
