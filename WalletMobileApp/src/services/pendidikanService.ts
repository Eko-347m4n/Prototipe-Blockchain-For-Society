import { ethers } from 'ethers';
import { Alert } from 'react-native';
import { PENDIDIKAN_CONTRACT_ADDRESS, PENDIDIKAN_ABI, PROVIDER_URL } from '../constants/contracts';

// WARNING: This is a hardcoded private key for simulation purposes only.
const ADMIN_PRIVATE_KEY = '0xac0974bec39a17e36ba4a6b4d238ff944bacb478cbed5efcae784d7bf4f2ff80';

const getPendidikanContract = (signer?: ethers.Signer) => {
    const provider = new ethers.JsonRpcProvider(PROVIDER_URL);
    const contractSigner = signer ? signer.connect(provider) : new ethers.Wallet(ADMIN_PRIVATE_KEY, provider);
    return new ethers.Contract(PENDIDIKAN_CONTRACT_ADDRESS, PENDIDIKAN_ABI, contractSigner);
}

export const submitPendidikanApplication = async (signer: ethers.Signer, applicationType: string, details: string) => {
    try {
        const contract = getPendidikanContract(signer);
        const tx = await contract.submitApplication(applicationType, details);
        await tx.wait();
        Alert.alert('Success', 'Application submitted to Pendidikan.');
        return true;
    } catch (e: any) {
        console.error("Error submitting Pendidikan application:", e);
        Alert.alert('Error', `Failed to submit application: ${e.reason || e.message}`);
        return false;
    }
};

export const getAcademicRecord = async (studentId: string) => {
    try {
        const contract = getPendidikanContract();
        const record = await contract.getAcademicRecord(studentId);
        return record;
    } catch (e: any) {
        console.error("Error fetching academic record:", e);
        Alert.alert('Error', `Failed to fetch record: ${e.reason || e.message}`);
        return null;
    }
};
