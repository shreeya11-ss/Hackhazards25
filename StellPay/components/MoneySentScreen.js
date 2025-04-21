import { StyleSheet, View, Text, TouchableOpacity } from 'react-native';

import { Ionicons } from '@expo/vector-icons';

export default function MoneySentScreen({ navigation }) {
  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Ionicons name="arrow-back" size={24} color="#fff" />
        </TouchableOpacity>
        <Text style={styles.title}>Send Funds</Text>
      </View>

      {/* Confirmation Message */}
      <View style={styles.content}>
        <Text style={styles.message}>Money Sent!</Text>
        <Text style={styles.amount}>$550.00</Text>
        <Text style={styles.recipient}>TO MARTIN</Text>

        <TouchableOpacity
          style={styles.button}
          onPress={() => navigation.navigate('WalletScreen')}
        >
          <Text style={styles.buttonText}>RETURN HOME</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#121212',
    paddingTop: 50,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    gap: 10,
  },
  title: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '500',
    marginLeft: 70,
  },
  content: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 20,
  },
  message: {
    fontSize: 20,
    color: '#fff',
    marginBottom: 10,
  },
  amount: {
    fontSize: 40,
    color: '#fff',
    fontWeight: 'bold',
    marginBottom: 10,
  },
  recipient: {
    fontSize: 14,
    color: '#aaa',
    marginBottom: 30,
  },
  button: {
    backgroundColor: '#2e8b57',
    paddingVertical: 12,
    paddingHorizontal: 30,
    borderRadius: 10,
  },
  buttonText: {
    color: '#fff',
    fontWeight: '600',
    fontSize: 14,
  },
});
