import { useState } from 'react';
import { Contract, BrowserProvider, parseEther } from 'ethers';
import AppCard from './AppCard';
import { useToast } from '../contexts/ToastContext';
import ApplicationReviewList from './ApplicationReviewList';

interface SosialOfficerPanelProps {
  provider: BrowserProvider;
  sosialContract?: Contract;
}

const SosialOfficerPanel = ({ provider, sosialContract }: SosialOfficerPanelProps) => {
  const [beneficiaryId, setBeneficiaryId] = useState('');
  const [aidType, setAidType] = useState('');
  const [aidStatus, setAidStatus] = useState('');
  const [amount, setAmount] = useState('0');
  const [loading, setLoading] = useState(false);
  const { addToast } = useToast();
  const [activeTab, setActiveTab] = useState('review');

  const handleRecordDistribution = async () => {
    if (!beneficiaryId || !aidType || !aidStatus || !sosialContract) return;
    setLoading(true);
    try {
      const signer = await provider.getSigner();
      const contractWithSigner = sosialContract.connect(signer);
      const tx = await contractWithSigner.recordAidDistribution(beneficiaryId, aidType, aidStatus, parseEther(amount));
      await tx.wait();
      addToast(`Distribusi bantuan untuk ${beneficiaryId} berhasil dicatat!`, 'success');
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
            Catat Distribusi Bantuan
          </button>
        </li>
      </ul>

      {activeTab === 'review' && (
        <AppCard title="Tinjau Permohonan Layanan Sosial">
            <ApplicationReviewList provider={provider} contract={sosialContract} contractName="Sosial" />
        </AppCard>
      )}

      {activeTab === 'update' && (
        <AppCard title="Catat Distribusi Bantuan">
          <div className="row g-3">
            <div className="col-md-6">
              <label htmlFor="beneficiaryId" className="form-label">Beneficiary ID (NIK)</label>
              <input id="beneficiaryId" type="text" className="form-control" value={beneficiaryId} onChange={e => setBeneficiaryId(e.target.value)} />
            </div>
            <div className="col-md-6">
              <label htmlFor="aidType" className="form-label">Aid Type</label>
              <input id="aidType" type="text" className="form-control" value={aidType} onChange={e => setAidType(e.target.value)} placeholder="e.g., PKH, Sembako" />
            </div>
            <div className="col-md-6">
              <label htmlFor="aidStatus" className="form-label">Status</label>
              <input id="aidStatus" type="text" className="form-control" value={aidStatus} onChange={e => setAidStatus(e.target.value)} placeholder="e.g., Distributed, Pending" />
            </div>
            <div className="col-md-6">
              <label htmlFor="amount" className="form-label">Amount (in ETH)</label>
              <input id="amount" type="text" className="form-control" value={amount} onChange={e => setAmount(e.target.value)} />
            </div>
          </div>
          <button onClick={handleRecordDistribution} className="btn btn-primary mt-3" disabled={loading || !beneficiaryId}>
            {loading ? (
              <>
                <span className="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span>
                {' '}Mencatat...
              </>
            ) : (
              'Catat Distribusi'
            )}
          </button>
        </AppCard>
      )}
    </>
  );
};

export default SosialOfficerPanel;