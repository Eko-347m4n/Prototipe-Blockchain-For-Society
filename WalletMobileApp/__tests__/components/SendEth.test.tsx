import React from 'react';
import { render, fireEvent, act } from '@testing-library/react-native';
import SendEth from '../../src/components/SendEth';
import { ethers } from 'ethers';
import * as biometricService from '../../src/services/biometricService';

// Mocking the biometric service
jest.mock('../../src/services/biometricService', () => ({
  authenticateBiometrics: jest.fn(),
}));

// Mocking ethers
const mockSendTransaction = jest.fn().mockResolvedValue({ wait: jest.fn() });
jest.mock('ethers', () => {
  const originalEthers = jest.requireActual('ethers');
  return {
    ...originalEthers,
    JsonRpcProvider: jest.fn().mockImplementation(() => ({})),
    Wallet: jest.fn().mockImplementation(() => ({
      sendTransaction: mockSendTransaction,
    })),
  };
});

describe('SendEth', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });
  const mockWallet = new ethers.Wallet('0x0123456789012345678901234567890123456789012345678901234567890123');

  it('should send ETH when form is submitted with valid data and authentication', async () => {
    (biometricService.authenticateBiometrics as jest.Mock).mockResolvedValue(true);

    const { getByPlaceholderText, getByTestId } = render(<SendEth wallet={mockWallet} />);

    const recipientInput = getByPlaceholderText('Recipient Address');
    const amountInput = getByPlaceholderText('Amount (ETH)');
    const sendButton = getByTestId('send-eth-button');

    const recipientAddress = '0xRecipientAddress';
    const amount = '0.1';

    fireEvent.changeText(recipientInput, recipientAddress);
    fireEvent.changeText(amountInput, amount);

    await act(async () => {
      fireEvent.press(sendButton);
    });

    expect(biometricService.authenticateBiometrics).toHaveBeenCalledWith('Authenticate to send ETH');
    expect(mockSendTransaction).toHaveBeenCalledWith({
      to: recipientAddress,
      value: ethers.parseEther(amount),
    });
  });

  it('should not send ETH if biometric authentication fails', async () => {
    (biometricService.authenticateBiometrics as jest.Mock).mockResolvedValue(false);

    const { getByPlaceholderText, getByTestId } = render(<SendEth wallet={mockWallet} />);

    const recipientInput = getByPlaceholderText('Recipient Address');
    const amountInput = getByPlaceholderText('Amount (ETH)');
    const sendButton = getByTestId('send-eth-button');

    fireEvent.changeText(recipientInput, '0xRecipientAddress');
    fireEvent.changeText(amountInput, '0.1');

    await act(async () => {
      fireEvent.press(sendButton);
    });

    expect(mockSendTransaction).not.toHaveBeenCalled();
  });
});
