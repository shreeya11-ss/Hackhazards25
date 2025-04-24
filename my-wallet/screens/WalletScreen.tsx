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
import * as Clipboard from 'expo-clipboard';
import { useNavigation } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { RootStackParamList } from "../types";
import {
  getScheduledTransactions,
  clearScheduledTransactions,
} from "../utils/ScheduledTx";
import { Ionicons, MaterialIcons } from "@expo/vector-icons";
import { account,client } from "./appwrite";
import AsyncStorage from "@react-native-async-storage/async-storage";


export default function WalletScreen() {
  const [wallet, setWallet] = useState<{ publicKey: string; secretKey: string } | null>(null);
  const [balance, setBalance] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [isBalanceVisible, setIsBalanceVisible] = useState(false);
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();

  const [publicKey, setPublicKey] = useState('');
const [secretKey, setSecretKey] = useState('');



const [isKeysVisible, setIsKeysVisible] = useState(false);

const toggleKeysVisibility = () => {
  setIsKeysVisible(!isKeysVisible);
};

const handleCopy = (key: string, label: string) => {
  Clipboard.setString(key);
  Alert.alert('Copied', `${label} copied to clipboard`);
};
 

  const [userName, setUserName] = useState('');

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const user = await account.get();
        setUserName(user.name);
      } catch (error) {
        const err = error as Error;
        console.error('Error fetching user:', err.message);
      }
    };

    fetchUser();
  }, []);


  interface UserPreferences {
    name: string;
    email: string;
    // Add other fields as per your user data structure
  }

  const [user, setUser] = useState<UserPreferences | null>(null);
  

   useEffect(() => {
    // Function to fetch user data
    const fetchUserData = async () => {
      try {
  
        const userData = await account.get(); // Fetch user info from Appwrite
        setUser(userData); // Set user data to state
      } catch (error) {
        const err = error as Error;
        if (err.message.includes("missing scope")) {
          // Handle the error silently (without logging it)
          return;
        }
        console.error(error); // Show other errors
      }
    };

    fetchUserData();
  }, []);

  

  // Load wallet from AsyncStorage
  useEffect(() => {
    const loadWallet = async () => {
      const pub = await AsyncStorage.getItem('publicKey');
      const sec = await AsyncStorage.getItem('secretKey');
      if (pub && sec) {
        setWallet({ publicKey: pub, secretKey: sec });
      }
    };
    loadWallet();
  }, []);


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
            source={{ uri: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAMwAAADACAMAAAB/Pny7AAAAMFBMVEXk5ueutLfb3t+nrrHn6eqrsbTh4+S7wMPT1tixt7rKztDBxsi3vL/q7O3Y293Q09Wdj+FKAAAFPklEQVR4nO2c25LbIAxADRZgrv7/vy042SabOyBH8g7npdP2xWckQBDQNA0Gg8FgMBgMBoPBYDAYDAaDwWAwGAwGg92BzKRlQevtL0cFQMvFOe/NhnduSfqQPtlk8SZYdY0Nxi86HswH4uKDFUrcUoR8OlJ4skoQD0zOPsKG5TDRick+E/kvZNMhdECb+Y1KsZmNZm8DsKp3YfkZPSv1x74BtP8gLGeYBwdS+NxlGzl8bT5OsUuqLRNXHVensuk4pmtOg0uGpQ24FpViQ/3l98Da6CLEyi00sNhmGcFsTgMZmgbMhrLM1hvf7lJWT+rP/8Vas1Y+sGE0CYDsictmwyfRwPTKqBCpJc7A0pdkW2i4zM+xW6VAbXEiuv7AlCKNRaIBgkrGUnsU4to7+s9wCA101DHXqEBtUqYyHBfBoeAEj+WiPLmM7qgwb2SCJHaBFWnIZCx1nkFXufwb5WldJt1dll3JGNo8gxTQXHKe0W45O3b+D1C0gwbajpeeyRDv0RDHf5kBNKWLRBz/ZQYg3XAmg+giRJCEMriTmaA9QYOEt/7Ty+CVzBtqIZXBHP9Fhs6l/LqEKjP/JRnayCCnGW1k/tSYwZ7NxjqDJoN2ArBhKcuZXGhiutDWZpP+S1sAzPOMsjmjlcHdaRJvm3t+Mb+Hss7M9PxkfkdIpC6ohwDE47/8bIbmUm440cpg1gCB/NoJoC2byhBnGWqe0f8OCBIrz2gLsxMRK88MvQvCxZkzxCvmiYhzEBg4uOTSGeWGBvm8fCJilDRsrjVNCLeaeMRlwtgIzPRrzIXOn2mUZROYTOqMDPV1ht90JRrxDvOOnpMN8ssMt0D77QYG1fIdrRto+vs/j2jbpjF93dRUcSrBoPB/CDTY8Llqfkt1lcakVH5M9E9fAd+jBP1FxpfA+nFwVGC2Vt4D8rPg5LBwHfpXwLSYt881lfJ8X2j+AvRi5lc6SpmF7yx2C+jk1ROf/O8+8StgXqNXc++j5jnQ/qLUCkzJ2zlT2meUP2d7lJHyEIhxksvqnFsXOcVDdGd4CfyH+ksa2b5cn5HnJjonzv95DPKn5u9PKSeX9yYEW6bibeGxIRjv3ZpSVpu4GxUPmYpEKPOWul87T1OBsiY7LUlyNdpE1hwL+2yB+S2VlXKcXJL8ki5CFjFBPAjGS6WT0MRolotRuq0rU4XHlVAeS3n5YXGiCVG70pWp69xMWOvpWwRBRLtzrqwj7a8VJyc+GO0f68yGbIuTt2GIJmedQNPzSL7es7Qyi0V/txgt9fAuKptOWL94xllUKg5h6lFh/dZGFKR724yt10aY9RuFAUwO98bsMx0vd19Howy7ZtiVjnX7LjsQ/d4ZdmUjwp7BAY38Kuutzn5nnrB8KcMuzH6fNQfAdVWTbahdLqFXtS7EtBH4z1BAftIdcxebeUVONXjftHRHHdxOezF9fehfgzoNxJUwLgWFZxNX0rig2sBCHBdEG9KxfwHlbn1X60JMEK4+fdZ9+SsgvOJGaV6Gguq9ko79RLYL1dehEiT5pHzN3DUJ9LdhxKXnJjdOtz9Eum7Z8oqL6GmDGJkl2UbjJQJIDF2UaQsN0lMSbJrmgIjaIAsN1fQAitu0/INtqGqQXy3j0dLUEfdxPCKq/m0qm8r/nvqdDW5/PFTq3w7g9pPApfbCfc4y6k9+Tm3rQFb7mFuq+wag9sbApvIwHbdxITZz1aBhPWRKq/qawLAsmC/UDRqMTv97UrfScNsv32BrZDgvmQVVJWNm3lR125HMqVs1gTdVLoPBYDAYDAZH4R8eaVEbhZaf7QAAAABJRU5ErkJggg==' }}
            style={styles.profileImage}
          />
          <Text style={styles.greeting}>Welcome </Text>
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
            <TouchableOpacity style={styles.actionButton} onPress={() => navigation.navigate('Receive', { publicKey: wallet?.publicKey || '' })}>
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

        <View style={styles.container}>
      <Text style={styles.heading}>Wallet Keys</Text>
      
      {/* Button to toggle key visibility */}
      <TouchableOpacity
        style={styles.toggleButton}
        onPress={toggleKeysVisibility}
      >
        <Text style={styles.toggleButtonText}>
          {isKeysVisible ? 'Hide Keys' : 'Show Keys'}
        </Text>
      </TouchableOpacity>
      
      {/* Public Key Section */}
      {isKeysVisible && (
        <View style={styles.keyContainer}>
          <Text style={styles.keyLabel}>Public Key:</Text>
          <Text selectable style={styles.keyText}>
            {wallet.publicKey}
          </Text>
          <TouchableOpacity
            style={styles.copyButton}
            onPress={() => handleCopy(wallet.publicKey, 'Public key')}
          >
            <Text style={styles.copyButtonText}>Copy Public Key</Text>
          </TouchableOpacity>
        </View>
      )}

      {/* Secret Key Section */}
      {isKeysVisible && (
        <View style={styles.keyContainer}>
          <Text style={styles.keyLabel}>Secret Key:</Text>
          <Text selectable style={styles.keyText}>
            {wallet.secretKey}
          </Text>
          <TouchableOpacity
            style={styles.copyButton}
            onPress={() => handleCopy(wallet.secretKey, 'Secret key')}
          >
            <Text style={styles.copyButtonText}>Copy Secret Key</Text>
          </TouchableOpacity>
        </View>
      )}
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
    toggleButton: {
      backgroundColor: '#34C759',
      padding: 10,
      borderRadius: 5,
      marginBottom: 20,
      alignItems: 'center',
      width:120,
      marginLeft:132,
    },
    toggleButtonText: {
      color: '#fff',
      fontSize: 16,
      
    },
    keyContainer: {
      marginBottom: 20,
      backgroundColor: '#fff',
      padding: 15,
      borderRadius: 10,
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.2,
      shadowRadius: 5,
      elevation: 2,
    },
    keyLabel: {
      fontSize: 16,
      fontWeight: 'bold',
      marginBottom: 5,
    },
    keyText: {
      fontSize: 14,
      color: '#333',
      marginBottom: 10,
    },
    heading: {
      fontSize: 24,
      fontWeight: 'bold',
      marginBottom: 20,
      textAlign: 'center',
      color:'#fff'
    },
    copyButton: {
      backgroundColor: '#28A745',
      paddingVertical: 8,
      paddingHorizontal: 16,
      borderRadius: 5,
      alignItems: 'center',
    },
    copyButtonText: {
      color: '#fff',
      fontSize: 14,
    },
    
  });

function backAction(): boolean | null | undefined {
  throw new Error("Function not implemented.");
}
  