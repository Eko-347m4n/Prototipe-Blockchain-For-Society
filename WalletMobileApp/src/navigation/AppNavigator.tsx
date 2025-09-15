import React, { useState, useEffect } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import LoginScreen from '../screens/LoginScreen';
import DashboardScreen from '../screens/DashboardScreen';
import RegistrationScreen from '../screens/RegistrationScreen';
import MnemonicScreen from '../screens/MnemonicScreen'; // Import MnemonicScreen
import * as WalletService from '../services/walletService';
import { ethers } from 'ethers';
import { View, ActivityIndicator } from 'react-native';

const Stack = createNativeStackNavigator();

const AppNavigator = () => {
  const [wallet, setWallet] = useState<ethers.Wallet | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      const loadedWallet = await WalletService.loadWallet();
      setWallet(loadedWallet);
      setLoading(false);
    };
    load();
  }, []);

  const handleLogout = async () => {
    setLoading(true);
    await WalletService.deleteWallet();
    setWallet(null);
    setLoading(false);
  };

  if (loading) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <ActivityIndicator size="large" />
      </View>
    );
  }

  return (
    <NavigationContainer>
      <Stack.Navigator>
        {wallet ? (
          // If wallet exists, go to Dashboard
          <Stack.Screen name="Dashboard">
            {(props) => <DashboardScreen {...props} wallet={wallet} onLogout={handleLogout} />}
          </Stack.Screen>
        ) : (
          // If no wallet, show Login and Registration screens
          <>
            <Stack.Screen name="Login">
              {(props) => <LoginScreen {...props} onLogin={(newWallet) => setWallet(newWallet)} />}
            </Stack.Screen>
            <Stack.Screen name="Register" options={{ headerTitle: 'New Identity Registration' }}>
              {(props) => <RegistrationScreen {...props} onRegistrationSuccess={(newWallet) => setWallet(newWallet)} />}
            </Stack.Screen>
            <Stack.Screen name="Mnemonic" options={{ headerTitle: 'Backup Recovery Phrase' }}>
              {(props) => <MnemonicScreen {...props} />}
            </Stack.Screen>
          </>
        )}
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default AppNavigator;
