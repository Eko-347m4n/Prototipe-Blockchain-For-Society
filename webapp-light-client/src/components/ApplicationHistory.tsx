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
    rejectionReason?: string;
}

const statusMap = ['Pending', 'Approved', 'Rejected'];

const StatusBadge = ({ status }: { status: Application['status'] }) => {
    const statusConfig = {
        Pending: { bg: 'warning', icon: <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-clock-history me-1" viewBox="0 0 16 16"><path d="M8.515 1.019A7 7 0 0 0 8 1V0a8 8 0 0 1 .589.022l-.074.997zM5.893 1.954a7.003 7.003 0 0 0-3.332 2.992l.982.196c.84-.418 1.783-.725 2.788-.8l-.44-.968zM1.954 5.893a7.003 7.003 0 0 0-1.005 3.332l.982.196c.17-.83.46-1.623.858-2.35l-.835-.579zM1.019 8.515a7 7 0 0 0 1.005 3.332l.835-.579c-.398-.727-.688-1.52-.858-2.35l-.982.196zM5.893 14.046a7.003 7.003 0 0 0 3.332-2.992l-.982-.196c-.84.418-1.783.725-2.788.8l.44.968zM14.046 10.107a7.003 7.003 0 0 0-2.992-3.332l-.196.982c.418.84.725 1.783.8 2.788l.968-.44zM10.107 1.954a7.003 7.003 0 0 0-3.332-1.005l.196.982c.83.17 1.623.46 2.35.858l.579-.835z"/><path d="M8 3.5a.5.5 0 0 0-1 0V9a.5.5 0 0 0 .252.434l3.5 2a.5.5 0 0 0 .496-.868L8 8.71V3.5z"/></svg> },
        Approved: { bg: 'success', icon: <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-check-circle-fill me-1" viewBox="0 0 16 16"><path d="M16 8A8 8 0 1 1 0 8a8 8 0 0 1 16 0zm-3.97-3.03a.75.75 0 0 0-1.08.022L7.477 9.417 5.384 7.323a.75.75 0 0 0-1.06 1.06L6.97 11.03a.75.75 0 0 0 1.079-.02l3.992-4.99a.75.75 0 0 0-.01-1.05z"/></svg> },
        Rejected: { bg: 'danger', icon: <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-x-circle-fill me-1" viewBox="0 0 16 16"><path d="M16 8A8 8 0 1 1 0 8a8 8 0 0 1 16 0zM5.354 4.646a.5.5 0 1 0-.708.708L7.293 8l-2.647 2.646a.5.5 0 0 0 .708.708L8 8.707l2.646 2.647a.5.5 0 0 0 .708-.708L8.707 8l2.647-2.646a.5.5 0 0 0-.708-.708L8 7.293 5.354 4.646z"/></svg> },
    };
    const { bg, icon } = statusConfig[status];
    return (
        <span className={`badge bg-${bg}-subtle text-${bg}-emphasis border border-${bg}-subtle`}>
            {icon}
            {status}
        </span>
    );
};

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
                        
                        let rejectionReason: string | undefined = undefined;
                        if (Number(appDetails.status) === 2) { // If status is Rejected
                            const rejectFilter = contract.filters.ApplicationRejected(applicationId);
                            const rejectEvents = await contract.queryFilter(rejectFilter, 0, 'latest');
                            if (rejectEvents.length > 0) {
                                rejectionReason = rejectEvents[rejectEvents.length - 1].args.reason;
                            }
                        }

                        return {
                            id: applicationId,
                            type: appDetails.applicationType,
                            details: appDetails.applicationDetails,
                            timestamp: Number(appDetails.timestamp),
                            status: statusMap[Number(appDetails.status)],
                            department: name,
                            rejectionReason: rejectionReason,
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
                    {loading ? (
                        <span className="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span>
                    ) : (
                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-arrow-clockwise" viewBox="0 0 16 16"><path fillRule="evenodd" d="M8 3a5 5 0 1 0 4.546 2.914.5.5 0 0 1 .908-.417A6 6 0 1 1 8 2v1z"/><path d="M8 4.466V.534a.25.25 0 0 1 .41-.192l2.36 1.966c.12.1.12.284 0 .384L8.41 4.658A.25.25 0 0 1 8 4.466z"/></svg>
                    )}
                </button>
            </div>
            {applications.length === 0 && !loading ? (
                <div className="alert alert-secondary">Belum ada permohonan yang diajukan.</div>
            ) : (
                <div className={`table-responsive ${loading ? 'opacity-50' : ''}`}>
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
                                        <StatusBadge status={app.status} />
                                        {app.rejectionReason && (
                                            <div className="text-danger fst-italic mt-1" style={{fontSize: '0.875em'}}>
                                                Reason: {app.rejectionReason}
                                            </div>
                                        )}
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                    {loading && (
                        <div className="text-center position-absolute top-50 start-50 translate-middle">
                            <div className="spinner-border text-primary" role="status">
                                <span className="visually-hidden">Loading...</span>
                            </div>
                        </div>
                    )}
                </div>
            )}
        </div>
    );
};

export default ApplicationHistory;