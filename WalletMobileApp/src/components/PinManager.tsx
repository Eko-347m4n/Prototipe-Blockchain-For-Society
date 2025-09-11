import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, Button, StyleSheet } from 'react-native';
import * as PinService from '../services/pinService';

interface PinManagerProps {
  onPinSet: () => void;
}

const PinManager: React.FC<PinManagerProps> = ({ onPinSet }) => {
  const [pin, setPin] = useState('');
  const [confirmPin, setConfirmPin] = useState('');
  const [isPinAlreadySet, setIsPinAlreadySet] = useState(false);

  useEffect(() => {
    const checkPin = async () => {
      const pinIsSet = await PinService.isPinSet();
      setIsPinAlreadySet(pinIsSet);
    };
    checkPin();
  }, []);

  const handleSetPin = async () => {
    const success = await PinService.setWalletPin(pin, confirmPin);
    if (success) {
      onPinSet();
      setPin('');
      setConfirmPin('');
      setIsPinAlreadySet(true);
    }
  };

  return (
    <View style={styles.pinContainer}>
      <Text style={styles.infoTitle}>PIN Management</Text>
      {isPinAlreadySet ? (
        <Text style={{ color: 'green' }}>PIN is set.</Text>
      ) : (
        <>
          <TextInput
            style={styles.input}
            onChangeText={setPin}
            value={pin}
            placeholder="Enter new PIN"
            secureTextEntry
            keyboardType="numeric"
          />
          <TextInput
            style={styles.input}
            onChangeText={setConfirmPin}
            value={confirmPin}
            placeholder="Confirm new PIN"
            secureTextEntry
            keyboardType="numeric"
          />
          <Button title="Set PIN" onPress={handleSetPin} />
        </>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  pinContainer: {
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

export default PinManager;
