import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, Alert, ScrollView, TouchableOpacity } from 'react-native';
import * as Clipboard from 'expo-clipboard';
import QRCode from 'react-native-qrcode-svg';
import { RouteProp } from '@react-navigation/native';
import { RootStackParamList } from '../types';
import { MaterialCommunityIcons, Feather } from '@expo/vector-icons';

type ReceiveScreenRouteProp = RouteProp<RootStackParamList, 'Receive'>;

type Props = {
  route: ReceiveScreenRouteProp;
};

export default function ReceiveScreen({ route }: Props) {
  const [publicKey, setPublicKey] = useState('');

  useEffect(() => {
    if (route.params?.publicKey) {
      setPublicKey(route.params.publicKey);
    }
  }, [route.params]);

  const copyToClipboard = () => {
    Clipboard.setStringAsync(publicKey);
    Alert.alert('Copied!', 'Public key copied to clipboard');
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <View style={styles.iconWrapper}>
        <MaterialCommunityIcons name="qrcode" size={40} color="#fff" />
      </View>

      <Text style={styles.title}>Receive Funds</Text>

      {publicKey !== '' && (
        <View style={styles.qrContainer}>
          <QRCode value={publicKey} size={200} />
        </View>
      )}

      <Text style={styles.label}>Stellar Public Key:</Text>
      <Text selectable style={styles.publicKey}>{publicKey}</Text>

      <TouchableOpacity style={styles.copyBtn} onPress={copyToClipboard}>
        <Feather name="copy" size={18} color="#fff" />
        <Text style={styles.copyText}>Copy to Clipboard</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    paddingVertical: 40,
    paddingHorizontal: 24,
    backgroundColor: '#1b2e2b',
    alignItems: 'center',
  },
  iconWrapper: {
    backgroundColor: '#2e8b57',
    padding: 20,
    borderRadius: 50,
    marginBottom: 10,
  },
  title: {
    fontSize: 24,
    color: '#ffffff',
    fontWeight: 'bold',
    marginBottom: 20,
  },
  qrContainer: {
    backgroundColor: '#fff',
    padding: 16,
    borderRadius: 20,
    elevation: 4,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 6,
    marginBottom: 20,
  },
  label: {
    fontSize: 16,
    color: '#cccccc',
    marginBottom: 6,
  },
  publicKey: {
    fontSize: 14,
    color: '#eeeeee',
    textAlign: 'center',
    marginBottom: 12,
    paddingHorizontal: 10,
  },
  copyBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#2e8b57',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 12,
  },
  copyText: {
    color: '#fff',
    marginLeft: 8,
    fontWeight: '600',
  },
});
