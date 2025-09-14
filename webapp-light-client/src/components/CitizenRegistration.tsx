import { useState } from 'react';
import { ethers, Contract, BrowserProvider } from 'ethers';
import AppCard from './AppCard';
import { useToast } from '../contexts/ToastContext';

interface CitizenRegistrationProps {
    provider: BrowserProvider;
    identityContract?: Contract;
    setRegisteredHash: (hash: string) => void;
}

const CitizenRegistration = ({ provider, identityContract, setRegisteredHash }: CitizenRegistrationProps) => {
  const [nik, setNik] = useState('');
  const [loading, setLoading] = useState(false);
  const { addToast } = useToast();

  const handleRegister = async () => {
    if (!nik || !identityContract) return;
    setLoading(true);
    try {
      const nikHash = ethers.keccak256(ethers.toUtf8Bytes(nik));
      const signer = await provider.getSigner();
      const contractWithSigner = identityContract.connect(signer);
      const tx = await contractWithSigner.registerIdentity(nikHash);
      await tx.wait();
      addToast('Identity registered successfully!', 'success');
      setRegisteredHash(nikHash);
    } catch (e) { 
      addToast(`Error: ${(e as Error).message}`, 'error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <AppCard title="Citizen Identity Registration">
      <p>Your wallet is not yet registered. Please register your NIK to continue.</p>
      <div className="mb-3">
        <label htmlFor="nikInput" className="form-label">NIK (National ID Number)</label>
        <input id="nikInput" type="text" className="form-control" value={nik} onChange={(e) => setNik(e.target.value)} />
      </div>
      <button onClick={handleRegister} className="btn btn-primary" disabled={loading}>
        {loading ? (
          <>
            <span className="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span>
            {' '}Registering...
          </>
        ) : (
          'Register Identity'
        )}
      </button>
    </AppCard>
  );
}

export default CitizenRegistration;
