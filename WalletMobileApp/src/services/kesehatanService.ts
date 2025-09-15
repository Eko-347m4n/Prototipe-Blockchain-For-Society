import { ethers } from 'ethers';
import { Alert } from 'react-native';
import { KESEHATAN_CONTRACT_ADDRESS, KESEHATAN_ABI, PROVIDER_URL } from '../constants/contracts';

// WARNING: This is a hardcoded private key for simulation purposes only.
const ADMIN_PRIVATE_KEY = '0xac0974bec39a17e36ba4a6b4d238ff944bacb478cbed5efcae784d7bf4f2ff80';

const getKesehatanContract = (signer?: ethers.Signer) => {
    const provider = new ethers.JsonRpcProvider(PROVIDER_URL);
    const contractSigner = signer ? signer.connect(provider) : new ethers.Wallet(ADMIN_PRIVATE_KEY, provider);
    return new ethers.Contract(KESEHATAN_CONTRACT_ADDRESS, KESEHATAN_ABI, contractSigner);
}

export const submitKesehatanApplication = async (signer: ethers.Signer, applicationType: string, details: string) => {
    try {
        const contract = getKesehatanContract(signer);
        const tx = await contract.submitApplication(applicationType, details);
        await tx.wait();
        Alert.alert('Success', 'Application submitted to Kesehatan.');
        return true;
    } catch (e: any) {
        console.error("Error submitting Kesehatan application:", e);
        Alert.alert('Error', `Failed to submit application: ${e.reason || e.message}`);
        return false;
    }
};

export const getBPJSData = async (bpjsId: string) => {
    try {
        const contract = getKesehatanContract();
        const data = await contract.getBPJSData(bpjsId);
        return data;
    } catch (e: any) {
        console.error("Error fetching BPJS data:", e);
        Alert.alert('Error', `Failed to fetch data: ${e.reason || e.message}`);
        return null;
    }
};
