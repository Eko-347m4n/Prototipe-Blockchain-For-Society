import React, { useState } from 'react';
import { View, Text, TextInput, Button, StyleSheet, Alert } from 'react-native';
import { ethers } from 'ethers';
import { authenticateBiometrics } from '../services/biometricService';

interface SendEthProps {
  wallet: ethers.Wallet;
}

const SendEth: React.FC<SendEthProps> = ({ wallet }) => {
  const [recipientAddress, setRecipientAddress] = useState('');
  const [amount, setAmount] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSend = async () => {
    if (!recipientAddress || !amount) {
      Alert.alert('Error', 'Please fill in recipient address and amount.');
      return;
    }

    const authenticated = await authenticateBiometrics('Authenticate to send ETH');
    if (!authenticated) {
      Alert.alert('Authentication Required', 'Biometric authentication failed or cancelled.');
      return;
    }

    setLoading(true);
    try {
      const provider = new ethers.JsonRpcProvider("http://localhost:8545");
      const signer = new ethers.Wallet(wallet.privateKey, provider);

      const tx = {
        to: recipientAddress,
        value: ethers.parseEther(amount),
      };

      const transactionResponse = await signer.sendTransaction(tx);
      await transactionResponse.wait();

      Alert.alert('Success', `ETH sent successfully! Transaction hash: ${transactionResponse.hash}`);
      setRecipientAddress('');
      setAmount('');
    } catch (e: any) {
      console.error("Error sending ETH:", e);
      Alert.alert('Error', `Failed to send ETH: ${e.reason || e.message}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.sendEthContainer}>
      <Text style={styles.infoTitle}>Send ETH</Text>
      <TextInput
        style={styles.input}
        onChangeText={setRecipientAddress}
        value={recipientAddress}
        placeholder="Recipient Address"
      />
      <TextInput
        style={styles.input}
        onChangeText={setAmount}
        value={amount}
        placeholder="Amount (ETH)"
        keyboardType="numeric"
      />
      <Button title={loading ? 'Sending...' : 'Send ETH'} onPress={handleSend} disabled={loading} />
    </View>
  );
};

const styles = StyleSheet.create({
  sendEthContainer: {
    marginTop: 20,
    padding: 10,
    borderColor: '#999',
    borderWidth: 1,
    borderRadius: 5,
  },
  infoTitle: {
    fontWeight: 'bold',
    marginTop: 15,
  },
  input: {
    height: 40,
    borderColor: 'gray',
    borderWidth: 1,
    marginBottom: 10,
    paddingHorizontal: 8,
  },
});

export default SendEth;
