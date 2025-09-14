import { useState } from 'react';
import { Contract, BrowserProvider } from 'ethers';
import AppCard from './AppCard';
import { useToast } from '../contexts/ToastContext';
import ApplicationReviewList from './ApplicationReviewList';

interface PendidikanOfficerPanelProps {
  provider: BrowserProvider;
  pendidikanContract?: Contract;
}

const PendidikanOfficerPanel = ({ provider, pendidikanContract }: PendidikanOfficerPanelProps) => {
  const [studentId, setStudentId] = useState('');
  const [nik, setNik] = useState('');
  const [school, setSchool] = useState('');
  const [grade, setGrade] = useState('');
  const [loading, setLoading] = useState(false);
  const { addToast } = useToast();
  const [activeTab, setActiveTab] = useState('review');

  const handleUpdateRecord = async () => {
    if (!studentId || !nik || !school || !grade || !pendidikanContract) return;
    setLoading(true);
    try {
      const signer = await provider.getSigner();
      const contractWithSigner = pendidikanContract.connect(signer);
      const tx = await contractWithSigner.updateAcademicRecord(studentId, nik, school, grade);
      await tx.wait();
      addToast(`Catatan akademik untuk ID Siswa ${studentId} berhasil diperbarui!`, 'success');
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
            Perbarui Catatan Akademik
          </button>
        </li>
      </ul>

      {activeTab === 'review' && (
        <AppCard title="Tinjau Permohonan Layanan Pendidikan">
            <ApplicationReviewList provider={provider} contract={pendidikanContract} contractName="Pendidikan" />
        </AppCard>
      )}

      {activeTab === 'update' && (
        <AppCard title="Perbarui Catatan Akademik">
          <div className="row g-3">
            <div className="col-md-6">
              <label htmlFor="studentId" className="form-label">Student ID</label>
              <input id="studentId" type="text" className="form-control" value={studentId} onChange={e => setStudentId(e.target.value)} />
            </div>
            <div className="col-md-6">
              <label htmlFor="nik" className="form-label">NIK</label>
              <input id="nik" type="text" className="form-control" value={nik} onChange={e => setNik(e.target.value)} />
            </div>
            <div className="col-md-6">
              <label htmlFor="school" className="form-label">School</label>
              <input id="school" type="text" className="form-control" value={school} onChange={e => setSchool(e.target.value)} />
            </div>
            <div className="col-md-6">
              <label htmlFor="grade" className="form-label">Grade</label>
              <input id="grade" type="text" className="form-control" value={grade} onChange={e => setGrade(e.target.value)} />
            </div>
          </div>
          <button onClick={handleUpdateRecord} className="btn btn-primary mt-3" disabled={loading || !studentId || !nik}>
            {loading ? (
              <>
                <span className="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span>
                {' '}Memperbarui...
              </>
            ) : (
              'Update Record'
            )}
          </button>
        </AppCard>
      )}
    </>
  );
};

export default PendidikanOfficerPanel;