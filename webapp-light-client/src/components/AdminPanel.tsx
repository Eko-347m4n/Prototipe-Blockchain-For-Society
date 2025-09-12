import { useState, useEffect } from 'react';
import { Contract, BrowserProvider } from 'ethers';
import AppCard from './AppCard';
import TransactionStatus from './TransactionStatus';

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
  const [selectedRole, setSelectedRole] = useState('');
  const [roles, setRoles] = useState<Role[]>([]);
  const [status, setStatus] = useState('');

  useEffect(() => {
    const getRoles = async () => {
      if (!rbacContract) return;
      try {
        const roleNames = ['DUKCAPIL_ROLE', 'PENDIDIKAN_ROLE', 'SOSIAL_ROLE', 'KESEHATAN_ROLE'];
        const roleValues = await Promise.all(roleNames.map(name => rbacContract[name]()));
        const fetchedRoles = roleNames.map((name, i) => ({ name: name.replace('_ROLE', ''), value: roleValues[i] }));
        setRoles(fetchedRoles);
        if (fetchedRoles.length > 0) {
          setSelectedRole(fetchedRoles[0].value);
        }
      } catch (e) {
        console.error("Could not fetch roles", e);
      }
    };
    getRoles();
  }, [rbacContract]);

  const handleGrantRole = async () => {
    if (!address || !selectedRole || !rbacContract) return;
    setStatus('Sending transaction...');
    try {
      const signer = await provider.getSigner();
      const rbacWithSigner = rbacContract.connect(signer);
      const tx = await rbacWithSigner.grantRole(selectedRole, address);
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
        <label htmlFor="roleSelect" className="form-label">Role to Grant</label>
        <select id="roleSelect" className="form-select" value={selectedRole} onChange={(e) => setSelectedRole(e.target.value)}>
          {roles.map(role => (
            <option key={role.value} value={role.value}>{role.name}</option>
          ))}
        </select>
      </div>
      <button onClick={handleGrantRole} className="btn btn-primary" disabled={!address || !selectedRole}>Grant Role</button>
      <TransactionStatus status={status} />
    </AppCard>
  );
};

export default AdminPanel;