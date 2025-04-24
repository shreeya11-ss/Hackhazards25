import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  Button,
  Image,
  Alert,
  StyleSheet,
  ScrollView,
  TextInput,
  TouchableOpacity,
  ActivityIndicator,
  SafeAreaView
} from "react-native";
import {
  Keypair,
  Networks,
  TransactionBuilder,
  Operation,
  Asset,
} from "@stellar/stellar-base";
import { useNavigation } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { RootStackParamList } from "../types";
import {
  getScheduledTransactions,
  clearScheduledTransactions,
} from "../utils/ScheduledTx";
import { Ionicons, MaterialIcons } from "@expo/vector-icons";
import { account } from "./appwrite";

export default function WalletScreen() {
  const [wallet, setWallet] = useState<{ publicKey: string; secretKey: string } | null>(null);
  const [balance, setBalance] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [isBalanceVisible, setIsBalanceVisible] = useState(false);
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();

  const generateWallet = () => {
    const keypair = Keypair.random();
    const newWallet = {
      publicKey: keypair.publicKey(),
      secretKey: keypair.secret(),
    };
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
      await checkBalance();
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

   const handleLogout = async () => {
      try {
        await account.deleteSession('current');
        Alert.alert('Success', 'Logged out successfully!');
        navigation.navigate('StellPayScreen'); // Navigate back to the login screen
      } catch (error) {
        const err = error as Error;
        console.error('Logout failed:', error);
        Alert.alert('Error', err.message || 'Logout failed.');
      }
    };

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
              Alert.alert("Scheduled TX Sent", `Sent ${tx.amount} XLM to ${tx.recipient}`);
            } else {
              Alert.alert("Scheduled TX Failed", result.extras?.result_codes?.operations?.join(", ") || "Unknown error");
            }
          } catch (err) {
            Alert.alert("Scheduled TX Failed", "An error occurred while sending the scheduled transaction.");
          }
        }
      }
      await clearScheduledTransactions();
    };
    checkAndSendTransactions();
  }, [wallet]);

  if (!wallet) {
    return (
      <View style={styles.container}>
        <Text style={styles.title}>Welcome to Stellar Wallet</Text>
        <TouchableOpacity style={styles.generateBtn} onPress={generateWallet}>
          <Text style={styles.generateBtnText}>Generate Wallet</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Stellar Wallet</Text>

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

      <ScrollView contentContainerStyle={styles.scrollContent}>
        <View style={styles.tokenCard}>
          <Text style={styles.balanceLabel}>Stellar Token Balance</Text>
          <TouchableOpacity onPress={() => {
            if (!isBalanceVisible && !balance) checkBalance();
            setIsBalanceVisible(!isBalanceVisible);
          }}>
            {loading ? (
              <ActivityIndicator size="small" color="white" />
            ) : (
              <>
                <Text style={styles.balanceAmount}>
                  {isBalanceVisible ? `${balance || '0'} XLM` : '••••••'}
                </Text>
                <Text style={styles.tapText}>
                  {isBalanceVisible ? 'Tap to hide balance' : 'Tap to show balance'}
                </Text>
              </>
            )}
          </TouchableOpacity>

          <View style={styles.actionColumn}>
            <TouchableOpacity style={styles.actionButton} onPress={() => navigation.navigate('Send')} >
              <Ionicons name="send-outline" size={18} color="white" />
              <Text style={styles.actionButtonText}>SEND</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.actionButton}>
              <Ionicons name="arrow-down-outline" size={18} color="white" />
              <Text style={styles.actionButtonText}>RECEIVE</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.actionButton} onPress={fundWallet}>
              <MaterialIcons name="account-balance-wallet" size={18} color="white" />
              <Text style={styles.actionButtonText}>FUND WALLET</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.actionButton}
              onPress={() => navigation.navigate('ScheduleTx')}
            >
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
              <TouchableOpacity style={styles.navItem} onPress={() => navigation.navigate('TokenSwap')}>
                <Ionicons name="cube-outline" size={24} color="#8E8E93" />
                <Text style={styles.navLabel}>Stell Coin</Text>
              </TouchableOpacity>
              <View style={styles.navItem}>
                <View style={styles.scanButton}>
                  <Ionicons name="scan-outline" size={28} color="white" />
                </View>
              </View>
              <TouchableOpacity style={styles.navItem} onPress={() => navigation.navigate('TransactionHistory', { publicKey: wallet.publicKey })}>
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
}

  
  const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: '#1E2129',
      paddingTop: 50,
    },
    generateBtn: {
      backgroundColor: "#34C759",
      padding: 15,
      borderRadius: 10,
      alignItems: "center"
    },
    generateBtnText: { color: "white", fontSize: 18, fontWeight: "bold" },
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

function backAction(): boolean | null | undefined {
  throw new Error("Function not implemented.");
}
  