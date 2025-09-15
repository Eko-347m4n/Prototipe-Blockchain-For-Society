import React, { useState } from 'react';
import { View, Button, ActivityIndicator, StyleSheet, Text } from 'react-native';
import * as WalletService from '../services/walletService';
import { ethers } from 'ethers';

// Props now include navigation for moving to the registration screen
interface LoginScreenProps {
  navigation: any; // Basic navigation prop
  onLogin: (wallet: ethers.Wallet) => void;
}

const LoginScreen: React.FC<LoginScreenProps> = ({ navigation, onLogin }) => {
  const [loading, setLoading] = useState(false);

  // This function is now for loading an existing wallet
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
        <Text style={styles.title}>Digital Identity Wallet</Text>
        <Text style={styles.subtitle}>Your secure gateway to public services.</Text>
        
        {/* Changed button to navigate to Registration Screen */}
        <Button title="Create New Identity" onPress={() => navigation.navigate('Register')} />
        
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
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
    marginBottom: 40,
  }
});

export default LoginScreen;
