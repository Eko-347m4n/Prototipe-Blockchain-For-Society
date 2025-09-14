import { Core, Web3Wallet } from '@walletconnect/react-native-compat';
import { buildApprovedNamespaces, getSdkError } from '@walletconnect/utils';
import { SessionTypes } from '@walletconnect/types';
import { ethers } from 'ethers';
import { Alert } from 'react-native';
import { WALLETCONNECT_PROJECT_ID } from '@env'; // Import from @env

let web3wallet: Web3Wallet | undefined;
let core: Core | undefined;

export const initWalletConnect = async (onSessionProposal: (proposal: SessionTypes.Proposal) => void, onSessionRequest: (request: SessionTypes.Request) => void) => {
    try {
        web3wallet = await Web3Wallet.init({
            projectId: WALLETCONNECT_PROJECT_ID,
            metadata: {
                name: 'Prototipe Web3 Kabupaten Wallet',
                description: 'Your secure wallet for regency services',
                url: 'https://walletconnect.com/',
                icons: ['https://walletconnect.com/walletconnect-logo.png'],
            },
        });
        core = web3wallet.core;

        web3wallet.on('session_proposal', onSessionProposal);
        web3wallet.on('session_request', onSessionRequest);

        return web3wallet.getActiveSessions();
    } catch (e) {
        console.error("Error creating Web3Wallet:", e);
        Alert.alert('Error', 'Failed to initialize WalletConnect.');
        return {};
    }
};

export const pair = async (uri: string) => {
    if (!web3wallet) {
        Alert.alert('Error', 'WalletConnect not initialized.');
        return;
    }
    try {
        await web3wallet.pair({ uri });
        Alert.alert('Success', 'Pairing request sent!');
    } catch (e) {
        console.error("Error pairing:", e);
        Alert.alert('Error', 'Failed to pair.');
    }
};

export const approveSession = async (sessionProposal: SessionTypes.Proposal, wallet: ethers.Wallet) => {
    if (!sessionProposal || !wallet || !web3wallet) return null;

    try {
        const { id, params } = sessionProposal;
        const { relays } = params;

        const approvedNamespaces = buildApprovedNamespaces({
            proposal: params,
            supportedNamespaces: {
                eip155: {
                    chains: ['eip155:1', 'eip155:137', 'eip155:31337'],
                    methods: ['eth_sendTransaction', 'personal_sign', 'eth_signTypedData', 'eth_sign'],
                    events: ['accountsChanged', 'chainChanged'],
                    accounts: [`eip155:31337:${wallet.address}`],
                },
            },
        });

        await web3wallet.approveSession({
            id,
            relay: relays[0],
            namespaces: approvedNamespaces,
        });

        return web3wallet.getActiveSessions();
    } catch (e) {
        console.error("Error approving session:", e);
        Alert.alert('Error', 'Failed to approve session.');
        return null;
    }
};

export const rejectSession = async (sessionProposal: SessionTypes.Proposal) => {
    if (!sessionProposal || !web3wallet) return;
    try {
        await web3wallet.rejectSession({
            id: sessionProposal.id,
            reason: getSdkError('USER_REJECTED_METHODS'),
        });
    } catch (e) {
        console.error("Error rejecting session:", e);
        Alert.alert('Error', 'Failed to reject session.');
    }
};

export const approveRequest = async (sessionRequest: SessionTypes.Request, wallet: ethers.Wallet) => {
    if (!sessionRequest || !wallet || !web3wallet) return;

    try {
        const { topic, id, params } = sessionRequest;
        const { request } = params;

        let result: any;
        if (request.method === 'personal_sign') {
            const message = request.params[0];
            result = await wallet.signMessage(message);
        } else if (request.method === 'eth_sendTransaction') {
            const tx = request.params[0];
            result = await wallet.signTransaction(tx);
        } else {
            Alert.alert('Error', `Unsupported method: ${request.method}`);
            return;
        }

        await web3wallet.respondSessionRequest({
            topic,
            response: {
                id,
                jsonrpc: '2.0',
                result,
            },
        });
    } catch (e) {
        console.error("Error approving request:", e);
        Alert.alert('Error', 'Failed to approve request.');
    }
};

export const rejectRequest = async (sessionRequest: SessionTypes.Request) => {
    if (!sessionRequest || !web3wallet) return;
    try {
        await web3wallet.respondSessionRequest({
            topic: sessionRequest.topic,
            response: {
                id: sessionRequest.id,
                jsonrpc: '2.0',
                error: getSdkError('USER_REJECTED_METHODS'),
            },
        });
    } catch (e) {
        console.error("Error rejecting request:", e);
        Alert.alert('Error', 'Failed to reject request.');
    }
};
