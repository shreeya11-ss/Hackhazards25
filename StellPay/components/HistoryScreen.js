import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, SafeAreaView } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';


const HistoryScreen = () => {
    const [selectedFilter, setSelectedFilter] = useState('All');
    const navigation = useNavigation(); // Initialize navigation
    const handleHomePress = () => {
        navigation.navigate('WalletScreen'); // Navigate to HomeScreen
    };

    const transactions = [
        { id: 1, type: 'Payment', date: 'Today', amount: '$20.00', status: 'Completed' },
        { id: 2, type: 'Received', date: 'Yesterday', amount: '$15.50', status: 'Completed' },
        { id: 3, type: 'Payment', date: '12/05/2024', amount: '$50.00', status: 'Failed' },
        { id: 4, type: 'Withdrawal', date: '11/05/2024', amount: '$100.00', status: 'Completed' },
        { id: 5, type: 'Payment', date: '10/05/2024', amount: '$25.00', status: 'Pending' },
        { id: 6, type: 'Received', date: '09/05/2024', amount: '$12.00', status: 'Completed' },
        { id: 7, type: 'Payment', date: '08/05/2024', amount: '$30.00', status: 'Refunded' },
        { id: 8, type: 'Withdrawal', date: '07/05/2024', amount: '$75.00', status: 'Completed' },
        { id: 9, type: 'Payment', date: '06/05/2024', amount: '$18.00', status: 'Completed' },
        { id: 10, type: 'Received', date: '05/05/2024', amount: '$9.99', status: 'Completed' },
    ];

    const getStatusColor = (status) => {
        switch (status) {
            case 'Completed':
                return '#34C759';
            case 'Failed':
                return '#FF3B30';
            case 'Pending':
                return '#FFCC00';
            case 'Refunded':
                return '#007AFF';
            default:
                return '#8E8E93';
        }
    };

    const getTransactionIcon = (type) => {
        switch (type) {
            case 'Payment':
                return { name: 'arrow-up-circle', color: '#FF3B30' };
            case 'Received':
                return { name: 'arrow-down-circle', color: '#34C759' };
            case 'Withdrawal':
                return { name: 'arrow-up-circle', color: '#007AFF' };
            default:
                return { name: 'ellipse', color: '#8E8E93' };
        }
    };

    const filterOptions = ['All', 'Payment', 'Received', 'Withdrawal'];

    const filteredTransactions =
        selectedFilter === 'All'
            ? transactions
            : transactions.filter((t) => t.type === selectedFilter);

    return (
        <SafeAreaView style={styles.container}>
            <View style={styles.header}>
                <Text style={styles.title}>History</Text>
            </View>

            {/* Filter Buttons */}
            <View style={styles.filterContainer}>
                {filterOptions.map((option) => (
                    <TouchableOpacity
                        key={option}
                        style={[
                            styles.filterButton,
                            selectedFilter === option && styles.activeFilterButton
                        ]}
                        onPress={() => setSelectedFilter(option)}
                    >
                        <Text
                            style={[
                                styles.filterText,
                                selectedFilter === option && styles.activeFilterText
                            ]}
                        >
                            {option}
                        </Text>
                    </TouchableOpacity>
                ))}
            </View>

            <ScrollView
                style={styles.transactionList}
                contentContainerStyle={{ paddingBottom: 100 }}
            >
                {filteredTransactions.map((transaction) => {
                    const { name, color } = getTransactionIcon(transaction.type);
                    return (
                        <View key={transaction.id} style={styles.transactionItem}>
                            <View style={styles.transactionIcon}>
                                <Ionicons name={name} size={24} color={color} />
                            </View>
                            <View style={styles.transactionDetails}>
                                <Text style={styles.transactionType}>{transaction.type}</Text>
                                <Text style={styles.transactionDate}>{transaction.date}</Text>
                            </View>
                            <Text style={styles.transactionAmount}>{transaction.amount}</Text>
                            <Text
                                style={[
                                    styles.transactionStatus,
                                    { color: getStatusColor(transaction.status) },
                                ]}
                            >
                                {transaction.status}
                            </Text>
                        </View>
                    );
                })}
            </ScrollView>

            {/* Bottom Navigation */}
            <View style={styles.bottomNav}>
                <TouchableOpacity style={styles.navItem}  onPress={handleHomePress}>
                    <Ionicons name="home-outline" size={24} color="#8E8E93" />
                    <Text style={styles.navLabel}>Home</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.navItem}>
                    <Ionicons name="cube-outline" size={24} color="#8E8E93" />
                    <Text style={styles.navLabel}>Stell Coin</Text>
                </TouchableOpacity>
                <View style={styles.navItem}>
                    <View style={styles.scanButton}>
                        <Ionicons name="scan-outline" size={28} color="white" />
                    </View>
                </View>
                <TouchableOpacity style={styles.navItem}>
                    <Ionicons name="time-outline" size={24} color="#34C759" />
                    <Text style={styles.navLabel}>History</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.navItem}>
                    <Ionicons name="settings-outline" size={24} color="#8E8E93" />
                    <Text style={styles.navLabel}>Settings</Text>
                </TouchableOpacity>
            </View>
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#1E2129',
    },
    header: {
        paddingVertical: 20,
        alignItems: 'center',
        borderBottomWidth: 1,
        borderBottomColor: '#3A3F4A',
    },
    title: {
        marginTop: 20,
        fontSize: 24,
        fontWeight: 'bold',
        color: '#FFFFFF',
    },
    filterContainer: {
        flexDirection: 'row',
        justifyContent: 'space-around',
        paddingVertical: 10,
        borderBottomWidth: 1,
        borderBottomColor: '#3A3F4A',
    },
    filterButton: {
        paddingHorizontal: 12,
        paddingVertical: 6,
        borderRadius: 20,
        backgroundColor: '#2C2F38',
    },
    activeFilterButton: {
        backgroundColor: '#007AFF',
    },
    filterText: {
        color: '#FFFFFF',
        fontSize: 14,
    },
    activeFilterText: {
        color: '#FFFFFF',
        fontWeight: 'bold',
    },
    transactionList: {
        paddingHorizontal: 20,
    },
    transactionItem: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingVertical: 15,
        borderBottomWidth: 1,
        borderBottomColor: '#3A3F4A',
    },
    transactionIcon: {
        marginRight: 15,
    },
    transactionDetails: {
        flex: 1,
    },
    transactionType: {
        fontSize: 16,
        fontWeight: 'bold',
        color: '#FFFFFF',
    },
    transactionDate: {
        fontSize: 14,
        color: '#8E8E93',
    },
    transactionAmount: {
        fontSize: 16,
        fontWeight: 'bold',
        color: '#FFFFFF',
    },
    transactionStatus: {
        fontSize: 14,
        fontWeight: 'bold',
    },
    bottomNav: {
        flexDirection: 'row',
        justifyContent: 'space-around',
        alignItems: 'center',
        backgroundColor: '#2C2F38',
        paddingVertical: 10,
        borderTopWidth: 1,
        borderTopColor: '#3A3F4A',
        marginBottom:15
    },
    navItem: {
        alignItems: 'center',
        justifyContent: 'center',
    },
    navLabel: {
        color: '#8E8E93',
        fontSize: 12,
        marginTop: 4,
    },
    scanButton: {
        backgroundColor: '#34C759',
        width: 60,
        height: 60,
        borderRadius: 30,
        alignItems: 'center',
        justifyContent: 'center',
        marginTop: -30,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3,
        shadowRadius: 5,
        elevation: 6,
    },
});

export default HistoryScreen;
