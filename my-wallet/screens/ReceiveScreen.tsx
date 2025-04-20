import React, { useState, useEffect } from 'react';
import { View, Text, Button, StyleSheet, Alert, ScrollView } from 'react-native';
import * as Clipboard from 'expo-clipboard';

import QRCode from 'react-native-qrcode-svg';
import { RouteProp } from '@react-navigation/native';
import { RootStackParamList } from '../types'; // Adjust path if needed

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
      <Text style={styles.title}>Your Public Key</Text>
      <Text style={styles.key}>{publicKey}</Text>

      <Button title="Copy to Clipboard" onPress={copyToClipboard} />

      {publicKey !== '' && (
        <View style={styles.qrCodeContainer}>
          <QRCode value={publicKey} size={200} />
        </View>
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    paddingTop: 60,
    paddingHorizontal: 20,
    backgroundColor: '#fff',
    alignItems: 'center',
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  key: {
    fontSize: 16,
    marginVertical: 10,
    textAlign: 'center',
    color: '#333',
  },
  qrCodeContainer: {
    marginTop: 20,
  },
});
