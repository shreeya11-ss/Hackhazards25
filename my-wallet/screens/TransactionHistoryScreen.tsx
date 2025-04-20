import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, StyleSheet, ActivityIndicator } from 'react-native';

export default function TransactionHistoryScreen({ route }: any) { // Type the route prop
    const [transactions, setTransactions] = useState<any[]>([]); // Type the transactions state
    const [loading, setLoading] = useState(true);
    const { publicKey } = route.params;

    useEffect(() => {
        const fetchTransactions = async () => {
            try {
                const res = await fetch(
                    `https://horizon-testnet.stellar.org/accounts/${publicKey}/transactions?limit=10&order=desc`
                );
                const data = await res.json();
                setTransactions(data._embedded.records);
            } catch (error) {
                console.error('Failed to fetch transactions:', error);
                // Consider showing an error message to the user here using Alert
            } finally {
                setLoading(false);
            }
        };

        fetchTransactions();
    }, [publicKey]);

    const renderItem = ({ item }: { item: any }) => ( // Type the item prop
        <View style={styles.txItem}>
            <Text style={styles.txText}>ID: {item.id.substring(0, 10)}...</Text>
            <Text style={styles.txText}>Date: {new Date(item.created_at).toLocaleString()}</Text>
            <Text style={styles.txText}>Memo: {item.memo || 'None'}</Text>
        </View>
    );

    return (
        <View style={styles.container}>
            <Text style={styles.title}>Recent Transactions</Text>
            {loading ? (
                <ActivityIndicator size="large" color="#000" />
            ) : (
                <FlatList
                    data={transactions}
                    keyExtractor={(item: any) => item.id} // Type the keyExtractor item
                    renderItem={renderItem}
                />
            )}
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        paddingTop: 50,
        paddingHorizontal: 20,
        backgroundColor: '#fff',
    },
    title: {
        fontSize: 22,
        fontWeight: 'bold',
        marginBottom: 10,
        textAlign: 'center',
    },
    txItem: {
        backgroundColor: '#f1f1f1',
        padding: 10,
        borderRadius: 8,
        marginBottom: 10,
    },
    txText: {
        fontSize: 14,
        color: '#333',
    },
});