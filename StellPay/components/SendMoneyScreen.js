import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
  StyleSheet,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';

export default function SendMoneyScreen() {
  const [fullName, setFullName] = useState('');
  const [mobile, setMobile] = useState('');
  const navigation = useNavigation();

  const recentContacts = [
    { name: 'CARLA', number: '1234567890' },
    { name: 'SAM', number: '2345678901' },
    { name: 'MARTIN', number: '3456789012' },
    { name: 'SHEILA', number: '4567890123' },
  ];

  const accountData = [
    { type: 'BANK', amount: '12.244', decimal: '81', selected: true },
    { type: 'SAVINGS', amount: '8.460', decimal: '24', selected: false },
    { type: 'CREDIT', amount: '3.145', decimal: '09', selected: false },
  ];

  const handleSelectRecent = (contact) => {
    setFullName(contact.name);
    setMobile(contact.number);
  };

  const handleConfirm = () => {
    if (fullName && mobile) {
      console.log('Navigating to SendFundsScreen with:', fullName, mobile);
      navigation.navigate('SendFundsScreen', {
        recipient: {
          name: fullName,
          number: mobile,
        },
      });
    }
  };

  const isFormComplete = fullName.trim() !== '' && mobile.trim() !== '';

  return (
    <View style={styles.container}>
      <TouchableOpacity style={styles.backButton}>
        <Ionicons name="arrow-back" size={24} color="#fff" />
      </TouchableOpacity>

      <Text style={styles.header}>Send Funds</Text>

      <Text style={styles.sectionLabel}>FROM</Text>
      <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.accountScroll}>
        {accountData.map((item, index) => (
          <View
            key={index}
            style={[
              styles.accountCard,
              item.selected && styles.selectedCard,
            ]}
          >
            <View style={styles.iconCircle}>
              <Ionicons name="logo-usd" size={20} color="#fff" />
            </View>
            <View style={styles.amountRow}>
              <Text style={styles.amountText}>${item.amount}</Text>
              <Text style={styles.decimalText}>.{item.decimal}</Text>
            </View>
            <Text style={styles.accountType}>{item.type}</Text>
          </View>
        ))}
      </ScrollView>

      <Text style={styles.sectionLabel}>TO</Text>
      <TextInput
        style={styles.input}
        placeholder="Full name"
        placeholderTextColor="#aaa"
        value={fullName}
        onChangeText={setFullName}
      />
      <TextInput
        style={styles.input}
        placeholder="Mobile number"
        placeholderTextColor="#aaa"
        keyboardType="numeric"
        value={mobile}
        onChangeText={setMobile}
      />

      <Text style={styles.sectionLabel}>RECENT</Text>
      <View style={styles.recents}>
        {recentContacts.map((contact, index) => (
          <TouchableOpacity key={index} onPress={() => handleSelectRecent(contact)}>
            <View style={styles.avatar} />
            <Text style={styles.recentName}>{contact.name}</Text>
          </TouchableOpacity>
        ))}
      </View>

      <TouchableOpacity
        style={[styles.sendButton, { opacity: isFormComplete ? 1 : 0.5 }]}
        onPress={handleConfirm}
        disabled={!isFormComplete}
      >
        <Text style={styles.sendText}>send</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1.5,
    backgroundColor: '#121212',
    padding: 20,
    paddingTop: 50,
  },
  backButton: {
    position: 'absolute',
    top: 50,
    left: 20,
    zIndex: 10,
  },
  header: {
    fontSize: 16,
    color: '#fff',
    textAlign: 'center',
    marginBottom: 30,
  },
  sectionLabel: {
    color: '#aaa',
    fontSize: 12,
    marginBottom: 40,
    marginTop: 10,
  },
  accountScroll: {
    flexGrow: 0,
  },
  accountCard: {
    width: 120,
    backgroundColor: '#2e2e2e',
    borderRadius: 20,
    padding: 15,
    marginRight: 15,
    alignItems: 'center',
  },
  selectedCard: {
    backgroundColor: '#2e8b57',
  },
  iconCircle: {
    width: 35,
    height: 35,
    borderRadius: 17,
    backgroundColor: '#1a1a1a',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 10,
  },
  amountRow: {
    flexDirection: 'row',
    alignItems: 'flex-end',
  },
  amountText: {
    fontSize: 18,
    color: '#fff',
    fontWeight: 'bold',
  },
  decimalText: {
    fontSize: 12,
    color: '#ccc',
    marginBottom: 2,
  },
  accountType: {
    fontSize: 12,
    color: '#ccc',
    marginTop: 5,
  },
  input: {
    backgroundColor: '#1e1e1e',
    color: 'white',
    borderRadius: 10,
    padding: 15,
    marginBottom: 20,
    borderWidth: 1,
    borderColor: '#2c2c2c',
  },
  recents: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 15,
    marginBottom: 20,
  },
  avatar: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: '#444',
    marginBottom: 5,
  },
  recentName: {
    color: '#ccc',
    fontSize: 12,
    textAlign: 'center',
  },
  sendButton: {
    backgroundColor: '#2e8b57',
    padding: 15,
    borderRadius: 15,
    alignItems: 'center',
  },
  sendText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
    textTransform: 'lowercase',
  },
});
