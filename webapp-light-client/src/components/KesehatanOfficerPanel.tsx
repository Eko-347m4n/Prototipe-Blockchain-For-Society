import { useState } from 'react';
import { Contract, BrowserProvider } from 'ethers';
import AppCard from './AppCard';
import { useToast } from '../contexts/ToastContext';
import ApplicationReviewList from './ApplicationReviewList';

interface KesehatanOfficerPanelProps {
  provider: BrowserProvider;
  kesehatanContract?: Contract;
}

const KesehatanOfficerPanel = ({ provider, kesehatanContract }: KesehatanOfficerPanelProps) => {
  const [bpjsId, setBpjsId] = useState('');
  const [nik, setNik] = useState('');
  const [isValid, setIsValid] = useState(false);
  const [facility, setFacility] = useState('');
  const [loading, setLoading] = useState(false);
  const { addToast } = useToast();
  const [activeTab, setActiveTab] = useState('review');

  const handleRecordValidation = async () => {
    if (!bpjsId || !nik || !facility || !kesehatanContract) return;
    setLoading(true);
    try {
      const signer = await provider.getSigner();
      const contractWithSigner = kesehatanContract.connect(signer);
      const tx = await contractWithSigner.recordBPJSValidation(bpjsId, nik, isValid, facility);
      await tx.wait();
      addToast(`Validasi BPJS untuk ID ${bpjsId} berhasil dicatat!`, 'success');
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
            Catat Validasi BPJS
          </button>
        </li>
      </ul>

      {activeTab === 'review' && (
        <AppCard title="Tinjau Permohonan Layanan Kesehatan">
            <ApplicationReviewList provider={provider} contract={kesehatanContract} contractName="Kesehatan" />
        </AppCard>
      )}

      {activeTab === 'update' && (
        <AppCard title="Catat Validasi BPJS">
          <div className="row g-3">
            <div className="col-md-6">
              <label htmlFor="bpjsId" className="form-label">BPJS ID</label>
              <input id="bpjsId" type="text" className="form-control" value={bpjsId} onChange={e => setBpjsId(e.target.value)} />
            </div>
            <div className="col-md-6">
              <label htmlFor="nik" className="form-label">NIK</label>
              <input id="nik" type="text" className="form-control" value={nik} onChange={e => setNik(e.target.value)} />
            </div>
            <div className="col-md-6">
              <label htmlFor="facility" className="form-label">Fasilitas Kesehatan</label>
              <input id="facility" type="text" className="form-control" value={facility} onChange={e => setFacility(e.target.value)} />
            </div>
            <div className="col-md-6 align-self-center">
              <div className="form-check">
                <input id="isValid" type="checkbox" className="form-check-input" checked={isValid} onChange={e => setIsValid(e.target.checked)} />
                <label htmlFor="isValid" className="form-check-label">Is Valid</label>
              </div>
            </div>
          </div>
          <button onClick={handleRecordValidation} className="btn btn-primary mt-3" disabled={loading || !bpjsId || !nik}>
            {loading ? (
              <>
                <span className="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span>
                {' '}Mencatat...
              </>
            ) : (
              'Catat Validasi'
            )}
          </button>
        </AppCard>
      )}
    </>
  );
};

export default KesehatanOfficerPanel;