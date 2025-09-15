import React, { useState, useEffect, useCallback } from 'react';
import { ScrollView, StyleSheet, View, Button, Text, ActivityIndicator, Alert } from 'react-native';
import { ethers } from 'ethers';
import { SessionTypes } from '@walletconnect/types';
import * as WalletService from '../services/walletService';
import { isWalletRegistered, registerIdentityByAdmin } from '../services/identityService';
import { initWalletConnect, approveRequest, rejectRequest, approveSession, rejectSession } from '../services/walletConnectService';
import WalletInfo from '../components/WalletInfo';
import WalletConnectManager from '../components/WalletConnectManager';
import TransactionRequestModal from '../components/TransactionRequestModal'; // Import the new modal

interface DashboardScreenProps {
  wallet: ethers.Wallet;
  onLogout: () => void;
}

// New component for the pending registration view
const PendingRegistrationView: React.FC<{ wallet: ethers.Wallet, onRegistrationComplete: () => void }> = ({ wallet, onRegistrationComplete }) => {
  const [userData, setUserData] = useState<WalletService.UserData | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchUserData = async () => {
      const data = await WalletService.loadUserData();
      setUserData(data);
    };
    fetchUserData();
  }, []);

  const handleAdminRegister = async () => {
    if (!userData) {
      Alert.alert("Error", "User data not found. Please try restarting the app.");
      return;
    }
    setLoading(true);
    const success = await registerIdentityByAdmin(userData.nik, wallet.address);
    if (success) {
      // Notify dashboard to re-check the registration status
      onRegistrationComplete();
    }
    setLoading(false);
  };

  return (
    <View style={styles.pendingContainer}>
      <Text style={styles.pendingTitle}>Identity Verification Pending</Text>
      <Text style={styles.pendingText}>Your digital identity has been created but is not yet registered on the blockchain.</Text>
      <View style={styles.pendingInfoBox}>
        <Text>NIK: {userData?.nik || 'Loading...'}</Text>
        <Text>Wallet Address: {wallet.address}</Text>
      </View>
      <Button 
        title={loading ? "Registering..." : "[ADMIN SIMULATION] Register to Blockchain"} 
        onPress={handleAdminRegister} 
        disabled={loading || !userData}
      />
    </View>
  );
};

const DashboardScreen: React.FC<DashboardScreenProps> = ({ wallet, onLogout }) => {
  const [isRegistered, setIsRegistered] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [sessionRequest, setSessionRequest] = useState<SessionTypes.Request | null>(null);
  const [sessionProposal, setSessionProposal] = useState<SessionTypes.Proposal | null>(null);

  const checkRegistration = async () => {
    setIsLoading(true);
    const registered = await isWalletRegistered(wallet.address);
    setIsRegistered(registered);
    setIsLoading(false);
  };

  useEffect(() => {
    checkRegistration();

    // Initialize WalletConnect
    const onSessionProposal = (proposal: SessionTypes.Proposal) => {
      console.log("Session Proposal:", proposal);
      setSessionProposal(proposal);
    };

    const onSessionRequest = (request: SessionTypes.Request) => {
      console.log("Session Request:", request);
      setSessionRequest(request);
    };

    initWalletConnect(onSessionProposal, onSessionRequest);

  }, [wallet]);

  const handleApproveRequest = useCallback(async (request: SessionTypes.Request) => {
    await approveRequest(request, wallet);
    setSessionRequest(null); // Close modal
  }, [wallet]);

  const handleRejectRequest = useCallback(async (request: SessionTypes.Request) => {
    await rejectRequest(request);
    setSessionRequest(null); // Close modal
  }, []);

  const handleApproveSession = useCallback(async (proposal: SessionTypes.Proposal) => {
    await approveSession(proposal, wallet);
    setSessionProposal(null); // Close modal
  }, [wallet]);

  const handleRejectSession = useCallback(async (proposal: SessionTypes.Proposal) => {
    await rejectSession(proposal);
    setSessionProposal(null); // Close modal
  }, []);

  const handleLogout = async () => {
    await WalletService.deleteWallet();
    onLogout();
  };

  if (isLoading) {
    return <View style={styles.container}><ActivityIndicator size="large" /></View>;
  }

  return (
    <ScrollView contentInsetAdjustmentBehavior="automatic" style={styles.scrollView}>
      <View style={styles.container}>
        <WalletInfo wallet={wallet} isRegistered={isRegistered} onDelete={handleLogout} />
        
        {isRegistered ? (
          // --- Main Dashboard for Registered Users ---
          <>
            <WalletConnectManager wallet={wallet} />
            <ServiceExplorer wallet={wallet} />
          </>
        ) : (
          // --- Pending View for Unregistered Users ---
          <PendingRegistrationView wallet={wallet} onRegistrationComplete={checkRegistration} />
        )}

        <View style={{marginTop: 40}}>
          <Button title="Logout" onPress={handleLogout} color="red" />
        </View>
      </View>

      {/* Transaction Request Modal */}
      <TransactionRequestModal
        isVisible={!!sessionRequest}
        request={sessionRequest}
        onApprove={handleApproveRequest}
        onReject={handleRejectRequest}
      />

      {/* Session Proposal Modal (simplified for now) */}
      <Modal
        animationType="slide"
        transparent={true}
        visible={!!sessionProposal}
        onRequestClose={() => handleRejectSession(sessionProposal!)}
      >
        <View style={styles.centeredView}>
          <View style={styles.modalView}>
            <Text style={styles.modalTitle}>Session Proposal</Text>
            <Text>A dApp wants to connect:</Text>
            <Text style={styles.detailLabel}>Name: {sessionProposal?.params.proposer.metadata.name}</Text>
            <Text style={styles.detailLabel}>URL: {sessionProposal?.params.proposer.metadata.url}</Text>
            <View style={styles.buttonContainer}>
              <Button title="Reject" onPress={() => handleRejectSession(sessionProposal!)} color="red" />
              <Button title="Approve" onPress={() => handleApproveSession(sessionProposal!)} color="green" />
            </View>
          </View>
        </View>
      </Modal>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  scrollView: {
    backgroundColor: '#f5f5f5',
  },
  container: {
    padding: 24,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginTop: 20,
    marginBottom: 10,
  },
  pendingContainer: {
    marginTop: 20,
    padding: 15,
    backgroundColor: '#fff',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#ddd',
  },
  pendingTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 10,
  },
  pendingText: {
    textAlign: 'center',
    marginBottom: 15,
    color: '#555',
  },
  pendingInfoBox: {
    padding: 10,
    backgroundColor: '#eee',
    borderRadius: 5,
    marginBottom: 15,
  },
  centeredView: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.5)',
  },
  modalView: {
    margin: 20,
    backgroundColor: 'white',
    borderRadius: 20,
    padding: 35,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
    width: '90%',
    maxHeight: '80%',
  },
  modalTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: 15,
  },
  detailLabel: {
    fontWeight: 'bold',
    marginTop: 5,
  },
  detailValue: {
    marginBottom: 5,
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    width: '100%',
    marginTop: 20,
  },
});

export default DashboardScreen;
