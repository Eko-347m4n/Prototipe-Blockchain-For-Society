import { ethers } from 'ethers';
import { Alert } from 'react-native';
import { IDENTITY_CONTRACT_ADDRESS, IDENTITY_CONTRACT_ABI } from '../constants/contracts'; // Assuming you move contract constants here
import { authenticateBiometrics } from './biometricService';

export const isWalletRegistered = async (walletAddress: string) => {
    try {
        const providerUrl = "http://10.0.2.2:8545"; // Use 10.0.2.2 for Android emulator to access host localhost
        console.log("Provider URL:", providerUrl);
        const provider = new ethers.JsonRpcProvider(providerUrl);
        console.log("IDENTITY_CONTRACT_ADDRESS:", IDENTITY_CONTRACT_ADDRESS);
        console.log("IDENTITY_CONTRACT_ABI:", IDENTITY_CONTRACT_ABI);
        const identityContract = new ethers.Contract(IDENTITY_CONTRACT_ADDRESS, IDENTITY_CONTRACT_ABI, provider);
        console.log("Identity Contract Instance:", identityContract);
        const registered = await identityContract.isRegistered(walletAddress);
        return registered;
    } catch (e) {
        console.error("Error checking registration status:", e);
        return false;
    }
}

export const registerIdentity = async (wallet: ethers.Wallet, nik: string) => {
    if (!wallet) {
      Alert.alert('Error', 'No wallet loaded. Please create or load a wallet first.');
      return false;
    }
    if (!nik) {
      Alert.alert('Error', 'Please fill in NIK/NIP.');
      return false;
    }

    const authenticated = await authenticateBiometrics('Authenticate to register identity');
    if (!authenticated) {
      Alert.alert('Authentication Required', 'Biometric authentication failed or cancelled.');
      return false;
    }

    try {
      const provider = new ethers.JsonRpcProvider("http://localhost:8545");
      const signer = new ethers.Wallet(wallet.privateKey, provider);
      const identityContract = new ethers.Contract(IDENTITY_CONTRACT_ADDRESS, IDENTITY_CONTRACT_ABI, signer);
      const identityHash = ethers.keccak256(ethers.toUtf8Bytes(nik));

      const tx = await identityContract.registerIdentity(identityHash);
      await tx.wait();

      Alert.alert('Success', `Identity registered for NIK/NIP: ${nik}`);
      return true;
    } catch (e: any) {
      console.error("Error registering identity:", e);
      Alert.alert('Error', `Failed to register identity: ${e.reason || e.message}`);
      return false;
    }
  };
