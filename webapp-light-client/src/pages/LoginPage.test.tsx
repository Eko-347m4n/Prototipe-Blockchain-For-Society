import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import LoginPage from './LoginPage';

const mockOpen = vi.fn();

vi.mock('@web3modal/ethers/react', () => ({
  useWeb3Modal: () => ({
    open: mockOpen,
  }),
}));

describe('LoginPage', () => {
  it('should call the open function when the connect button is clicked', () => {
    render(<LoginPage />);

    const connectButton = screen.getByText('Hubungkan Dompet');
    fireEvent.click(connectButton);

    expect(mockOpen).toHaveBeenCalledTimes(1);
  });
});
