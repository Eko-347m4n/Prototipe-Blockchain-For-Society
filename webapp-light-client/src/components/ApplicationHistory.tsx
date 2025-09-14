import { useState, useEffect, useCallback } from 'react';
import { Contract, BrowserProvider } from 'ethers';
import { useToast } from '../contexts/ToastContext';

interface ApplicationHistoryProps {
    provider: BrowserProvider;
    userAddress: string;
    contracts: { name: string; contract?: Contract }[];
}

interface Application {
    id: string;
    type: string;
    details: string;
    timestamp: number;
    status: 'Pending' | 'Approved' | 'Rejected';
    department: string;
}

const statusMap = ['Pending', 'Approved', 'Rejected'];

const ApplicationHistory = ({ provider, userAddress, contracts }: ApplicationHistoryProps) => {
    const [applications, setApplications] = useState<Application[]>([]);
    const [loading, setLoading] = useState(true);
    const { addToast } = useToast();

    const fetchHistory = useCallback(async () => {
        setLoading(true);
        let allApplications: Application[] = [];

        for (const { name, contract } of contracts) {
            if (!contract) continue;

            try {
                const submittedFilter = contract.filters.ApplicationSubmitted(null, userAddress);
                const submittedEvents = await contract.queryFilter(submittedFilter, 0, 'latest');

                const promises = submittedEvents
                    .map(async (event) => {
                        const { applicationId } = event.args;
                        const appDetails = await contract.applications(applicationId);

                        return {
                            id: applicationId,
                            type: appDetails.applicationType,
                            details: appDetails.applicationDetails,
                            timestamp: Number(appDetails.timestamp),
                            status: statusMap[Number(appDetails.status)],
                            department: name,
                        } as Application;
                    });
                
                const userApps = await Promise.all(promises);
                allApplications.push(...userApps);

            } catch (e) {
                console.error(`Could not fetch history for ${name}`, e);
                addToast(`Could not fetch history for ${name}`, 'error');
            }
        }

        setApplications(allApplications.sort((a, b) => b.timestamp - a.timestamp));
        setLoading(false);
    }, [contracts, userAddress, addToast]);

    useEffect(() => {
        fetchHistory();
    }, [fetchHistory]);

    if (loading) {
        return <div className="text-center"><span className="spinner-border"></span><p>Loading application history...</p></div>;
    }

    return (
        <div>
            <div className="d-flex justify-content-between align-items-center mb-3">
                <h5 className="mb-0">Riwayat Permohonan</h5>
                <button className="btn btn-sm btn-outline-secondary" onClick={fetchHistory} disabled={loading}>
                    Refresh
                </button>
            </div>
            {applications.length === 0 ? (
                <div className="alert alert-secondary">Belum ada permohonan yang diajukan.</div>
            ) : (
                <div className="table-responsive">
                    <table className="table table-striped table-hover">
                        <thead className="table-light">
                            <tr>
                                <th>ID</th>
                                <th>Dinas</th>
                                <th>Jenis Layanan</th>
                                <th>Tanggal</th>
                                <th>Status</th>
                            </tr>
                        </thead>
                        <tbody>
                            {applications.map((app) => (
                                <tr key={`${app.department}-${app.id}`}>
                                    <td><small>{app.id}</small></td>
                                    <td>{app.department}</td>
                                    <td>{app.type}</td>
                                    <td>{new Date(app.timestamp * 1000).toLocaleString()}</td>
                                    <td>
                                        <span className={`badge bg-${app.status === 'Approved' ? 'success' : app.status === 'Rejected' ? 'danger' : 'warning'}`}>
                                            {app.status}
                                        </span>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}
        </div>
    );
};

export default ApplicationHistory;