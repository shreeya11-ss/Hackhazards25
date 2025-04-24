import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert,
  ScrollView,
} from 'react-native';
import { Keypair } from '@stellar/stellar-base';

export default function SendScreen() {
  const [recipient, setRecipient] = useState('');
  const [secretKey, setSecretKey] = useState('');
  const [amount, setAmount] = useState('');

  const handleKeyPress = (key: string) => {
    if (key === 'del') {
      setAmount((prev) => prev.slice(0, -1));
    } else {
      setAmount((prev) => prev + key);
    }
  };

  const handleSend = () => {
    if (!recipient || !secretKey || !amount) {
      Alert.alert('Missing Fields', 'Please fill in all fields.');
      return;
    }

    try {
        Keypair.fromPublicKey(recipient); // This will throw if invalid
      } catch (error) {
        Alert.alert('Invalid Public Key', 'The recipient public key is not valid.');
        return;
      }

    const formattedAmount = amount.replace(',', '.');
    if (isNaN(Number(formattedAmount)) || Number(formattedAmount) <= 0) {
      Alert.alert('Invalid Amount', 'Please enter a valid positive number.');
      return;
    }

    Alert.alert('Success', `Sending ${formattedAmount} XLM to:\n${recipient}`);
    // Implement Stellar transaction logic here...
  };

  const keypad = [
    ['1', '2', '3'],
    ['4', '5', '6'],
    ['7', '8', '9'],
    ['','0', 'del'],
  ];

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>Send Stellar Tokens</Text>

      <TextInput
        placeholder="Recipient Public Key"
        style={styles.input}
        value={recipient}
        onChangeText={setRecipient}
        autoCapitalize="none"
      />

      <TextInput
        placeholder="Your Secret Key"
        style={styles.input}
        secureTextEntry
        value={secretKey}
        onChangeText={setSecretKey}
        autoCapitalize="none"
      />

      <Text style={styles.label}>HOW MUCH?</Text>
      <Text style={styles.amount}>${amount || '0,00'}</Text>
      <View style={styles.separator} />

      <View style={styles.keypadContainer}>
        {keypad.map((row, rowIndex) => (
          <View key={rowIndex} style={styles.keypadRow}>
            {row.map((key) => (
              <TouchableOpacity
                key={key}
                onPress={() => handleKeyPress(key)}
                style={styles.keypadButton}
              >
                <Text style={styles.keypadText}>{key === 'del' ? '⌫' : key}</Text>
              </TouchableOpacity>
            ))}
          </View>
        ))}
      </View>

      <TouchableOpacity style={styles.proceedButton} onPress={handleSend}>
        <Text style={styles.proceedText}>PROCEED</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    backgroundColor: '#3ab37c',
    padding: 20,
    paddingTop: 60,
    justifyContent: 'flex-start',
  },
  title: {
    fontSize: 24,
    textAlign: 'center',
    fontWeight: 'bold',
    marginBottom: 20,
    color: '#fff',
  },
  input: {
    backgroundColor: '#fff',
    borderRadius: 10,
    padding: 12,
    marginBottom: 15,
    fontSize: 16,
  },
  label: {
    textAlign: 'center',
    color: '#fff',
    fontSize: 16,
    marginTop: 20,
    marginBottom: 8,
  },
  amount: {
    textAlign: 'center',
    fontSize: 36,
    fontWeight: 'bold',
    color: '#fff',
  },
  separator: {
    height: 1,
    backgroundColor: '#fff',
    marginVertical: 15,
    marginHorizontal: 40,
  },
  keypadContainer: {
    backgroundColor: '#ffffff33',
    borderRadius: 30,
    paddingVertical: 20,
    paddingHorizontal: 30,
    marginHorizontal: 10,
    marginTop: 10,
    marginBottom: 20,
  },
  keypadRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginVertical: 10,
  },
  keypadButton: {
    flex: 1,
    alignItems: 'center',
    paddingVertical: 15,
  },
  keypadText: {
    fontSize: 28,
    color: '#fff',
  },
  proceedButton: {
    backgroundColor: '#fff',
    borderRadius: 25,
    paddingVertical: 15,
    alignItems: 'center',
    marginTop: 10,
  },
  proceedText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#3ab37c',
  },
});

