

import React from 'react';
import { View, Text, Button, StyleSheet } from 'react-native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../types'; // adjust path if needed


type HomeScreenProps = {
  navigation: NativeStackNavigationProp<RootStackParamList, 'Home'>;
  

  // navigation.navigate('Receive', { publicKey: wallet.publicKey });
};
console.log("HomeScreen Loaded");
export default function HomeScreen({ navigation }: HomeScreenProps) {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Welcome to Smart Stellar Wallet</Text>
      <Button title="Go to Wallet" onPress={() => navigation.navigate('Wallet')} />
      <Button title="Go to Send Screen" onPress={() => navigation.navigate('Send')} />
      <Button title="Scheduled Transactions" onPress={() => navigation.navigate('Scheduled')} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  title: { fontSize: 24, marginBottom: 20 },
});
