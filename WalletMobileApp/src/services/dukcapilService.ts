import { ethers } from 'ethers';
import { Alert } from 'react-native';
import { DUKCAPIL_CONTRACT_ADDRESS, DUKCAPIL_ABI, PROVIDER_URL } from '../constants/contracts';

// WARNING: This is a hardcoded private key for simulation purposes only.
const ADMIN_PRIVATE_KEY = '0xac0974bec39a17e36ba4a6b4d238ff944bacb478cbed5efcae784d7bf4f2ff80';

const getDukcapilContract = (signer?: ethers.Signer) => {
    const provider = new ethers.JsonRpcProvider(PROVIDER_URL);
    const contractSigner = signer ? signer.connect(provider) : new ethers.Wallet(ADMIN_PRIVATE_KEY, provider);
    return new ethers.Contract(DUKCAPIL_CONTRACT_ADDRESS, DUKCAPIL_ABI, contractSigner);
}

export const submitDukcapilApplication = async (signer: ethers.Signer, applicationType: string, details: string) => {
    try {
        const contract = getDukcapilContract(signer);
        const tx = await contract.submitApplication(applicationType, details);
        await tx.wait();
        Alert.alert('Success', 'Application submitted to Dukcapil.');
        return true;
    } catch (e: any) {
        console.error("Error submitting Dukcapil application:", e);
        Alert.alert('Error', `Failed to submit application: ${e.reason || e.message}`);
        return false;
    }
};

export const approveDukcapilApplication = async (applicationId: string) => {
    try {
        const contract = getDukcapilContract(); // Uses admin signer by default
        const tx = await contract.approveApplication(applicationId);
        await tx.wait();
        Alert.alert('Success', 'Dukcapil application approved.');
        return true;
    } catch (e: any) {
        console.error("Error approving Dukcapil application:", e);
        Alert.alert('Error', `Failed to approve application: ${e.reason || e.message}`);
        return false;
    }
};

export const getCitizenData = async (nik: string) => {
    try {
        const contract = getDukcapilContract();
        const data = await contract.getCitizenData(nik);
        return data;
    } catch (e: any) {
        console.error("Error fetching citizen data:", e);
        Alert.alert('Error', `Failed to fetch data: ${e.reason || e.message}`);
        return null;
    }
};
