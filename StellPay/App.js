import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import LoginScreen from './components/LoginScreen'; // Import your components
import StellPayScreen from './components/StellPayScreen';
import WalletScreen from './components/WalletScreen';
import RegisterScreen from './components/registerscreen';
import OTPScreen from './components/otpscreen';
import ForgotPasswordScreen from './components/ForgotPasswordScreen';
import HistoryScreen from './components/HistoryScreen';
import SendMoneyScreen from './components/SendMoneyScreen';
import SendFundsScreen from './components/SendFundsScreen';
import MoneySentScreen from './components/MoneySentScreen';
import ConfirmPaymentScreen from './components/ConfirmPaymentScreen';


const Stack = createNativeStackNavigator();

function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator
        initialRouteName="StellPayScreen"
        screenOptions={{
          headerShown: false,
        }}
      >
        <Stack.Screen name="Login" component={LoginScreen} />
        <Stack.Screen name="Register" component={RegisterScreen} />
        <Stack.Screen name="OTPScreen" component={OTPScreen} />
        <Stack.Screen name="WalletScreen" component={WalletScreen} />
        <Stack.Screen name="StellPayScreen" component={StellPayScreen} />
        <Stack.Screen name="ForgotPassword" component={ForgotPasswordScreen} />
        <Stack.Screen name="HistoryScreen" component={HistoryScreen}/>
        <Stack.Screen name="SendMoneyScreen" component={SendMoneyScreen}/>
        <Stack.Screen name="SendFundsScreen" component={SendFundsScreen}/>
        <Stack.Screen name="MoneySentScreen" component={MoneySentScreen}/>
        <Stack.Screen name="ConfirmPaymentScreen" component={ConfirmPaymentScreen}/>
        
      </Stack.Navigator>
    </NavigationContainer>
  );
}

export default App;
