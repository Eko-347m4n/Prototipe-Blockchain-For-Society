import React, { useState, useEffect } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import LoginScreen from '../screens/LoginScreen';
import DashboardScreen from '../screens/DashboardScreen';
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

  if (loading) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <ActivityIndicator size="large" />
      </View>
    );
  }

  return (
    <NavigationContainer>
      <Stack.Navigator screenOptions={{ headerShown: false }}>
        {wallet ? (
          <Stack.Screen name="Dashboard">
            {(props) => <DashboardScreen {...props} wallet={wallet} onLogout={() => setWallet(null)} />}
          </Stack.Screen>
        ) : (
          <Stack.Screen name="Login">
            {(props) => <LoginScreen {...props} onLogin={(newWallet) => setWallet(newWallet)} />}
          </Stack.Screen>
        )}
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default AppNavigator;
