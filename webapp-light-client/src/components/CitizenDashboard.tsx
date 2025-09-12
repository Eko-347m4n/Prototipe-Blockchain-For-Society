import { useState, useEffect } from 'react';
import { ethers, Contract, BrowserProvider } from 'ethers';
import AppCard from './AppCard';
import TransactionStatus from './TransactionStatus';
import CitizenRegistration from './CitizenRegistration';

interface CitizenDashboardProps {
    provider: BrowserProvider;
    identityContract?: Contract;
    userAddress: string;
    dukcapilContract?: Contract;
    pendidikanContract?: Contract;
    sosialContract?: Contract;
    kesehatanContract?: Contract;
}

const services = {
    dukcapil: { name: 'Dukcapil', contract: 'dukcapilContract' },
    pendidikan: { name: 'Pendidikan', contract: 'pendidikanContract' },
    sosial: { name: 'Sosial', contract: 'sosialContract' },
    kesehatan: { name: 'Kesehatan', contract: 'kesehatanContract' },
};

const CitizenDashboard = (props: CitizenDashboardProps) => {
  const { provider, identityContract, userAddress } = props;
  const [applicationType, setApplicationType] = useState('');
  const [applicationDetails, setApplicationDetails] = useState('');
  const [status, setStatus] = useState('');
  const [registeredHash, setRegisteredHash] = useState<string | null>(null);
  const [selectedService, setSelectedService] = useState<keyof typeof services>('dukcapil');

  useEffect(() => {
    const check = async () => {
      if (!identityContract || !userAddress) return;
      const hash = await identityContract.getIdentity(userAddress);
      if (hash !== ethers.ZeroHash) setRegisteredHash(hash);
    };
    check();
  }, [identityContract, userAddress]);

  const handleSubmitApplication = async () => {
    const serviceInfo = services[selectedService];
    const contract = props[serviceInfo.contract as keyof CitizenDashboardProps] as Contract | undefined;

    if (!applicationType || !applicationDetails || !contract) return;
    
    setStatus('Submitting application...');
    try {
      const signer = await provider.getSigner();
      const contractWithSigner = contract.connect(signer);
      const tx = await contractWithSigner.submitApplication(applicationType, applicationDetails);
      await tx.wait();
      setStatus(`Application submitted successfully! Tx Hash: ${tx.hash}`);
      setApplicationType('');
      setApplicationDetails('');
    } catch (e) { setStatus(`Error: ${(e as Error).message}`); }
  };

  if (!registeredHash) return <CitizenRegistration provider={provider} identityContract={identityContract} setRegisteredHash={setRegisteredHash} />;

  return (
    <AppCard title="Citizen Dashboard">
      <p className="mb-3">Welcome! Your identity hash is: <small className="text-muted">{registeredHash}</small></p>
      <hr />
      <h5>Submit New Application</h5>
      <div className="mb-3">
        <label htmlFor="serviceSelect" className="form-label">Service</label>
        <select id="serviceSelect" className="form-select" value={selectedService} onChange={(e) => setSelectedService(e.target.value as keyof typeof services)}>
            {Object.entries(services).map(([key, { name }]) => (
                <option key={key} value={key}>{name}</option>
            ))}
        </select>
      </div>
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