import React from 'react';

interface LoginPageProps {
  connectWallet: () => void;
  isLoading: boolean;
}

const LoginPage: React.FC<LoginPageProps> = ({ connectWallet, isLoading }) => {
  return (
    <div className="d-flex justify-content-center align-items-center" style={{ height: '80vh' }}>
      <div className="text-center p-5 bg-light border rounded-3">
        <h1 className="display-5">Portal Web3 Kabupaten</h1>
        <p className="lead text-muted">Silakan hubungkan dompet digital Anda untuk melanjutkan.</p>
        <hr/>
        <button onClick={connectWallet} className="btn btn-primary btn-lg" disabled={isLoading}>
          {isLoading ? (
            <>
              <span className="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span>
              {' '}
              Menghubungkan...
            </>
          ) : (
            'Hubungkan Dompet'
          )}
        </button>
      </div>
    </div>
  );
};

export default LoginPage;
