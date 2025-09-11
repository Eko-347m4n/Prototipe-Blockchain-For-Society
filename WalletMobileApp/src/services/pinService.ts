import AsyncStorage from '@react-native-async-storage/async-storage';
import { Alert } from 'react-native';

export const setWalletPin = async (pin: string, confirmPin: string) => {
    if (!pin || !confirmPin) {
      Alert.alert('Error', 'Please enter and confirm your PIN.');
      return false;
    }
    if (pin !== confirmPin) {
      Alert.alert('Error', 'PINs do not match.');
      return false;
    }
    if (pin.length < 4) {
      Alert.alert('Error', 'PIN must be at least 4 characters long.');
      return false;
    }

    try {
      await AsyncStorage.setItem('user_pin', pin);
      Alert.alert('Success', 'PIN set successfully!');
      return true;
    } catch (e) {
      console.error("Error setting PIN:", e);
      Alert.alert('Error', 'Failed to set PIN.');
      return false;
    }
};

export const verifyWalletPin = async (inputPin: string): Promise<boolean> => {
    try {
      const storedPin = await AsyncStorage.getItem('user_pin');
      if (storedPin === inputPin) {
        return true;
      }
      return false;
    } catch (e) {
      console.error("Error verifying PIN:", e);
      return false;
    }
};

export const isPinSet = async (): Promise<boolean> => {
    try {
        const storedPin = await AsyncStorage.getItem('user_pin');
        return storedPin !== null;
    } catch (e) {
        console.error("Error checking PIN status:", e);
        return false;
    }
}
