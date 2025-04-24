import React, { useState,useEffect } from 'react';
import { StyleSheet, View, Text, TouchableOpacity, ScrollView, Image, TextInput ,BackHandler,Alert} from 'react-native';
import { Ionicons, MaterialIcons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { account } from '../../my-wallet/screens/appwrite';

const WalletScreen = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [isBalanceVisible, setIsBalanceVisible] = useState(false);
  const navigation = useNavigation();

  useEffect(() => {
    const backAction = () => {
      Alert.alert('Exit App', 'Are you sure you want to exit?', [
        {
          text: 'Cancel',
          onPress: () => null,
          style: 'cancel',
        },
        { text: 'Yes', onPress: () => BackHandler.exitApp() },
      ]);
      return true; // Prevent default back button behavior
    };

    const backHandler = BackHandler.addEventListener(
      'hardwareBackPress',
      backAction,
    );

    return () => backHandler.remove(); // Clean up the event listener
  }, []);

  const handleHistoryPress = () => {
    navigation.navigate('HistoryScreen');
  };

  const handleLogout = async () => {
    try {
      await account.deleteSession('current');
      Alert.alert('Success', 'Logged out successfully!');
      navigation.navigate('StellPayScreen'); // Navigate back to the login screen
    } catch (error) {
      console.error('Logout failed:', error);
      Alert.alert('Error', error.message || 'Logout failed.');
    }
  };

  return (
    <View style={styles.container}>
      {/* Top Title */}
      <Text style={styles.title}>Stellar Wallet</Text>

      {/* Header */}
      <View style={styles.header}>
        <View style={styles.headerLeft}>
          <Image
            source={{ uri: 'https://via.placeholder.com/50/0000FF/808080?Text=User' }}
            style={styles.profileImage}
          />
          <Text style={styles.greeting}>Hi, Jasker</Text>
        </View>
        <View style={styles.headerRight}>
          <TouchableOpacity>
            <Ionicons name="notifications-outline" size={24} color="white" />
          </TouchableOpacity>
          <TouchableOpacity style={styles.iconButton} onPress={handleLogout}>
          <View style={styles.powerButtonCircle}>
            <View style={styles.powerButtonLine} />
          </View>
        </TouchableOpacity>
        </View>
      </View>

      {/* Search Bar */}
      <View style={styles.searchBarContainer}>
        <Ionicons name="search" size={20} color="#8E8E93" style={{ marginRight: 10 }} />
        <TextInput
          style={styles.searchBar}
          placeholder="Search Contacts..."
          placeholderTextColor="#8E8E93"
          value={searchQuery}
          onChangeText={setSearchQuery}
        />
      </View>

      {/* Scrollable Content */}
      <ScrollView contentContainerStyle={styles.scrollContent}>
        {/* Token Card with Send/Request/Fund/Schedule */}
        <View style={styles.tokenCard}>
          <Text style={styles.balanceLabel}>Stellar Token Balance</Text>
          <TouchableOpacity onPress={() => setIsBalanceVisible(!isBalanceVisible)}>
            <Text style={styles.balanceAmount}>
              {isBalanceVisible ? '12,500 XLM' : '••••••'}
            </Text>
            <Text style={styles.tapText}>
              {isBalanceVisible ? 'Tap to hide balance' : 'Tap to show balance'}
            </Text>
          </TouchableOpacity>

          {/* Action Buttons */}
          <View style={styles.actionColumn}>
            <TouchableOpacity style={styles.actionButton}>
              <Ionicons name="send-outline" size={18} color="white" />
              <Text style={styles.actionButtonText}>SEND</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.actionButton}>
              <Ionicons name="arrow-down-outline" size={18} color="white" />
              <Text style={styles.actionButtonText}>REQUEST</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.actionButton}>
              <MaterialIcons name="account-balance-wallet" size={18} color="white" />
              <Text style={styles.actionButtonText}>FUND WALLET</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.actionButton}>
              <Ionicons name="calendar-outline" size={18} color="white" />
              <Text style={styles.actionButtonText}>SCHEDULE</Text>
            </TouchableOpacity>
          </View>
        </View>
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
        <TouchableOpacity style={styles.navItem} onPress={handleHistoryPress}>
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
  title: {
    color: 'white',
    fontSize: 24,
    fontWeight: '700',
    alignSelf: 'center',
    marginBottom: 10,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    marginBottom: 10,
  },
  iconButton: {
    marginLeft: 15, // Space between the icons
    padding: 10,
  },
  icon: {
    fontSize: 24,
    color: '#555',
  },
  powerButtonCircle: {
    width: 24,
    height: 24,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: '#ff3d00', // Red border
    justifyContent: 'center',
    alignItems: 'center',
  },
  powerButtonLine: {
    width: 2,
    height: 12,
    backgroundColor: '#ff3d00', // Red line
    borderRadius: 1,
    position: 'absolute',
    top: 4,
  },
  content: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  headerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  profileImage: {
    width: 42,
    height: 42,
    borderRadius: 21,
    marginRight: 10,
  },
  greeting: {
    color: 'white',
    fontSize: 20,
    fontWeight: '600',
  },
  headerRight: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  menuButton: {
    marginLeft: 15,
    width: 24,
    height: 24,
    justifyContent: 'space-between',
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
    borderRadius: 12,
    marginHorizontal: 20,
    paddingHorizontal: 15,
    height: 45,
    marginBottom: 15,
  },
  searchBar: {
    flex: 1,
    color: 'white',
    fontSize: 16,
  },
  scrollContent: {
    paddingBottom: 30,
  },
  tokenCard: {
    backgroundColor: '#2C303A',
    borderRadius: 18,
    padding: 22,
    marginHorizontal: 20,
    marginBottom: 20,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 8,
    elevation: 4,
  },
  balanceLabel: {
    color: '#8E8E93',
    fontSize: 16,
    marginBottom: 6,
  },
  balanceAmount: {
    color: 'white',
    fontSize: 30,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  tapText: {
    color: '#8E8E93',
    fontSize: 12,
    marginBottom: 15,
  },
  actionColumn: {
    flexDirection: 'column',
    justifyContent: 'space-between',
    marginTop: 10,
  },
  actionButton: {
    backgroundColor: '#3A3F4A',
    borderRadius: 10,
    paddingVertical: 10,
    paddingHorizontal: 18,
    flexDirection: 'column',
    alignItems: 'center',
    flex: 1,
    marginVertical: 5,
    justifyContent: 'center',
  },
  actionButtonText: {
    color: 'white',
    marginLeft: 6,
    fontWeight: '600',
    fontSize: 12,
  },
  bottomNav: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    backgroundColor: '#2C303A',
    paddingVertical: 14,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    elevation: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -1 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  navItem: {
    alignItems: 'center',
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
    shadowColor: '#34C759',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.3,
    shadowRadius: 10,
    elevation: 6,
  },
  
});

export default WalletScreen;