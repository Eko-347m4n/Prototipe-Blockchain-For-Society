import React, { useState, useCallback, useEffect } from 'react';
import { View, Text, TextInput, Button, StyleSheet } from 'react-native';
import { SessionTypes } from '@walletconnect/types';
import { ethers } from 'ethers';
import * as WCService from '../services/walletConnectService';

interface WalletConnectManagerProps {
  wallet: ethers.Wallet;
}

const WalletConnectManager: React.FC<WalletConnectManagerProps> = ({ wallet }) => {
  const [pairingUri, setPairingUri] = useState('');
  const [sessionProposal, setSessionProposal] = useState<SessionTypes.Proposal | null>(null);
  const [sessionRequest, setSessionRequest] = useState<SessionTypes.Request | null>(null);
  const [activeSessions, setActiveSessions] = useState<SessionTypes.Settled[]>([]);

  const onSessionProposal = (proposal: SessionTypes.Proposal) => {
    setSessionProposal(proposal);
  };

  const onSessionRequest = (request: SessionTypes.Request) => {
    setSessionRequest(request);
  };

  useEffect(() => {
    const init = async () => {
      const sessions = await WCService.initWalletConnect(onSessionProposal, onSessionRequest);
      setActiveSessions(Object.values(sessions));
    };
    init();
  }, []);

  const onConnect = () => {
    WCService.pair(pairingUri);
    setPairingUri('');
  };

  const onApproveSession = async () => {
    if (sessionProposal) {
      const sessions = await WCService.approveSession(sessionProposal, wallet);
      if (sessions) {
        setActiveSessions(Object.values(sessions));
      }
      setSessionProposal(null);
    }
  };

  const onRejectSession = () => {
    if (sessionProposal) {
      WCService.rejectSession(sessionProposal);
      setSessionProposal(null);
    }
  };

  const onApproveRequest = () => {
    if (sessionRequest) {
      WCService.approveRequest(sessionRequest, wallet);
      setSessionRequest(null);
    }
  };

  const onRejectRequest = () => {
    if (sessionRequest) {
      WCService.rejectRequest(sessionRequest);
      setSessionRequest(null);
    }
  };

  return (
    <View style={styles.wcContainer}>
      <Text style={styles.infoTitle}>WalletConnect</Text>
      <TextInput
        style={styles.input}
        onChangeText={setPairingUri}
        value={pairingUri}
        placeholder="Enter Pairing URI"
      />
      <Button title="Connect" onPress={onConnect} />

      {sessionProposal && (
        <View style={styles.proposalContainer}>
          <Text>Session Proposal from:</Text>
          <Text>{sessionProposal.params.proposer.metadata.name}</Text>
          <Button title="Approve Session" onPress={onApproveSession} />
          <Button title="Reject Session" onPress={onRejectSession} color="red" />
        </View>
      )}

      {sessionRequest && (
        <View style={styles.proposalContainer}>
          <Text>Session Request:</Text>
          <Text>Method: {sessionRequest.params.request.method}</Text>
          <Button title="Approve Request" onPress={onApproveRequest} />
          <Button title="Reject Request" onPress={onRejectRequest} color="red" />
        </View>
      )}

      {activeSessions.length > 0 && (
        <View style={styles.sessionsContainer}>
          <Text>Active Sessions:</Text>
          {activeSessions.map(session => (
            <Text key={session.topic}>- {session.peer.metadata.name}</Text>
          ))}
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  wcContainer: {
    marginTop: 30,
    paddingTop: 20,
    borderTopColor: '#CCC',
    borderTopWidth: 1,
  },
  infoTitle: {
    fontWeight: 'bold',
    marginTop: 15,
  },
  input: {
    height: 40,
    borderColor: 'gray',
    borderWidth: 1,
    marginBottom: 10,
    paddingHorizontal: 8,
  },
  proposalContainer: {
    marginTop: 10,
    padding: 10,
    borderColor: 'blue',
    borderWidth: 1,
    borderRadius: 5,
  },
  sessionsContainer: {
    marginTop: 10,
    padding: 10,
    borderColor: 'green',
    borderWidth: 1,
    borderRadius: 5,
  },
});

export default WalletConnectManager;
