import { ethers } from 'ethers';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as Keychain from 'react-native-keychain';
import { Alert } from 'react-native';

const WALLET_KEY_SERVICE = 'org.example.walletapp'; // Service name for Keychain
const WALLET_KEY_ACCOUNT = 'walletPrivateKey'; // Account name for Keychain
const USER_DATA_KEY = 'my_user_data'; // Key for storing user data

export interface UserData {
  nik: string;
  name: string;
  // Add other fields as needed
}

export const saveWallet = async (newWallet: ethers.Wallet, userData: UserData) => {
  try {
    // Save private key securely using Keychain
    await Keychain.setGenericPassword(WALLET_KEY_ACCOUNT, newWallet.privateKey, {
      service: WALLET_KEY_SERVICE,
      accessible: Keychain.ACCESSIBLE.WHEN_UNLOCKED_THIS_DEVICE_ONLY, // Most secure option
    });
    await AsyncStorage.setItem(USER_DATA_KEY, JSON.stringify(userData)); // Save user data
    return newWallet;
  } catch (e) {
    console.error("Error saving wallet:", e);
    Alert.alert('Error', 'Failed to save wallet.');
    return null;
  }
};

export const loadWallet = async () => {
  try {
    // Retrieve private key securely using Keychain
    const credentials = await Keychain.getGenericPassword({
      service: WALLET_KEY_SERVICE,
    });
    if (credentials && credentials.password) {
      const loadedWallet = new ethers.Wallet(credentials.password);
      return loadedWallet;
    }
    return null;
  } catch (e) {
    console.error("Error loading wallet:", e);
    Alert.alert('Error', 'Failed to load wallet.');
    return null;
  }
};

// Function to load user data
export const loadUserData = async (): Promise<UserData | null> => {
  try {
    const data = await AsyncStorage.getItem(USER_DATA_KEY);
    if (data) {
      return JSON.parse(data) as UserData;
    }
    return null;
  } catch (e) {
    console.error("Error loading user data:", e);
    return null;
  }
};

export const createNewWallet = (userData: UserData) => {
  try {
    const newWallet = ethers.Wallet.createRandom();
    return saveWallet(newWallet, userData);
  } catch (error) {
    console.error(error);
    Alert.alert('Error', 'Could not create wallet.');
    return null;
  }
};

export const deleteWallet = async () => {
  try {
    // Delete private key from Keychain
    await Keychain.resetGenericPassword({ service: WALLET_KEY_SERVICE });
    await AsyncStorage.removeItem(USER_DATA_KEY); // Also remove user data
    await AsyncStorage.removeItem('user_pin'); // Also remove PIN
    return true;
  } catch (e) {
    console.error("Error deleting wallet:", e);
    Alert.alert('Error', 'Failed to delete wallet.');
    return false;
  }
};
