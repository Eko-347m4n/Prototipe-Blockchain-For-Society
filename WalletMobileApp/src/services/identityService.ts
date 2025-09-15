import { ethers } from 'ethers';
import { Alert } from 'react-native';
import { IDENTITY_CONTRACT_ADDRESS, IDENTITY_CONTRACT_ABI, PROVIDER_URL } from '../constants/contracts';

// WARNING: This is a hardcoded private key for simulation purposes only.
// This is the default first account from a local Hardhat node.
// In a real application, this key would be stored securely in a backend server.
const ADMIN_PRIVATE_KEY = '0xac0974bec39a17e36ba4a6b4d238ff944bacb478cbed5efcae784d7bf4f2ff80';

export const isWalletRegistered = async (walletAddress: string): Promise<boolean> => {
    try {
        const provider = new ethers.JsonRpcProvider(PROVIDER_URL);
        const identityContract = new ethers.Contract(IDENTITY_CONTRACT_ADDRESS, IDENTITY_CONTRACT_ABI, provider);
        const registered = await identityContract.isRegistered(walletAddress);
        return registered;
    } catch (e) {
        console.error("Error checking registration status:", e);
        // Return false on error, but alert the user something is wrong.
        Alert.alert("Network Error", "Could not connect to the blockchain to verify identity status.");
        return false;
    }
}

/**
 * Simulates an admin registering a citizen's identity on the blockchain.
 * @param nik The citizen's NIK.
 * @param walletAddress The citizen's new wallet address.
 * @returns boolean indicating success.
 */
export const registerIdentityByAdmin = async (nik: string, walletAddress: string): Promise<boolean> => {
    if (!nik || !walletAddress) {
      Alert.alert('Error', 'NIK and Wallet Address are required.');
      return false;
    }

    try {
      const provider = new ethers.JsonRpcProvider(PROVIDER_URL);
      // Sign the transaction with the admin's private key
      const adminSigner = new ethers.Wallet(ADMIN_PRIVATE_KEY, provider);
      const identityContract = new ethers.Contract(IDENTITY_CONTRACT_ADDRESS, IDENTITY_CONTRACT_ABI, adminSigner);
      
      const identityHash = ethers.keccak256(ethers.toUtf8Bytes(nik));

      console.log(`Admin attempting to register NIK-hash ${identityHash} for address ${walletAddress}`);

      // Call the admin-only function on the smart contract
      const tx = await identityContract.registerIdentity(walletAddress, identityHash);
      await tx.wait();

      Alert.alert('Success', `Identity registered for address: ${walletAddress}`)
      return true;
    } catch (e: any) {
      console.error("Error registering identity (admin simulation):", e);
      Alert.alert('Admin Simulation Error', `Failed to register identity: ${e.reason || e.message}`);
      return false;
    }
  };
