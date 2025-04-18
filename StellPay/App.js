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
      </Stack.Navigator>
    </NavigationContainer>
  );
}

export default App;
