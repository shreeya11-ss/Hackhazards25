import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, StyleSheet, ActivityIndicator } from 'react-native';

export default function TransactionHistoryScreen({ route }: any) {
    const [transactions, setTransactions] = useState<any[]>([]);
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
            } finally {
                setLoading(false);
            }
        };

        fetchTransactions();
    }, [publicKey]);

    const renderItem = ({ item }: { item: any }) => (
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
                <ActivityIndicator size="large" color="#2ECC71" />
            ) : (
                <View style={styles.listContainer}>
                    <FlatList
                        data={transactions}
                        keyExtractor={(item: any) => item.id}
                        renderItem={renderItem}
                        contentContainerStyle={{ paddingBottom: 20 }}
                    />
                </View>
            )}
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        paddingTop: 50,
        paddingHorizontal: 20,
        backgroundColor: '#1E2129',
    },
    title: {
        fontSize: 22,
        fontWeight: 'bold',
        marginBottom: 10,
        textAlign: 'center',
        color: '#ffffff',
    },
    listContainer: {
        backgroundColor: '#3A3F4A',
        padding: 15,
        borderRadius: 12,
        marginTop: 10,
    },
    txItem: {
        backgroundColor: '#ffffff',
        padding: 10,
        borderRadius: 8,
        marginBottom: 10,
    },
    txText: {
        fontSize: 14,
        color: '#333',
    },
});
