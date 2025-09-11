import { useState, useEffect } from 'react';
import { Contract, BrowserProvider } from 'ethers';
import AppCard from './AppCard';
import TransactionStatus from './TransactionStatus';

interface AdminPanelProps {
  provider: BrowserProvider;
  rbacContract?: Contract;
}

const AdminPanel = ({ provider, rbacContract }: AdminPanelProps) => {
  const [address, setAddress] = useState('');
  const [role, setRole] = useState('');
  const [status, setStatus] = useState('');

  useEffect(() => {
    const getRole = async () => rbacContract && setRole(await rbacContract.DUKCAPIL_ROLE());
    getRole();
  }, [rbacContract]);

  const handleGrantRole = async () => {
    if (!address || !role || !rbacContract) return;
    setStatus('Sending transaction...');
    try {
      const signer = await provider.getSigner();
      const rbacWithSigner = rbacContract.connect(signer);
      const tx = await rbacWithSigner.grantRole(role, address);
      await tx.wait();
      setStatus(`Role granted successfully to ${address}!`);
      setAddress('');
    } catch (e) { setStatus(`Error: ${(e as Error).message}`); }
  };

  return (
    <AppCard title="Admin Panel: Role Management">
      <div className="mb-3">
        <label htmlFor="addressInput" className="form-label">User Address</label>
        <input id="addressInput" type="text" className="form-control" value={address} onChange={(e) => setAddress(e.target.value)} placeholder="0x..." />
      </div>
      <div className="mb-3">
        <label htmlFor="roleInput" className="form-label">Role to Grant</label>
        <input id="roleInput" type="text" className="form-control" value={role} readOnly />
      </div>
      <button onClick={handleGrantRole} className="btn btn-primary">Grant Role</button>
      <TransactionStatus status={status} />
    </AppCard>
  );
};

export default AdminPanel;
