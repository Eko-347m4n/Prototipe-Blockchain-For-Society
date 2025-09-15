import { ethers } from 'ethers';
import { Alert } from 'react-native';
import { SOSIAL_CONTRACT_ADDRESS, SOSIAL_ABI, PROVIDER_URL } from '../constants/contracts';

// WARNING: This is a hardcoded private key for simulation purposes only.
const ADMIN_PRIVATE_KEY = '0xac0974bec39a17e36ba4a6b4d238ff944bacb478cbed5efcae784d7bf4f2ff80';

const getSosialContract = (signer?: ethers.Signer) => {
    const provider = new ethers.JsonRpcProvider(PROVIDER_URL);
    const contractSigner = signer ? signer.connect(provider) : new ethers.Wallet(ADMIN_PRIVATE_KEY, provider);
    return new ethers.Contract(SOSIAL_CONTRACT_ADDRESS, SOSIAL_ABI, contractSigner);
}

export const submitSosialApplication = async (signer: ethers.Signer, applicationType: string, details: string) => {
    try {
        const contract = getSosialContract(signer);
        const tx = await contract.submitApplication(applicationType, details);
        await tx.wait();
        Alert.alert('Success', 'Application submitted to Sosial.');
        return true;
    } catch (e: any) {
        console.error("Error submitting Sosial application:", e);
        Alert.alert('Error', `Failed to submit application: ${e.reason || e.message}`);
        return false;
    }
};

export const getAidRecord = async (beneficiaryId: string) => {
    try {
        const contract = getSosialContract();
        const record = await contract.getAidRecord(beneficiaryId);
        return record;
    } catch (e: any) {
        console.error("Error fetching aid record:", e);
        Alert.alert('Error', `Failed to fetch record: ${e.reason || e.message}`);
        return null;
    }
};
