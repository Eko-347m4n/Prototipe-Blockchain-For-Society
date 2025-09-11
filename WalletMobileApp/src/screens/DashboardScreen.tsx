import React, { useState, useEffect } from 'react';
import { ScrollView, StyleSheet, View, Button } from 'react-native';
import { ethers } from 'ethers';
import * as WalletService from '../services/walletService';
import { isWalletRegistered } from '../services/identityService';
import WalletInfo from '../components/WalletInfo';
import IdentityRegistration from '../components/IdentityRegistration';
import WalletConnectManager from '../components/WalletConnectManager';
import SendEth from '../components/SendEth';
import PinManager from '../components/PinManager';
import WebViewer from '../components/WebViewer';

interface DashboardScreenProps {
  wallet: ethers.Wallet;
  onLogout: () => void;
}

const DashboardScreen: React.FC<DashboardScreenProps> = ({ wallet, onLogout }) => {
  const [isRegistered, setIsRegistered] = useState(false);
  const [isPinSet, setIsPinSet] = useState(false);

  useEffect(() => {
    const checkRegistration = async () => {
      const registered = await isWalletRegistered(wallet.address);
      setIsRegistered(registered);
    };
    checkRegistration();
  }, [wallet]);

  const handleLogout = async () => {
    await WalletService.deleteWallet();
    onLogout();
  };

  return (
    <ScrollView contentInsetAdjustmentBehavior="automatic">
      <View style={styles.container}>
        <WalletInfo wallet={wallet} isRegistered={isRegistered} onDelete={handleLogout} />
        {!isRegistered && (
          <IdentityRegistration wallet={wallet} onRegistrationSuccess={() => setIsRegistered(true)} />
        )}
        <PinManager onPinSet={() => setIsPinSet(true)} />
        <WalletConnectManager wallet={wallet} />
        <SendEth wallet={wallet} />
        <WebViewer />
        <Button title="Logout" onPress={handleLogout} color="red" />
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 24,
  },
});

export default DashboardScreen;
