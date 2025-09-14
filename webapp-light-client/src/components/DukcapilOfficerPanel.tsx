import { useState } from 'react';
import { Contract, BrowserProvider } from 'ethers';
import AppCard from './AppCard';
import { useToast } from '../contexts/ToastContext';
import ApplicationReviewList from './ApplicationReviewList';

interface DukcapilOfficerPanelProps {
  provider: BrowserProvider;
  dukcapilContract?: Contract;
}

const DukcapilOfficerPanel = ({ provider, dukcapilContract }: DukcapilOfficerPanelProps) => {
  const [nik, setNik] = useState('');
  const [name, setName] = useState('');
  const [dob, setDob] = useState('');
  const [addr, setAddr] = useState('');
  const [maritalStatus, setMaritalStatus] = useState('');
  const [economicStatus, setEconomicStatus] = useState('');
  const [loading, setLoading] = useState(false);
  const { addToast } = useToast();
  const [activeTab, setActiveTab] = useState('review');

  const handleUpdateData = async () => {
    if (!nik || !dukcapilContract) return;
    setLoading(true);
    try {
      const signer = await provider.getSigner();
      const contractWithSigner = dukcapilContract.connect(signer);
      const tx = await contractWithSigner.updateCitizenData(nik, name, dob, addr, maritalStatus, economicStatus);
      await tx.wait();
      addToast(`Data untuk NIK ${nik} berhasil diperbarui!`, 'success');
    } catch (e) {
      addToast(`Error: ${(e as Error).message}`, 'error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <ul className="nav nav-tabs mb-3">
        <li className="nav-item">
          <button className={`nav-link ${activeTab === 'review' ? 'active' : ''}`} onClick={() => setActiveTab('review')}>
            Tinjau Permohonan
          </button>
        </li>
        <li className="nav-item">
          <button className={`nav-link ${activeTab === 'update' ? 'active' : ''}`} onClick={() => setActiveTab('update')}>
            Perbarui Data Warga
          </button>
        </li>
      </ul>

      {activeTab === 'review' && (
        <AppCard title="Tinjau Permohonan Layanan Dukcapil">
            <ApplicationReviewList provider={provider} contract={dukcapilContract} contractName="Dukcapil" />
        </AppCard>
      )}

      {activeTab === 'update' && (
        <AppCard title="Perbarui Data Warga">
          <div className="row g-3">
            <div className="col-md-6">
              <label htmlFor="nik" className="form-label">NIK</label>
              <input id="nik" type="text" className="form-control" value={nik} onChange={e => setNik(e.target.value)} />
            </div>
            <div className="col-md-6">
              <label htmlFor="name" className="form-label">Name</label>
              <input id="name" type="text" className="form-control" value={name} onChange={e => setName(e.target.value)} />
            </div>
            <div className="col-md-6">
              <label htmlFor="dob" className="form-label">Date of Birth</label>
              <input id="dob" type="text" className="form-control" value={dob} onChange={e => setDob(e.target.value)} />
            </div>
            <div className="col-md-6">
              <label htmlFor="address" className="form-label">Address</label>
              <input id="address" type="text" className="form-control" value={addr} onChange={e => setAddr(e.target.value)} />
            </div>
            <div className="col-md-6">
              <label htmlFor="maritalStatus" className="form-label">Marital Status</label>
              <input id="maritalStatus" type="text" className="form-control" value={maritalStatus} onChange={e => setMaritalStatus(e.target.value)} />
            </div>
            <div className="col-md-6">
              <label htmlFor="economicStatus" className="form-label">Economic Status</label>
              <input id="economicStatus" type="text" className="form-control" value={economicStatus} onChange={e => setEconomicStatus(e.target.value)} />
            </div>
          </div>
          <button onClick={handleUpdateData} className="btn btn-primary mt-3" disabled={loading || !nik}>
            {loading ? (
              <>
                <span className="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span>
                {' '}Memperbarui...
              </>
            ) : (
              'Perbarui Data'
            )}
          </button>
        </AppCard>
      )}
    </>
  );
};

export default DukcapilOfficerPanel;