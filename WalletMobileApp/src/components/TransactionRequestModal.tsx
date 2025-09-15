import React, { useState } from 'react';
import { Modal, View, Text, Button, StyleSheet, ScrollView } from 'react-native';
import { SessionTypes } from '@walletconnect/types';
import { getSdkError } from '@walletconnect/utils';

interface TransactionRequestModalProps {
  isVisible: boolean;
  request: SessionTypes.Request | null;
  onApprove: (request: SessionTypes.Request) => void;
  onReject: (request: SessionTypes.Request) => void;
}

const TransactionRequestModal: React.FC<TransactionRequestModalProps> = ({ isVisible, request, onApprove, onReject }) => {
  if (!request) return null;

  const { topic, id, params } = request;
  const { request: wcRequest, chainId } = params;

  const getMethodDetails = () => {
    switch (wcRequest.method) {
      case 'personal_sign':
        return (
          <View>
            <Text style={styles.detailLabel}>Message:</Text>
            <Text style={styles.detailValue}>{wcRequest.params[0]}</Text>
            <Text style={styles.detailLabel}>Signer Address:</Text>
            <Text style={styles.detailValue}>{wcRequest.params[1]}</Text>
          </View>
        );
      case 'eth_sendTransaction':
        const tx = wcRequest.params[0];
        return (
          <View>
            <Text style={styles.detailLabel}>From:</Text>
            <Text style={styles.detailValue}>{tx.from}</Text>
            <Text style={styles.detailLabel}>To:</Text>
            <Text style={styles.detailValue}>{tx.to || 'Contract Creation'}</Text>
            <Text style={styles.detailLabel}>Value:</Text>
            <Text style={styles.detailValue}>{tx.value ? `${parseInt(tx.value, 16) / (10**18)} ETH` : '0 ETH'}</Text>
            {tx.gas && <Text style={styles.detailLabel}>Gas Limit: {parseInt(tx.gas, 16)}</Text>}
            {tx.gasPrice && <Text style={styles.detailLabel}>Gas Price: {parseInt(tx.gasPrice, 16) / (10**9)} Gwei</Text>}
            {tx.data && <Text style={styles.detailLabel}>Data: {tx.data.substring(0, 100)}...</Text>}
          </View>
        );
      default:
        return <Text style={styles.detailValue}>Unsupported method: {wcRequest.method}</Text>;
    }
  };

  return (
    <Modal
      animationType="slide"
      transparent={true}
      visible={isVisible}
      onRequestClose={() => onReject(request)}
    >
      <View style={styles.centeredView}>
        <View style={styles.modalView}>
          <Text style={styles.modalTitle}>Transaction Request</Text>
          <ScrollView style={styles.detailsContainer}>
            <Text style={styles.detailLabel}>Method:</Text>
            <Text style={styles.detailValue}>{wcRequest.method}</Text>
            <Text style={styles.detailLabel}>Chain ID:</Text>
            <Text style={styles.detailValue}>{chainId}</Text>
            <Text style={styles.detailLabel}>Topic:</Text>
            <Text style={styles.detailValue}>{topic}</Text>
            
            <Text style={styles.sectionTitle}>Details:</Text>
            {getMethodDetails()}
          </ScrollView>

          <View style={styles.buttonContainer}>
            <Button title="Reject" onPress={() => onReject(request)} color="red" />
            <Button title="Approve" onPress={() => onApprove(request)} color="green" />
          </View>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
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
  detailsContainer: {
    width: '100%',
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginTop: 10,
    marginBottom: 5,
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
  },
});

export default TransactionRequestModal;
