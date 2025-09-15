import React, { useState } from 'react';
import { View, Text, TextInput, Button, StyleSheet, Alert } from 'react-native';
import * as WalletService from '../services/walletService';
import { ethers } from 'ethers';

interface RegistrationScreenProps {
  navigation: any;
  onRegistrationSuccess: (wallet: ethers.Wallet) => void;
}

const RegistrationScreen: React.FC<RegistrationScreenProps> = ({ navigation, onRegistrationSuccess }) => {
  const [nik, setNik] = useState('');
  const [name, setName] = useState('');
  const [dob, setDob] = useState('');
  const [address, setAddress] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [loading, setLoading] = useState(false);

  const handleRegister = async () => {
    if (!nik || !name || !dob || !address) {
        Alert.alert('Validation Error', 'Please fill all required fields.');
        return;
    }
    
    setLoading(true);
    
    // --- Simulate Face Verification ---
    // In a real app, you would integrate a liveness detection library here.
    // For now, we'll just simulate a successful verification.
    const isFaceVerified = true; 
    console.log('Face verification status:', isFaceVerified);

    if (isFaceVerified) {
        const userData = { nik, name };
        const newWallet = await WalletService.createNewWallet(userData);
        if (newWallet) {
            // Navigate to the Mnemonic screen, passing the new wallet and the final callback
            navigation.navigate('Mnemonic', { wallet: newWallet, onComplete: onRegistrationSuccess });
        }
    } else {
        Alert.alert('Verification Failed', 'Face verification failed. Please try again.');
    }

    setLoading(false);
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Create New Digital Identity</Text>
      <Text style={styles.subtitle}>Please fill in your data as per your ID card.</Text>
      
      <TextInput
        style={styles.input}
        onChangeText={setNik}
        value={nik}
        placeholder="NIK (Nomor Induk Kependudukan)"
        keyboardType="numeric"
      />
      <TextInput
        style={styles.input}
        onChangeText={setName}
        value={name}
        placeholder="Full Name"
      />
      <TextInput
        style={styles.input}
        onChangeText={setDob}
        value={dob}
        placeholder="Date of Birth (DD-MM-YYYY)"
      />
      <TextInput
        style={styles.input}
        onChangeText={setAddress}
        value={address}
        placeholder="Address"
        multiline
      />
      <TextInput
        style={styles.input}
        onChangeText={setPhoneNumber}
        value={phoneNumber}
        placeholder="Phone Number (Optional)"
        keyboardType="phone-pad"
      />
      <Button title={loading ? "Creating Wallet..." : "Verify & Create Wallet"} onPress={handleRegister} disabled={loading} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    padding: 20,
  },
  title: {
    fontSize: 22,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 10,
  },
  subtitle: {
    fontSize: 16,
    textAlign: 'center',
    color: '#666',
    marginBottom: 20,
  },
  input: {
    height: 45,
    borderColor: 'gray',
    borderWidth: 1,
    borderRadius: 5,
    marginBottom: 15,
    paddingHorizontal: 10,
  },
});

export default RegistrationScreen;
