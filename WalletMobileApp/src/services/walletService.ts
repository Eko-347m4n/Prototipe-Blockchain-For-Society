import { ethers } from 'ethers';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Alert } from 'react-native';

const WALLET_KEY = 'my_wallet_private_key';

export const saveWallet = async (newWallet: ethers.Wallet) => {
  try {
    await AsyncStorage.setItem(WALLET_KEY, newWallet.privateKey);
    return newWallet;
  } catch (e) {
    console.error("Error saving wallet:", e);
    Alert.alert('Error', 'Failed to save wallet.');
    return null;
  }
};

export const loadWallet = async () => {
  try {
    const privateKey = await AsyncStorage.getItem(WALLET_KEY);
    if (privateKey) {
      const loadedWallet = new ethers.Wallet(privateKey);
      return loadedWallet;
    }
    return null;
  } catch (e) {
    console.error("Error loading wallet:", e);
    Alert.alert('Error', 'Failed to load wallet.');
    return null;
  }
};

export const createNewWallet = () => {
  try {
    const newWallet = ethers.Wallet.createRandom();
    return saveWallet(newWallet);
  } catch (error) {
    console.error(error);
    Alert.alert('Error', 'Could not create wallet.');
    return null;
  }
};

export const deleteWallet = async () => {
  try {
    await AsyncStorage.removeItem(WALLET_KEY);
    await AsyncStorage.removeItem('user_pin'); // Also remove PIN
    return true;
  } catch (e) {
    console.error("Error deleting wallet:", e);
    Alert.alert('Error', 'Failed to delete wallet.');
    return false;
  }
};
