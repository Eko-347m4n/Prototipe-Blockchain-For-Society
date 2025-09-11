import React from 'react';
import { View, Text, Button, StyleSheet } from 'react-native';
import { ethers } from 'ethers';

interface WalletInfoProps {
  wallet: ethers.Wallet;
  isRegistered: boolean;
  onDelete: () => void;
}

const WalletInfo: React.FC<WalletInfoProps> = ({ wallet, isRegistered, onDelete }) => {
  return (
    <View style={styles.walletInfoContainer}>
      <Text>Wallet Loaded Successfully!</Text>
      <Text style={styles.infoTitle}>Address:</Text>
      <Text selectable>{wallet.address}</Text>

      {isRegistered ? (
        <Text style={[styles.infoTitle, { color: 'green' }]}>
          Identity Registered!
        </Text>
      ) : null}

      <Text style={styles.infoTitle}>Mnemonic Phrase:</Text>
      <Text selectable>{wallet.mnemonic?.phrase || 'N/A'}</Text>

      <View style={styles.dangerZone}>
        <Text style={styles.infoTitle}>Private Key:</Text>
        <Text selectable>{wallet.privateKey}</Text>
        <Text style={styles.dangerText}>
          Do NOT share your Mnemonic Phrase or Private Key. Anyone with
          this information can take full control of your wallet.
        </Text>
      </View>
      <Button
        title="Delete Wallet"
        onPress={onDelete}
        color="red"
      />
    </View>
  );
};

const styles = StyleSheet.create({
  walletInfoContainer: {
    marginTop: 30,
    padding: 10,
    borderColor: '#999',
    borderWidth: 1,
    borderRadius: 5,
  },
  infoTitle: {
    fontWeight: 'bold',
    marginTop: 15,
  },
  dangerZone: {
    marginTop: 20,
    padding: 10,
    backgroundColor: '#FFD2D2',
    borderColor: 'red',
    borderWidth: 1,
    borderRadius: 5,
  },
  dangerText: {
    marginTop: 10,
    color: '#500',
  },
});

export default WalletInfo;
