import React, { useState } from 'react';
import {
  View, Text, TextInput, StyleSheet, Alert, TouchableOpacity, Platform
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import DateTimePicker from '@react-native-community/datetimepicker';

const TX_KEY = 'scheduled_transactions';

const ScheduleTx = () => {
  const [recipient, setRecipient] = useState('');
  const [amount, setAmount] = useState('');
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [selectedTime, setSelectedTime] = useState(new Date());
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [showTimePicker, setShowTimePicker] = useState(false);

  const handleSchedule = async () => {
    if (!recipient || !amount || !selectedDate || !selectedTime) {
      Alert.alert('Error', 'Please fill all fields');
      return;
    }

    const scheduledAt = new Date(
      selectedDate.getFullYear(),
      selectedDate.getMonth(),
      selectedDate.getDate(),
      selectedTime.getHours(),
      selectedTime.getMinutes()
    );

    const tx = {
      recipient,
      amount,
      scheduledAt: scheduledAt.toISOString(),
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
    } catch (error) {
      Alert.alert('Error', 'Failed to schedule transaction');
      console.error('ScheduleTx error:', error);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Schedule Transaction</Text>

      <Text style={styles.label}>SELECT A DATE</Text>
      <TouchableOpacity style={styles.pickerBox} onPress={() => setShowDatePicker(true)}>
        <Text style={styles.pickerText}>{selectedDate.toDateString()}</Text>
      </TouchableOpacity>
      {showDatePicker && (
        <DateTimePicker
          value={selectedDate}
          mode="date"
          display="default"
          onChange={(e, date) => {
            setShowDatePicker(Platform.OS === 'ios');
            if (date) setSelectedDate(date);
          }}
        />
      )}

      <Text style={styles.label}>SELECT A TIME</Text>
      <TouchableOpacity style={styles.pickerBox} onPress={() => setShowTimePicker(true)}>
        <Text style={styles.pickerText}>
          {selectedTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
        </Text>
      </TouchableOpacity>
      {showTimePicker && (
        <DateTimePicker
          value={selectedTime}
          mode="time"
          display="default"
          onChange={(e, time) => {
            setShowTimePicker(Platform.OS === 'ios');
            if (time) setSelectedTime(time);
          }}
        />
      )}

      <Text style={styles.label}>RECIPIENT PUBLIC KEY</Text>
      <TextInput
        style={styles.input}
        placeholder="G..."
        placeholderTextColor="#777"
        value={recipient}
        onChangeText={setRecipient}
      />

      <Text style={styles.label}>AMOUNT (XLM)</Text>
      <TextInput
        style={styles.input}
        placeholder="e.g. 10"
        placeholderTextColor="#777"
        value={amount}
        onChangeText={setAmount}
        keyboardType="decimal-pad"
      />

      <TouchableOpacity style={styles.button} onPress={handleSchedule}>
        <Text style={styles.buttonText}>NEXT</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#111',
    flex: 1,
    padding: 40,
  },
  title: {
    fontSize: 25,
    color: '#fff',
    marginBottom: 30,
    textAlign: 'center',
    fontWeight: '600',
  },
  label: {
    color: '#ccc',
    marginBottom: 8,
    fontSize: 12,
    fontWeight: '500',
  },
  pickerBox: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 10,
    padding: 12,
    marginBottom: 20,
  },
  pickerText: {
    color: '#fff',
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 10,
    padding: 12,
    color: '#fff',
    marginBottom: 20,
  },
  button: {
    backgroundColor: '#2e8b57',
    paddingVertical: 10,
    borderRadius: 15,
    alignItems: 'center',
    marginTop: 230,
  },
  buttonText: {
    color: '#fff',
    fontWeight: '600',
    fontSize: 20,
  },
});

export default ScheduleTx;
