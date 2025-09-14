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
    pendidikanContract?: Contract;
    sosialContract?: Contract;
    kesehatanContract?: Contract;
}

const services: any = {
    dukcapil: {
        name: 'Dukcapil',
        contractKey: 'dukcapilContract',
        applications: ['KTP Application', 'KK Application', 'Birth Certificate', 'Death Certificate', 'Move-out Letter']
    },
    pendidikan: {
        name: 'Pendidikan',
        contractKey: 'pendidikanContract',
        applications: ['School Registration', 'Student Transfer', 'Scholarship Application']
    },
    kesehatan: {
        name: 'Kesehatan',
        contractKey: 'kesehatanContract',
        applications: ['BPJS Registration', 'Hospital Registration', 'Online Referral']
    },
    sosial: {
        name: 'Sosial',
        contractKey: 'sosialContract',
        applications: ['Social Aid Application (PKH, etc.)', 'Welfare Data Verification (DTKS)']
    },
};

const CitizenDashboard = (props: CitizenDashboardProps) => {
  const { provider, identityContract, userAddress, dukcapilContract, pendidikanContract, sosialContract, kesehatanContract } = props;
  const [applicationDetails, setApplicationDetails] = useState('');
  const [loading, setLoading] = useState(false);
  const [registeredHash, setRegisteredHash] = useState<string | null>(null);
  const [selectedDept, setSelectedDept] = useState<keyof typeof services>('dukcapil');
  const [selectedApp, setSelectedApp] = useState(services.dukcapil.applications[0]);
  const { addToast } = useToast();
  const [activeTab, setActiveTab] = useState('new'); // 'new' or 'history'
  const [historyKey, setHistoryKey] = useState(0); // Add a key to force re-renders

  const contracts = useMemo(() => [
      { name: 'Dukcapil', contract: dukcapilContract },
      { name: 'Pendidikan', contract: pendidikanContract },
      { name: 'Sosial', contract: sosialContract },
      { name: 'Kesehatan', contract: kesehatanContract },
  ], [dukcapilContract, pendidikanContract, sosialContract, kesehatanContract]);

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
    const serviceInfo = services[selectedDept];
    const contract = props[serviceInfo.contractKey as keyof CitizenDashboardProps] as Contract | undefined;

    if (!selectedApp || !applicationDetails || !contract) return;
    
    setLoading(true);
    try {
      const signer = await provider.getSigner();
      const contractWithSigner = contract.connect(signer);
      const tx = await contractWithSigner.submitApplication(selectedApp, applicationDetails);
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

  const truncateHash = (hash: string) => `${hash.substring(0, 10)}...${hash.substring(hash.length - 8)}`;

  if (!registeredHash) return <CitizenRegistration provider={provider} identityContract={identityContract} setRegisteredHash={setRegisteredHash} />;

  return (
    <>
      <p className="mb-4">Welcome! Your identity hash is: <small className="text-muted d-block" title={registeredHash}>{truncateHash(registeredHash)}</small></p>
      
      <ul className="nav nav-tabs mb-3">
        <li className="nav-item">
          <button className={`nav-link ${activeTab === 'new' ? 'active' : ''}`} onClick={() => setActiveTab('new')}>
            Ajukan Permohonan Baru
          </button>
        </li>
        <li className="nav-item">
          <button className={`nav-link ${activeTab === 'history' ? 'active' : ''}`} onClick={() => setActiveTab('history')}>
            Riwayat Permohonan
          </button>
        </li>
      </ul>

      {activeTab === 'new' && (
        <AppCard title="Formulir Pengajuan Layanan">
          <fieldset disabled={loading}>
            <div className="row g-3">
              <div className="col-md-6">
                  <label htmlFor="deptSelect" className="form-label">Dinas</label>
                  <select id="deptSelect" className="form-select" value={selectedDept} onChange={(e) => handleDeptChange(e.target.value as keyof typeof services)}>
                      {Object.entries(services).map(([key, { name }]: any) => (
                          <option key={key} value={key}>{name}</option>
                      ))}
                  </select>
              </div>
              <div className="col-md-6">
                  <label htmlFor="appSelect" className="form-label">Jenis Layanan</label>
                  <select id="appSelect" className="form-select" value={selectedApp} onChange={(e) => setSelectedApp(e.target.value)}>
                      {services[selectedDept].applications.map((app: string) => (
                          <option key={app} value={app}>{app}</option>
                      ))}
                  </select>
              </div>
              <div className="col-12">
                  <label htmlFor="appDetails" className="form-label">Detail/Keterangan Permohonan</label>
                  <textarea id="appDetails" className="form-control" value={applicationDetails} onChange={(e) => setApplicationDetails(e.target.value)} placeholder={`Berikan detail yang diperlukan untuk ${selectedApp}...`} rows={4}/>
              </div>
            </div>
          </fieldset>
          <button onClick={handleSubmitApplication} className="btn btn-primary mt-3" disabled={loading || !applicationDetails}>
            {loading ? (
                <>
                    <span className="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span>
                    {' '}Mengirim...
                </>
            ) : (
                'Kirim Permohonan'
            )}
          </button>
        </AppCard>
      )}

      {activeTab === 'history' && (
          <ApplicationHistory key={historyKey} provider={provider} userAddress={userAddress} contracts={contracts} />
      )}
    </>
  );
};

export default CitizenDashboard;