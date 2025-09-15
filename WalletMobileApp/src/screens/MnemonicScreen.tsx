import React, { useState } from 'react';
import { View, Text, StyleSheet, Button, Alert } from 'react-native';
import { ethers } from 'ethers';
import BouncyCheckbox from "react-native-bouncy-checkbox";

interface MnemonicScreenProps {
  route: any;
  navigation: any;
}

const MnemonicScreen: React.FC<MnemonicScreenProps> = ({ route, navigation }) => {
  const { wallet, onComplete } = route.params as { wallet: ethers.Wallet, onComplete: (wallet: ethers.Wallet) => void };
  const [agreed, setAgreed] = useState(false);

  const mnemonic = wallet.mnemonic?.phrase;

  const handleContinue = () => {
    if (agreed) {
      onComplete(wallet);
    } else {
      Alert.alert("Confirmation Required", "Please confirm you have securely stored your recovery phrase.");
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Your Recovery Phrase</Text>
      <Text style={styles.subtitle}>
        Write down these 12 words in order and store them in a secure place. This is the only way to recover your wallet.
      </Text>
      
      <View style={styles.mnemonicContainer}>
        <Text style={styles.mnemonicText}>{mnemonic}</Text>
      </View>

      <View style={styles.warningBox}>
        <Text style={styles.warningTitle}>DO NOT share this phrase with anyone!</Text>
        <Text style={styles.warningText}>This phrase can be used to steal all your assets.</Text>
      </View>

      <BouncyCheckbox
        isChecked={agreed}
        onPress={(isChecked: boolean) => setAgreed(isChecked)}
        text="I have written down and secured my recovery phrase."
        textStyle={{ textDecorationLine: "none" }}
        style={{ marginTop: 30 }}
      />

      <View style={styles.buttonContainer}>
        <Button title="Continue to Dashboard" onPress={handleContinue} disabled={!agreed} />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
    backgroundColor: '#fff',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  subtitle: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
    marginBottom: 20,
  },
  mnemonicContainer: {
    padding: 20,
    borderWidth: 1,
    borderColor: '#007AFF',
    borderRadius: 8,
    backgroundColor: '#f0f8ff',
    marginBottom: 20,
  },
  mnemonicText: {
    fontSize: 18,
    fontWeight: '600',
    textAlign: 'center',
    lineHeight: 28,
    letterSpacing: 1,
  },
  warningBox: {
    padding: 15,
    backgroundColor: '#FFF3CD',
    borderColor: '#FFEEBA',
    borderWidth: 1,
    borderRadius: 8,
    alignItems: 'center',
  },
  warningTitle: {
    fontWeight: 'bold',
    color: '#856404',
    fontSize: 16,
  },
  warningText: {
    color: '#856404',
    textAlign: 'center',
  },
  buttonContainer: {
    marginTop: 20,
    width: '100%',
  },
});

export default MnemonicScreen;
