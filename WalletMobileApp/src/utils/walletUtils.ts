import { Wallet, ethers } from 'ethers';
import AsyncStorage from '@react-native-async-storage/async-storage';

const PRIVATE_KEY_STORAGE_KEY = 'user_private_key';

/**
 * Generates a new Ethereum wallet and returns its private key and address.
 * @returns An object containing the private key and address.
 */
export const generateNewWallet = (): { privateKey: string; address: string } => {
  const wallet = Wallet.createRandom();
  return { privateKey: wallet.privateKey, address: wallet.address };
};

/**
 * Stores the private key securely using AsyncStorage.
 * @param privateKey The private key to store.
 */
export const storePrivateKey = async (privateKey: string): Promise<void> => {
  try {
    await AsyncStorage.setItem(PRIVATE_KEY_STORAGE_KEY, privateKey);
    console.log('Private key stored successfully.');
  } catch (error) {
    console.error('Error storing private key:', error);
    throw error;
  }
};

/**
 * Retrieves the private key from AsyncStorage.
 * @returns The private key, or null if not found.
 */
export const retrievePrivateKey = async (): Promise<string | null> => {
  try {
    const privateKey = await AsyncStorage.getItem(PRIVATE_KEY_STORAGE_KEY);
    if (privateKey) {
      console.log('Private key retrieved successfully.');
    } else {
      console.log('No private key found.');
    }
    return privateKey;
  } catch (error) {
    console.error('Error retrieving private key:', error);
    return null;
  }
};

/**
 * Generates a wallet instance from a given private key.
 * @param privateKey The private key string.
 * @returns A Wallet instance.
 */
export const getWalletFromPrivateKey = (privateKey: string): Wallet => {
  return new Wallet(privateKey);
};

/**
 * Retrieves the stored private key and returns a Wallet instance.
 * @returns A Promise that resolves to a Wallet instance if a private key is found, otherwise null.
 */
export const getStoredWallet = async (): Promise<Wallet | null> => {
  const privateKey = await retrievePrivateKey();
  if (privateKey) {
    return getWalletFromPrivateKey(privateKey);
  }
  return null;
};
