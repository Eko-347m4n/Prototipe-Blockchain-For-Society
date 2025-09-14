import { useState, useEffect, useMemo } from 'react';
import { ethers, Contract, BrowserProvider } from 'ethers';
import AppCard from './AppCard';
import CitizenRegistration from './CitizenRegistration';
import { useToast } from '../contexts/ToastContext';
import ApplicationHistory from './ApplicationHistory';

interface CitizenDashboardProps {
    provider: BrowserProvider;
    identityContract?: Contract;
    userAddress: string;
    dukcapilContract?: Contract;
}

const CitizenDashboard = ({ provider, identityContract, userAddress, dukcapilContract }: CitizenDashboardProps) => {
  const [applicationType, setApplicationType] = useState('');
  const [applicationDetails, setApplicationDetails] = useState('');
  const [loading, setLoading] = useState(false);
  const [registeredHash, setRegisteredHash] = useState<string | null>(null);

  useEffect(() => {
    const check = async () => {
      if (!identityContract || !userAddress) return;
      const hash = await identityContract.getIdentity(userAddress);
      if (hash !== ethers.ZeroHash) setRegisteredHash(hash);
    };
    check();
  }, [identityContract, userAddress]);

  const handleDeptChange = (dept: keyof typeof services) => {
    setSelectedDept(dept);
    setSelectedApp(services[dept].applications[0]);
  }

  const handleSubmitApplication = async () => {
    if (!applicationType || !applicationDetails || !dukcapilContract) return;
    setStatus('Submitting application...');
    try {
      const signer = await provider.getSigner();
      const contractWithSigner = dukcapilContract.connect(signer);
      const tx = await contractWithSigner.submitApplication(applicationType, applicationDetails);
      await tx.wait();
      addToast(`Permohonan '${selectedApp}' berhasil dikirim!`, 'success');
      setApplicationDetails('');
      setHistoryKey(k => k + 1); // Increment key to force a refresh of the history component
      setActiveTab('history'); // Switch to history tab after submission
    } catch (e) { 
      addToast(`Error: ${(e as Error).message}`, 'error');
    } finally {
      setLoading(false);
    }
  };

  if (!registeredHash) return <CitizenRegistration provider={provider} identityContract={identityContract} setRegisteredHash={setRegisteredHash} />;

  return (
    <AppCard title="Citizen Dashboard">
      <p className="mb-3">Welcome! Your identity hash is: <small className="text-muted">{registeredHash}</small></p>
      <hr />
      <h5>Submit New Application</h5>
      <div className="mb-3">
        <label htmlFor="appType" className="form-label">Application Type</label>
        <input id="appType" type="text" className="form-control" value={applicationType} onChange={(e) => setApplicationType(e.target.value)} placeholder="e.g., KTP Renewal" />
      </div>
      <div className="mb-3">
        <label htmlFor="appDetails" className="form-label">Details</label>
        <textarea id="appDetails" className="form-control" value={applicationDetails} onChange={(e) => setApplicationDetails(e.target.value)} />
      </div>
      <button onClick={handleSubmitApplication} className="btn btn-success">Submit</button>
      <TransactionStatus status={status} />
    </AppCard>
  );
};

export default CitizenDashboard;