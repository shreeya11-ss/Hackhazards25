import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, StyleSheet, TouchableOpacity } from 'react-native';
import { Picker } from '@react-native-picker/picker';
import { LineChart, Grid } from 'react-native-svg-charts';

const assets = {
  XLM: { code: 'XLM', issuer: null },
  MOBI: { code: 'MOBI', issuer: 'GA6HCMBLTZS5VYYP4ZB7Y54J5XHNG4YIXTOB47QEP3IXPAGSVI3C44TJ' },
};

export default function TokenConvertScreen() {
  const [selectedToken, setSelectedToken] = useState<'XLM' | 'MOBI'>('XLM');
  const [amount, setAmount] = useState(''); 
  const [usdValue, setUsdValue] = useState<string | null>(null);

  useEffect(() => {
    if (amount && !isNaN(Number(amount))) {
      const result = (parseFloat(amount) / 10).toFixed(2); // 10 tokens = 1 USDC
      setUsdValue(result);
    } else {
      setUsdValue(null);
    }
  }, [amount, selectedToken]);

  const mockGraphData = [0.1, 0.3, 0.2, 0.5, 0.6, 0.8, 0.7]; // example static data

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Convert</Text>

      <View style={styles.dropdownContainer}>
        <Text style={styles.label}>Select Token</Text>
        <View style={styles.pickerWrapper}>
          <Picker
            selectedValue={selectedToken}
            onValueChange={(itemValue) => setSelectedToken(itemValue)}
            dropdownIconColor="#fff"
            style={styles.picker}
          >
            <Picker.Item label="Stell Tokens (XLM)" value="XLM" />
            <Picker.Item label="Stell Tokens (MOBI)" value="MOBI" />
          </Picker>
        </View>
      </View>

      <Text style={styles.amountInputLabel}>Enter Amount</Text>
      <TextInput
        style={styles.input}
        keyboardType="numeric"
        placeholder="e.g. 20"
        value={amount}
        onChangeText={setAmount}
      />

      <View style={[styles.resultBox, { backgroundColor: '#FFFFFF' }]}>
        <Text style={styles.convertedAmount}>{amount || '0'} Token</Text>
        <Text style={styles.usdText}>{usdValue ? `${usdValue} US Dollars` : 'Calculating...'}</Text>
        <Text style={styles.rateNote}>
          10 Token ≈ {usdValue && amount ? (parseFloat(usdValue) / parseFloat(amount)).toFixed(2) : '1.0'} US Dollars
        </Text>

        {/* Static Graph with flex width and same background */}
        <View style={{ height: 180, marginTop: 45, width: '100%' }}>
          <LineChart
            style={{ flex: 1 }}
            data={mockGraphData}
            svg={{ stroke: '#2e8b57', strokeWidth: 2 }}
            contentInset={{ top: 10, bottom: 10 }}
          >
            <Grid />
          </LineChart>
        </View>
      </View>

      <TouchableOpacity style={styles.exchangeButton}>
        <Text style={styles.exchangeText}>Exchange {amount || '0'} Dollars</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#111',
    padding: 20,
    paddingTop: 40,
  },
  header: {
    color: 'white',
    fontSize: 35,
    fontWeight: '600',
    marginBottom: 10,
    textAlign: 'center',
  },
  dropdownContainer: {
    backgroundColor: '#1d1d1d',
    borderRadius: 10,
    marginBottom: 10,
    paddingHorizontal: 10,
  },
  label: {
    color: '#aaa',
    marginTop: 10,
    marginBottom: 5,
  },
  pickerWrapper: {
    backgroundColor: '#1d1d1d',
    borderRadius: 12,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: '#333',
    marginBottom: 20,
  },
  picker: {
    height: 50,
    color: '#fff',
  },
  amountInputLabel: {
    color: '#aaa',
    marginBottom: 5,
  },
  input: {
    backgroundColor: '#1d1d1d',
    color: '#fff',
    padding: 12,
    borderRadius: 10,
    marginBottom: 20,
  },
  resultBox: {
    flex: 1.5,
    borderRadius: 25,
    paddingHorizontal: 30,
    paddingTop: 32,
    paddingBottom: 20,
    justifyContent: 'flex-start',
    alignItems: 'stretch',
  },
  convertedAmount: {
    fontSize: 40,
    fontWeight: 'bold',
    color: '#000',
  },
  usdText: {
    fontSize: 18,
    marginTop: 1,
    color: '#444',
  },
  rateNote: {
    fontSize: 12,
    color: '#666',
    marginTop: 4,
  },
  exchangeButton: {
    backgroundColor: '#2e8b57',
    borderRadius: 20,
    paddingVertical: 14,
    paddingHorizontal: 24,
    marginTop: 20,
    marginHorizontal: 20,
    width: '95%',
    alignSelf: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 5,
  },
  exchangeText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '700',
    textAlign: 'center',
    letterSpacing: 1,
    textTransform: 'uppercase',
  },
});
