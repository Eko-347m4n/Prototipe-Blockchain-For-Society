import { useWeb3Modal } from '@web3modal/ethers/react';

const LoginPage = () => {
  const { open } = useWeb3Modal();

  return (
    <div className="d-flex justify-content-center align-items-center" style={{ height: '80vh' }}>
      <div className="text-center p-5 bg-light border rounded-3">
        <h1 className="display-5">Portal Web3 Kabupaten</h1>
        <p className="lead text-muted">Silakan hubungkan dompet digital Anda untuk melanjutkan.</p>
        <hr/>
        <button onClick={() => open()} className="btn btn-primary btn-lg">
          Hubungkan Dompet
        </button>
      </div>
    </div>
  );
};

export default LoginPage;