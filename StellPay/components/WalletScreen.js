import React, { useState } from 'react';
import { StyleSheet, View, Text, TouchableOpacity, ScrollView, Image, TextInput } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

const WalletScreen = () => {
  const [searchQuery, setSearchQuery] = useState('');

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <View style={styles.headerLeft}>
          <Image
            source={{ uri: 'https://via.placeholder.com/50/0000FF/808080?Text=User' }}
            style={styles.profileImage}
          />
          <Text style={styles.greeting}>Hi! Jasker</Text>
        </View>
        <View style={styles.headerRight}>
          <TouchableOpacity>
            <Ionicons name="notifications-outline" size={24} color="white" />
          </TouchableOpacity>
          <TouchableOpacity style={styles.menuButton}>
            <View style={styles.menuBar}></View>
            <View style={styles.menuBar}></View>
          </TouchableOpacity>
        </View>
      </View>

      {/* Search Bar */}
      <View style={styles.searchBarContainer}>
        <TextInput
          style={styles.searchBar}
          placeholder="Search Contacts..."
          placeholderTextColor="#8E8E93"
          value={searchQuery}
          onChangeText={setSearchQuery}
        />
        <Ionicons name="search" size={24} color="white" style={{ marginLeft: 10 }} />
      </View>

      {/* Scrollable Main Content */}
      <ScrollView contentContainerStyle={styles.scrollContent}>
        {/* Balance Card */}
        <View style={styles.balanceCard}>
          <Text style={styles.balanceLabel}>Balance</Text>
          <Text style={styles.balanceAmount}>$29.000,45</Text>
          <View style={styles.balanceChange}>
            <Ionicons name="arrow-up" size={16} color="#34C759" />
            <Text style={styles.balanceChangeText}>+3.4% (+$2,134.42)</Text>
          </View>
          <View style={styles.actionButtons}>
            <TouchableOpacity style={styles.actionButton}>
              <Ionicons name="send-outline" size={20} color="white" />
              <Text style={styles.actionButtonText}>SEND</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.actionButton}>
              <Ionicons name="arrow-down-outline" size={20} color="white" />
              <Text style={styles.actionButtonText}>REQUEST</Text>
            </TouchableOpacity>
          </View>
          <TouchableOpacity style={styles.addButton}>
            <Ionicons name="add" size={24} color="white" />
          </TouchableOpacity>
        </View>

        {/* Stellar Token Card */}
        <View style={styles.tokenCard}>
          <Text style={styles.balanceLabel}>Stellar Token Worth</Text>
          <Text style={styles.balanceAmount}>12,500 XLM</Text>
          <View style={styles.actionButtons}>
            <TouchableOpacity style={styles.actionButton}>
              <Ionicons name="send-outline" size={20} color="white" />
              <Text style={styles.actionButtonText}>SEND</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.actionButton}>
              <Ionicons name="arrow-down-outline" size={20} color="white" />
              <Text style={styles.actionButtonText}>REQUEST</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Accounts ScrollView */}
        <ScrollView horizontal style={styles.accountsScrollView} showsHorizontalScrollIndicator={false}>
          <View style={[styles.accountCard, { height: 130, width: 250 }]}>
            <View style={styles.accountIcon}>
              <Ionicons name="banknote-outline" size={24} color="#34C759" />
            </View>
            <Text style={styles.accountLabel}>BANK</Text>
            <Text style={styles.accountAmount}>$12.244,81</Text>
            <Text style={styles.accountDetails}>Account Number: XXXX XXXX XXXX 1234</Text>
          </View>

          <View style={[styles.accountCard, { height: 130, width: 250 }]}>
            <View style={styles.accountIcon}>
              <Ionicons name="piggy-bank-outline" size={24} color="#34C759" />
            </View>
            <Text style={styles.accountLabel}>SAVINGS</Text>
            <Text style={styles.accountAmount}>$8.460,24</Text>
            <Text style={styles.accountDetails}>Interest Rate: 2.5%</Text>
          </View>

          <View style={[styles.accountCard, { height: 130, width: 250 }]}>
            <View style={styles.accountIcon}>
              <Ionicons name="card-outline" size={24} color="#34C759" />
            </View>
            <Text style={styles.accountLabel}>CREDIT</Text>
            <Text style={styles.accountAmount}>$3.289,55</Text>
            <Text style={styles.accountDetails}>Credit Limit: $10,000</Text>
          </View>
        </ScrollView>

        {/* Schedule Transaction */}
        <TouchableOpacity style={styles.historyButton}>
          <Text style={styles.historyButtonText}>Schedule transaction</Text>
        </TouchableOpacity>
      </ScrollView>

      {/* Bottom Navigation */}
      <View style={styles.bottomNav}>
        <TouchableOpacity style={styles.navItem}>
          <Ionicons name="home-outline" size={24} color="#34C759" />
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
          <Ionicons name="time-outline" size={24} color="#8E8E93" />
          <Text style={styles.navLabel}>History</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.navItem}>
          <Ionicons name="settings-outline" size={24} color="#8E8E93" />
          <Text style={styles.navLabel}>Settings</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#1E2129',
    paddingTop: 50,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    marginBottom: 10,
  },
  headerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  profileImage: {
    width: 40,
    height: 40,
    borderRadius: 20,
    marginRight: 10,
  },
  greeting: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
  },
  headerRight: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  menuButton: {
    marginLeft: 15,
    width: 24,
    height: 24,
    justifyContent: 'space-around',
  },
  menuBar: {
    width: '100%',
    height: 3,
    backgroundColor: 'white',
    borderRadius: 2,
  },
  searchBarContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#2C303A',
    borderRadius: 10,
    marginHorizontal: 20,
    paddingHorizontal: 15,
    marginBottom: 15,
    height: 45,
  },
  searchBar: {
    flex: 1,
    color: 'white',
  },
  balanceCard: {
    backgroundColor: '#2C303A',
    borderRadius: 15,
    padding: 20,
    marginHorizontal: 20,
    marginBottom: 20,
  },
  balanceLabel: {
    color: '#8E8E93',
    fontSize: 16,
    marginBottom: 5,
  },
  balanceAmount: {
    color: 'white',
    fontSize: 28,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  balanceChange: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 15,
  },
  balanceChangeText: {
    color: '#34C759',
    marginLeft: 5,
    fontSize: 14,
  },
  actionButtons: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginTop: 15,
  },
  actionButton: {
    backgroundColor: '#3A3F4A',
    borderRadius: 10,
    paddingVertical: 12,
    paddingHorizontal: 20,
    flexDirection: 'row',
    alignItems: 'center',
  },
  actionButtonText: {
    color: 'white',
    marginLeft: 8,
    fontWeight: 'bold',
  },
  addButton: {
    position: 'absolute',
    top: 20,
    right: 20,
    backgroundColor: '#34C759',
    borderRadius: 20,
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
  },
  tokenCard: {
    backgroundColor: '#2C303A',
    borderRadius: 15,
    padding: 20,
    marginHorizontal: 20,
    marginBottom: 20,
  },
  accountsScrollView: {
    paddingHorizontal: 20,
    marginBottom: 20,
  },
  accountCard: {
    backgroundColor: '#2C303A',
    borderRadius: 15,
    padding: 15,
    marginRight: 15,
  },
  accountIcon: {
    backgroundColor: 'rgba(52, 199, 89, 0.2)',
    borderRadius: 10,
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 10,
  },
  accountLabel: {
    color: '#8E8E93',
    fontSize: 14,
  },
  accountAmount: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 5,
  },
  accountDetails: {
    color: '#8E8E93',
    fontSize: 12,
  },
  historyButton: {
    backgroundColor: '#34C759',
    borderRadius: 10,
    paddingVertical: 15,
    marginHorizontal: 20,
    marginBottom: 20,
    alignItems: 'center',
  },
  historyButtonText: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 16,
  },
  bottomNav: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    backgroundColor: '#2C303A',
    paddingVertical: 15,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
  },
  navItem: {
    alignItems: 'center',
  },
  navLabel: {
    color: '#8E8E93',
    fontSize: 12,
    marginTop: 5,
  },
  scanButton: {
    backgroundColor: '#34C759',
    borderRadius: 25,
    width: 50,
    height: 50,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 10,
  },
  scrollContent: {
    paddingBottom: 20,
  },
});

export default WalletScreen;
