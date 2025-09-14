import { useState, useEffect, useCallback } from 'react';
import { Contract, BrowserProvider } from 'ethers';
import AppCard from './AppCard';
import { useToast } from '../contexts/ToastContext';

interface AdminPanelProps {
  provider: BrowserProvider;
  rbacContract?: Contract;
  dukcapilContract?: Contract;
  pendidikanContract?: Contract;
  sosialContract?: Contract;
  kesehatanContract?: Contract;
}

const ROLES = [
    { name: 'DUKCAPIL_ROLE', value: 'DUKCAPIL_ROLE' },
    { name: 'PENDIDIKAN_ROLE', value: 'PENDIDIKAN_ROLE' },
    { name: 'KESEHATAN_ROLE', value: 'KESEHATAN_ROLE' },
    { name: 'SOSIAL_ROLE', value: 'SOSIAL_ROLE' },
    { name: 'ADMIN_ROLE', value: 'ADMIN_ROLE' },
];

const AdminPanel = (props: AdminPanelProps) => {
  const { provider, rbacContract, dukcapilContract, pendidikanContract, sosialContract, kesehatanContract } = props;
  const [address, setAddress] = useState('');
  const [selectedRole, setSelectedRole] = useState(ROLES[0].value);
  const [loading, setLoading] = useState(false);
  const { addToast } = useToast();
  const [roleMembers, setRoleMembers] = useState<Record<string, string[]>>({});
  const [fetchingMembers, setFetchingMembers] = useState(true);

  const handleGrantRole = async () => {
    if (!address || !selectedRole || !rbacContract) return;
    setLoading(true);
    try {
      const roleHash = await rbacContract[selectedRole]();
      const signer = await provider.getSigner();
      const rbacWithSigner = rbacContract.connect(signer);
      const tx = await rbacWithSigner.grantRole(roleHash, address);
      await tx.wait();
      addToast(`Peran ${selectedRole} berhasil diberikan ke ${address}!`, 'success');
      setAddress('');
      fetchRoleMembers(); // Refresh the list after granting a new role
    } catch (e) { 
      addToast(`Error: ${(e as Error).message}`, 'error');
    } finally {
      setLoading(false);
    }
  };

  const fetchRoleMembers = useCallback(async () => {
    if (!rbacContract) return;
    setFetchingMembers(true);
    const members: Record<string, string[]> = {};
    for (const role of ROLES) {
      try {
        const roleHash = await rbacContract[role.value]();
        const filter = rbacContract.filters.RoleGranted(roleHash);
        const events = await rbacContract.queryFilter(filter);
        const uniqueAddresses = [...new Set(events.map(event => event.args.account))];
        members[role.name] = uniqueAddresses;
      } catch (e) {
        console.error(`Could not fetch members for ${role.name}`, e);
        members[role.name] = ['Error fetching data'];
      }
    }
    setRoleMembers(members);
    setFetchingMembers(false);
  }, [rbacContract]);

  useEffect(() => {
    fetchRoleMembers();
  }, [fetchRoleMembers]);

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text).then(() => {
        addToast('Address copied to clipboard!', 'success');
    }, (err) => {
        addToast('Failed to copy address.', 'error');
        console.error('Could not copy text: ', err);
    });
  };

  return (
    <>
        <AppCard title="Admin Panel: Role Management">
            <fieldset disabled={loading}>
                <div className="row g-3">
                    <div className="col-md-6">
                        <label htmlFor="addressInput" className="form-label">User Address</label>
                        <input id="addressInput" type="text" className="form-control" value={address} onChange={(e) => setAddress(e.target.value)} placeholder="0x..." />
                    </div>
                    <div className="col-md-6">
                        <label htmlFor="roleSelect" className="form-label">Role to Grant</label>
                        <select id="roleSelect" className="form-select" value={selectedRole} onChange={(e) => setSelectedRole(e.target.value)}>
                            {ROLES.map(role => (
                                <option key={role.value} value={role.value}>{role.name}</option>
                            ))}
                        </select>
                    </div>
                </div>
            </fieldset>
            <button onClick={handleGrantRole} className="btn btn-primary mt-3" disabled={loading || !address}>
                {loading ? (
                    <>
                        <span className="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span>
                        {' '}Granting...
                    </>
                ) : 'Grant Role'}
            </button>
        </AppCard>

        <AppCard title="Registered Officers by Role" className="mt-4">
            {fetchingMembers ? (
                <div className="d-flex align-items-center">
                    <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                    <span>Loading role members...</span>
                </div>
            ) : (
                <div className="accordion" id="rolesAccordion">
                    {Object.entries(roleMembers).map(([roleName, members]) => (
                    <div className="accordion-item" key={roleName}>
                        <h2 className="accordion-header" id={`heading-${roleName}`}>
                        <button className="accordion-button collapsed" type="button" data-bs-toggle="collapse" data-bs-target={`#collapse-${roleName}`} aria-expanded="false" aria-controls={`collapse-${roleName}`}>
                            {roleName} ({members.length} members)
                        </button>
                        </h2>
                        <div id={`collapse-${roleName}`} className="accordion-collapse collapse" aria-labelledby={`heading-${roleName}`} data-bs-parent="#rolesAccordion">
                            <div className="accordion-body">
                                {members.length > 0 ? (
                                <ul className="list-group">
                                    {members.map((member, i) => (
                                        <li key={i} className="list-group-item d-flex justify-content-between align-items-center" style={{fontFamily: 'monospace'}}>
                                            {member}
                                            <button onClick={() => copyToClipboard(member)} className="btn btn-link btn-sm p-0 ms-2" title="Copy Address">
                                                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-clipboard" viewBox="0 0 16 16"><path d="M4 1.5H3a2 2 0 0 0-2 2V14a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V3.5a2 2 0 0 0-2-2h-1v1h1a1 1 0 0 1 1 1V14a1 1 0 0 1-1 1H3a1 1 0 0 1-1-1V3.5a1 1 0 0 1 1-1h1v-1z"/><path d="M9.5 1a.5.5 0 0 1 .5.5v1a.5.5 0 0 1-.5.5h-3a.5.5 0 0 1-.5-.5v-1a.5.5 0 0 1 .5-.5h3zM-1 8a.5.5 0 0 1 .5-.5h10a.5.5 0 0 1 0 1H-0.5A.5.5 0 0 1-1 8z"/></svg>
                                            </button>
                                        </li>
                                    ))}
                                </ul>
                                ) : (
                                <p className="mb-0">No officers found for this role.</p>
                                )}
                            </div>
                        </div>
                    </div>
                    ))}
                </div>
            )}
        </AppCard>

        <AppCard title="Deployed Service Contracts" className="mt-4">
            <ul className="list-group">
                <li className="list-group-item d-flex justify-content-between align-items-center">
                    Dukcapil
                    <span className="badge bg-secondary rounded-pill" style={{fontFamily: 'monospace'}}>{dukcapilContract?.target?.toString() || 'N/A'}</span>
                </li>
                <li className="list-group-item d-flex justify-content-between align-items-center">
                    Pendidikan
                    <span className="badge bg-secondary rounded-pill" style={{fontFamily: 'monospace'}}>{pendidikanContract?.target?.toString() || 'N/A'}</span>
                </li>
                <li className="list-group-item d-flex justify-content-between align-items-center">
                    Kesehatan
                    <span className="badge bg-secondary rounded-pill" style={{fontFamily: 'monospace'}}>{kesehatanContract?.target?.toString() || 'N/A'}</span>
                </li>
                <li className="list-group-item d-flex justify-content-between align-items-center">
                    Sosial
                    <span className="badge bg-secondary rounded-pill" style={{fontFamily: 'monospace'}}>{sosialContract?.target?.toString() || 'N/A'}</span>
                </li>
            </ul>
        </AppCard>
    </>
  );
};

export default AdminPanel;