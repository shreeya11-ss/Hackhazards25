import React, { useState } from 'react';
import { View, Text, TextInput, Button, StyleSheet, Alert, ScrollView } from 'react-native';
import { Keypair, TransactionBuilder, Networks, Operation, Asset, BASE_FEE } from '@stellar/stellar-base';
import { Account } from '@stellar/stellar-base';

export default function SendScreen() {
    const [recipient, setRecipient] = useState('');
    const [amount, setAmount] = useState('');
    const [secretKey, setSecretKey] = useState(''); // User inputs their secret key
    const [loading, setLoading] = useState(false);

    const handleSend = async () => {
        if (!recipient || !amount || !secretKey) {
            Alert.alert('Missing Fields', 'Please fill in all fields.');
            return;
        }

        setLoading(true);
        try {
            const sourceKeypair = Keypair.fromSecret(secretKey);
            const sourcePublicKey = sourceKeypair.publicKey();

            // Fetch source account details from Stellar testnet
            const response = await fetch(`https://horizon-testnet.stellar.org/accounts/${sourcePublicKey}`);
            const accountData = await response.json();

            // Build transaction
            const account = new Account(sourcePublicKey, accountData.sequence);

            const txBuilder = new TransactionBuilder(account, {
                fee: BASE_FEE,
                networkPassphrase: Networks.TESTNET,
            });

            const transaction = txBuilder
                .addOperation(Operation.payment({
                    destination: recipient,
                    asset: Asset.native(), // For XLM
                    amount: amount.toString(),
                }))
                .setTimeout(180)
                .build();

            transaction.sign(sourceKeypair);

            // Send transaction to Horizon
            const txResponse = await fetch('https://horizon-testnet.stellar.org/transactions', {
                method: 'POST',
                headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
                body: `tx=${encodeURIComponent(transaction.toXDR())}`,
            });

            const txResult = await txResponse.json();

            if (txResult.hash) {
                Alert.alert('Success', `Transaction successful! Hash: ${txResult.hash}`);
            } else {
                Alert.alert('Error', JSON.stringify(txResult, null, 2));
            }
        } catch (error: any) {
            console.error(error);
            Alert.alert('Error', error.message || 'Something went wrong.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <ScrollView contentContainerStyle={styles.container}>
            <Text style={styles.title}>Send Stellar Tokens</Text>
            <TextInput
                placeholder="Recipient Public Key"
                style={styles.input}
                value={recipient}
                onChangeText={setRecipient}
            />
            <TextInput
                placeholder="Amount"
                style={styles.input}
                keyboardType="numeric"
                value={amount}
                onChangeText={setAmount}
            />
            <TextInput
                placeholder="Your Secret Key"
                style={styles.input}
                secureTextEntry
                value={secretKey}
                onChangeText={setSecretKey}
            />
            <Button title={loading ? 'Sending...' : 'Send'} onPress={handleSend} disabled={loading} />
        </ScrollView>
    );
}

const styles = StyleSheet.create({
    container: {
        padding: 20,
        paddingTop: 60,
    },
    title: {
        fontSize: 24,
        marginBottom: 24,
        textAlign: 'center',
        fontWeight: 'bold',
    },
    input: {
        borderWidth: 1,
        borderColor: '#888',
        borderRadius: 8,
        padding: 10,
        marginBottom: 16,
    },
});