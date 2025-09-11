import React, { useState } from 'react';
import { View, Text, TextInput, Button, StyleSheet } from 'react-native';
import { ethers } from 'ethers';
import { registerIdentity } from '../services/identityService';

interface IdentityRegistrationProps {
  wallet: ethers.Wallet;
  onRegistrationSuccess: () => void;
}

const IdentityRegistration: React.FC<IdentityRegistrationProps> = ({ wallet, onRegistrationSuccess }) => {
  const [nik, setNik] = useState('');
  const [name, setName] = useState('');
  const [dob, setDob] = useState('');
  const [address, setAddress] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [loading, setLoading] = useState(false);

  const handleRegister = async () => {
    setLoading(true);
    const success = await registerIdentity(wallet, nik);
    if (success) {
      onRegistrationSuccess();
    }
    setLoading(false);
  };

  return (
    <View style={styles.registrationContainer}>
      <Text style={styles.infoTitle}>Register Identity</Text>
      <TextInput
        style={styles.input}
        onChangeText={setNik}
        value={nik}
        placeholder="NIK/NIP"
      />
      <TextInput
        style={styles.input}
        onChangeText={setName}
        value={name}
        placeholder="Name"
      />
      <TextInput
        style={styles.input}
        onChangeText={setDob}
        value={dob}
        placeholder="Date of Birth (DD/MM/YYYY)"
      />
      <TextInput
        style={styles.input}
        onChangeText={setAddress}
        value={address}
        placeholder="Address"
      />
      <TextInput
        style={styles.input}
        onChangeText={setPhoneNumber}
        value={phoneNumber}
        placeholder="Phone Number/Email"
      />
      <Button title={loading ? "Registering..." : "Register"} onPress={handleRegister} disabled={loading} />
    </View>
  );
};

const styles = StyleSheet.create({
  registrationContainer: {
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

export default IdentityRegistration;
