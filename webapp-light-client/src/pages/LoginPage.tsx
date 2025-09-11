import React from 'react';

interface LoginPageProps {
  connectWallet: () => void;
  isLoading: boolean;
}

const LoginPage: React.FC<LoginPageProps> = ({ connectWallet, isLoading }) => {
  return (
    <div className="d-flex justify-content-center align-items-center" style={{ height: '80vh' }}>
      <div className="text-center">
        <h2>Welcome to the Web3 Kabupaten Portal</h2>
        <p>Please connect your wallet to continue.</p>
        <button onClick={connectWallet} className="btn btn-primary btn-lg" disabled={isLoading}>
          {isLoading ? 'Connecting...' : 'Connect Wallet'}
        </button>
      </div>
    </div>
  );
};

export default LoginPage;
