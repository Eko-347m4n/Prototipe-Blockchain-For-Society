import { useState } from 'react';
import { ethers, Contract, BrowserProvider } from 'ethers';
import AppCard from './AppCard';
import TransactionStatus from './TransactionStatus';

interface CitizenRegistrationProps {
    provider: BrowserProvider;
    identityContract?: Contract;
    setRegisteredHash: (hash: string) => void;
}

const CitizenRegistration = ({ provider, identityContract, setRegisteredHash }: CitizenRegistrationProps) => {
  const [nik, setNik] = useState('');
  const [status, setStatus] = useState('');

  const handleRegister = async () => {
    if (!nik || !identityContract) return;
    setStatus('Registering identity...');
    try {
      const nikHash = ethers.keccak256(ethers.toUtf8Bytes(nik));
      const signer = await provider.getSigner();
      const contractWithSigner = identityContract.connect(signer);
      const tx = await contractWithSigner.registerIdentity(nikHash);
      await tx.wait();
      setStatus('Identity registered successfully!');
      setRegisteredHash(nikHash);
    } catch (e) { setStatus(`Error: ${(e as Error).message}`); }
  };

  return (
    <AppCard title="Citizen Identity Registration">
      <p>Your wallet is not yet registered. Please register your NIK to continue.</p>
      <div className="mb-3">
        <label htmlFor="nikInput" className="form-label">NIK (National ID Number)</label>
        <input id="nikInput" type="text" className="form-control" value={nik} onChange={(e) => setNik(e.target.value)} />
      </div>
      <button onClick={handleRegister} className="btn btn-primary">Register Identity</button>
      <TransactionStatus status={status} />
    </AppCard>
  );
}

export default CitizenRegistration;
