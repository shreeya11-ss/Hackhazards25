import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  Switch,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons'; // For fingerprint icon

export default function App() {
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [saveInfo, setSaveInfo] = useState(false);

  return (
    <SafeAreaView style={styles.container}>
      <TouchableOpacity style={styles.closeButton}>
        <Ionicons name="close" size={28} color="white" />
      </TouchableOpacity>

      <Text style={styles.title}>Login</Text>

      <TextInput
        style={styles.input}
        placeholder="+1 566 344"
        placeholderTextColor="#ccc"
        keyboardType="phone-pad"
        value={phone}
        onChangeText={setPhone}
      />

      <TextInput
        style={[styles.input, { marginTop: 15 }]}
        placeholder="Password"
        placeholderTextColor="#ccc"
        secureTextEntry
        value={password}
        onChangeText={setPassword}
      />

      <View style={styles.switchContainer}>
        <Switch
          value={saveInfo}
          onValueChange={setSaveInfo}
          thumbColor={saveInfo ? '#3cb371' : '#ccc'}
        />
        <Text style={styles.switchLabel}>Save my info?</Text>
      </View>

      <TouchableOpacity style={styles.loginButton}>
        <Text style={styles.loginText}>LOGIN</Text>
      </TouchableOpacity>

      <View style={styles.orContainer}>
        <View style={styles.line} />
        <Text style={styles.orText}>OR</Text>
        <View style={styles.line} />
      </View>

      <TouchableOpacity style={styles.fingerprint}>
        <Ionicons name="finger-print" size={48} color="#3cb371" />
        <Text style={styles.scanText}>Scan</Text>
      </TouchableOpacity>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#121212',
    padding: 20,
    justifyContent: 'center',
  },
  closeButton: {
    position: 'absolute',
    top: 50,
    left: 20,
  },
  title: {
    fontSize: 32,
    color: 'white',
    fontWeight: 'bold',
    alignSelf: 'center',
    marginBottom: 40,
  },
  input: {
    backgroundColor: '#1e1e1e',
    borderColor: '#3cb371',
    borderWidth: 1,
    borderRadius: 10,
    paddingHorizontal: 15,
    color: 'white',
    height: 50,
  },
  switchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 15,
  },
  switchLabel: {
    marginLeft: 10,
    color: '#ccc',
  },
  loginButton: {
    backgroundColor: '#3cb371',
    paddingVertical: 15,
    borderRadius: 10,
    marginTop: 25,
  },
  loginText: {
    color: 'white',
    textAlign: 'center',
    fontWeight: 'bold',
    fontSize: 16,
  },
  orContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 30,
    justifyContent: 'center',
  },
  orText: {
    color: '#ccc',
    marginHorizontal: 10,
  },
  line: {
    height: 1,
    backgroundColor: '#333',
    flex: 1,
  },
  fingerprint: {
    alignItems: 'center',
  },
  scanText: {
    color: '#ccc',
    marginTop: 10,
  },
});
