import { useState, useEffect } from 'react';
import { Contract, BrowserProvider } from 'ethers';
import AppCard from './AppCard';
import { useToast } from '../contexts/ToastContext';

interface AdminPanelProps {
  provider: BrowserProvider;
  rbacContract?: Contract;
}

interface Role {
  name: string;
  value: string;
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
      const tx = await rbacWithSigner.grantRole(selectedRole, address);
      await tx.wait();
      addToast(`Peran berhasil diberikan ke ${address}!`, 'success');
      setAddress('');
    } catch (e) { 
      addToast(`Error: ${(e as Error).message}`, 'error');
    } finally {
      setLoading(false);
    }
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