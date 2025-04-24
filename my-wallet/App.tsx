import 'react-native-get-random-values';
import React from 'react';
import { LogBox } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
// import { NavigationContainer } from '@react-navigation/native'; 
import { RootStackParamList } from './types';
import HomeScreen from './screens/HomeScreen';
import WalletScreen from './screens/WalletScreen';
import SendScreen from './screens/SendScreen';
import ReceiveScreen from './screens/ReceiveScreen';
import TransactionHistoryScreen from './screens/TransactionHistoryScreen';
import ScheduledScreen from './screens/ScheduledScreen';
// import ScheduleTx from './utils/ScheduledTx';
import ScheduleTx from './screens/ScheduleTx';
import TokenSwapScreen from './screens/TokenSwapScreen';

// import ScanScreen from './screens/ScanScreen';
import { Buffer } from 'buffer'; 
import StellPayScreen from './screens/StellPayScreen';
import LoginScreen from './screens/LoginScreen';
import RegisterScreen from './screens/registerscreen';



if (typeof globalThis.Buffer === 'undefined') { globalThis.Buffer = Buffer; }

const Stack = createNativeStackNavigator<RootStackParamList>();
console.log("App is rendering");

export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator screenOptions={{ headerShown: false,}} initialRouteName="StellPayScreen">
        <Stack.Screen name="Home" component={HomeScreen} />
        <Stack.Screen name="Send" component={SendScreen} />
        <Stack.Screen name="Wallet" component={WalletScreen} />
        <Stack.Screen name="Receive" component={ReceiveScreen} />
        <Stack.Screen name="TransactionHistory" component={TransactionHistoryScreen} />
        <Stack.Screen name="Scheduled" component={ScheduledScreen} />
        <Stack.Screen name="ScheduleTx" component={ScheduleTx} />
        <Stack.Screen name="TokenSwap" component={TokenSwapScreen} />
        
        <Stack.Screen name="StellPayScreen" component={StellPayScreen} />
        <Stack.Screen name="LoginScreen" component={LoginScreen}/>
        <Stack.Screen name="RegisterScreen" component={RegisterScreen}/>
        {/* <Stack.Screen name="Scan" component={ScanScreen} /> */}
        
      </Stack.Navigator>
    </NavigationContainer>
  );
}
