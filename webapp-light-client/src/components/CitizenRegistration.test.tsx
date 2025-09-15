import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import CitizenRegistration from './CitizenRegistration';
import { ethers } from 'ethers';
import { ToastProvider } from '../contexts/ToastContext';

describe('CitizenRegistration', () => {
  it('should register identity when form is submitted', async () => {
    const mockProvider = {
      getSigner: vi.fn().mockResolvedValue({
        sendTransaction: vi.fn().mockResolvedValue({ wait: vi.fn() }),
      }),
    };

    const mockIdentityContract = {
      registerIdentity: vi.fn().mockResolvedValue({ wait: vi.fn() }),
      connect: vi.fn().mockReturnThis(),
    };

    const mockSetRegisteredHash = vi.fn();

    render(
      <ToastProvider>
        <CitizenRegistration
          provider={mockProvider as any}
          identityContract={mockIdentityContract as any}
          setRegisteredHash={mockSetRegisteredHash}
        />
      </ToastProvider>
    );

    const nikInput = screen.getByLabelText('NIK (National ID Number)');
    const registerButton = screen.getByText('Register Identity');

    const nik = '1234567890123456';
    const nikHash = ethers.keccak256(ethers.toUtf8Bytes(nik));

    fireEvent.change(nikInput, { target: { value: nik } });
    fireEvent.click(registerButton);

    // Wait for the async operations to complete
    await screen.findByText('Register Identity');

    expect(mockIdentityContract.registerIdentity).toHaveBeenCalledWith(nikHash);
    expect(mockSetRegisteredHash).toHaveBeenCalledWith(nikHash);
  });
});
