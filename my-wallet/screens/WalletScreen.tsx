import React, { useState, useEffect } from "react";
import { View, Text, Button, Alert, StyleSheet, ScrollView } from "react-native";
import { Keypair, Networks, TransactionBuilder, Operation, Asset, Memo } from "@stellar/stellar-base";
import { useNavigation } from "@react-navigation/native";
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../types';
import { getScheduledTransactions, clearScheduledTransactions } from '../utils/ScheduledTx';

export default function WalletScreen() {
  const [wallet, setWallet] = useState<{ publicKey: string; secretKey: string } | null>(null);
  const [balance, setBalance] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  type NavigationProp = NativeStackNavigationProp<RootStackParamList, 'Wallet'>;
  const navigation = useNavigation<NavigationProp>();

  const generateWallet = () => {
    const keypair = Keypair.random();
    const newWallet = {
      publicKey: keypair.publicKey(),
      secretKey: keypair.secret(),
    };
    console.log(newWallet.publicKey);
    console.log(newWallet.secretKey);
    setWallet(newWallet);
    setBalance(null);
    Alert.alert("Wallet Generated!", "New Stellar wallet created.");
  };

  const fundWallet = async () => {
    if (!wallet) return;
    setLoading(true);
    try {
      const response = await fetch(`https://friendbot.stellar.org?addr=${wallet.publicKey}`);
      if (!response.ok) throw new Error("Funding failed");
      await response.json();
      Alert.alert("Success", "Wallet funded with 10,000 XLM.");
    } catch (error) {
      Alert.alert("Error", "Could not fund wallet.");
    } finally {
      setLoading(false);
    }
  };

  const checkBalance = async () => {
    if (!wallet) return;
    setLoading(true);
    try {
      const response = await fetch(`https://horizon-testnet.stellar.org/accounts/${wallet.publicKey}`);
      const data = await response.json();
      const native = data.balances.find((b: any) => b.asset_type === "native");
      if (native) {
        setBalance(native.balance);
      }
    } catch (error) {
      Alert.alert("Error", "Could not fetch balance.");
    } finally {
      setLoading(false);
    }
  };

  // 🧠 Replace StellarSdk.Server with fetch-based scheduled TX logic
  useEffect(() => {
    if (!wallet) return;

    const checkAndSendTransactions = async () => {
      const scheduled = await getScheduledTransactions();
      const now = Date.now();

      for (const tx of scheduled) {
        const elapsed = (now - tx.createdAt) / 1000;
        if (elapsed >= tx.delay) {
          try {
            const response = await fetch(`https://horizon-testnet.stellar.org/accounts/${wallet.publicKey}`);
            const account = await response.json();
            const sourceKeypair = Keypair.fromSecret(wallet.secretKey);

            const transaction = new TransactionBuilder(account, {
              fee: "100",
              networkPassphrase: Networks.TESTNET,
            })
              .addOperation(Operation.payment({
                destination: tx.recipient,
                asset: Asset.native(),
                amount: tx.amount,
              }))
              .setTimeout(30)
              .build();

            transaction.sign(sourceKeypair);

            const res = await fetch(`https://horizon-testnet.stellar.org/transactions`, {
              method: "POST",
              headers: { "Content-Type": "application/x-www-form-urlencoded" },
              body: `tx=${encodeURIComponent(transaction.toXDR())}`
            });

            const result = await res.json();
            if (res.ok) {
              console.log("Scheduled TX sent:", result);
              Alert.alert("Scheduled TX Sent", `Sent ${tx.amount} XLM to ${tx.recipient}`);
            } else {
              console.error("Scheduled TX failed:", result);
              Alert.alert("Scheduled TX Failed", result.extras?.result_codes?.operations?.join(", ") || "Unknown error");
            }
          } catch (err) {
            console.error("Error sending scheduled tx:", err);
            Alert.alert("Scheduled TX Failed", "An error occurred while sending the scheduled transaction.");
          }
        }
      }

      await clearScheduledTransactions();
    };

    checkAndSendTransactions();
  }, [wallet]);

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>🪐 Stellar Wallet</Text>
      <Button title="Generate Wallet" onPress={generateWallet} disabled={loading} />
      {wallet && (
        <>
          <Text style={styles.label}>Public Key:</Text>
          <Text selectable style={styles.key}>{wallet.publicKey}</Text>
          <Text style={styles.label}>Secret Key:</Text>
          <Text selectable style={styles.key}>{wallet.secretKey}</Text>

          <Button title="Fund Wallet (Testnet)" onPress={fundWallet} disabled={loading} />
          <Button title="Check Balance" onPress={checkBalance} disabled={loading} />
          {balance && <Text style={styles.balance}>💰 Balance: {balance} XLM</Text>}

          <Button title="Receive Money" onPress={() => navigation.navigate('Receive', { publicKey: wallet.publicKey })} />
          <Button title="Schedule Transaction" onPress={() => navigation.navigate('ScheduleTx')} />
          <Button title="View Transaction History" onPress={() => navigation.navigate('TransactionHistory', { publicKey: wallet.publicKey })} />
          <Button title="swap the token" onPress={() => navigation.navigate('TokenSwap')} />
        </>
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 20,
    alignItems: "center",
    justifyContent: "flex-start",
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 20,
  },
  label: {
    fontWeight: "bold",
    marginTop: 10,
  },
  key: {
    fontSize: 12,
    marginBottom: 10,
    color: "#333",
  },
  balance: {
    marginTop: 20,
    fontSize: 18,
    color: "green",
  },
});
