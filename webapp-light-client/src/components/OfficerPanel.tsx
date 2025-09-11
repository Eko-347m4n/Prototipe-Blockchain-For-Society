import { useState } from 'react';
import { Contract, BrowserProvider } from 'ethers';
import AppCard from './AppCard';
import TransactionStatus from './TransactionStatus';

interface OfficerPanelProps {
    provider: BrowserProvider;
    contract?: Contract;
    title: string;
    actionName: string;
    fieldName: string;
}

const OfficerPanel = ({ provider, contract, title, actionName, fieldName }: OfficerPanelProps) => {
  const [id, setId] = useState('');
  const [data, setData] = useState('');
  const [status, setStatus] = useState('');
  const [lastData, setLastData] = useState('');

  const handleAction = async () => {
    if (!id || !data || !contract) return;
    setStatus('Sending transaction...');
    try {
      const signer = await provider.getSigner();
      const contractWithSigner = contract.connect(signer);
      // This is a generic handler; specific function names would be better
      const tx = await contractWithSigner[actionName](id, data);
      await tx.wait();
      setStatus(`Data recorded successfully!`);
      setLastData(data);
    } catch (e) { setStatus(`Error: ${(e as Error).message}`); }
  };

  return (
    <AppCard title={title}>
      <div className="mb-3">
        <label className="form-label">{fieldName}</label>
        <input type="text" className="form-control" value={id} onChange={(e) => setId(e.target.value)} />
      </div>
      <p>Last recorded data for {id}: <strong>{lastData || "N/A"}</strong></p>
      <div className="mb-3">
        <label className="form-label">New Data</label>
        <input type="text" className="form-control" value={data} onChange={(e) => setData(e.target.value)} />
      </div>
      <button onClick={handleAction} className="btn btn-info">{actionName}</button>
      <TransactionStatus status={status} />
    </AppCard>
  );
};

export default OfficerPanel;
