import React, { useState } from 'react';
import { View, Button, ActivityIndicator, StyleSheet, Text } from 'react-native';
import * as WalletService from '../services/walletService';
import { ethers } from 'ethers';

interface LoginScreenProps {
  onLogin: (wallet: ethers.Wallet) => void;
}

const LoginScreen: React.FC<LoginScreenProps> = ({ onLogin }) => {
  const [loading, setLoading] = useState(false);

  const handleCreateWallet = async () => {
    setLoading(true);
    const newWallet = await WalletService.createNewWallet();
    if (newWallet) {
      onLogin(newWallet);
    }
    setLoading(false);
  };

  const handleLoadWallet = async () => {
    setLoading(true);
    const loadedWallet = await WalletService.loadWallet();
    if (loadedWallet) {
      onLogin(loadedWallet);
    }
    setLoading(false);
  };

  if (loading) {
    return (
      <View style={styles.container}>
        <ActivityIndicator size="large" />
        <Text>Loading Wallet...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
        <Text style={styles.title}>Welcome to your Mobile Wallet</Text>
        <Button title="Create New Wallet" onPress={handleCreateWallet} />
        <View style={{ marginVertical: 10 }} />
        <Button title="Load Existing Wallet" onPress={handleLoadWallet} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 24,
  },
  title: {
    fontSize: 24,
    fontWeight: '600',
    textAlign: 'center',
    marginBottom: 20,
  },
});

export default LoginScreen;
