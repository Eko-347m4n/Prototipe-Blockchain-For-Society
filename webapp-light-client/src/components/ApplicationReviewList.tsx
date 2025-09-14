import { useState, useEffect, useCallback } from 'react';
import { Contract, BrowserProvider } from 'ethers';
import { useToast } from '../contexts/ToastContext';

interface ApplicationReviewListProps {
    provider: BrowserProvider;
    contract?: Contract;
    contractName: string;
}

interface Application {
    id: string;
    applicant: string;
    type: string;
    details: string;
    timestamp: number;
}

const ApplicationReviewList = ({ provider, contract, contractName }: ApplicationReviewListProps) => {
    const [applications, setApplications] = useState<Application[]>([]);
    const [loading, setLoading] = useState(true);
    const [actionLoading, setActionLoading] = useState<string | null>(null);
    const { addToast } = useToast();
    
    // State for inline rejection
    const [rejectingAppId, setRejectingAppId] = useState<string | null>(null);
    const [rejectionReason, setRejectionReason] = useState('');

    const fetchApplications = useCallback(async () => {
        if (!contract) return;
        setLoading(true);
        try {
            const submittedFilter = contract.filters.ApplicationSubmitted();
            const submittedEvents = await contract.queryFilter(submittedFilter, 0, 'latest');

            const pendingApps = await Promise.all(
                submittedEvents.map(async (event) => {
                    const { applicationId } = event.args;
                    const appDetails = await contract.applications(applicationId);
                    if (Number(appDetails.status) === 0) { // Status.Pending
                        return {
                            id: applicationId,
                            applicant: appDetails.applicant,
                            type: appDetails.applicationType,
                            details: appDetails.applicationDetails,
                            timestamp: Number(appDetails.timestamp),
                        } as Application;
                    }
                    return null;
                })
            );

            setApplications(pendingApps.filter(app => app !== null).reverse() as Application[]);
        } catch (e) {
            console.error(`Could not fetch applications for ${contractName}`, e);
            addToast(`Could not fetch applications for ${contractName}`, 'error');
        }
        setLoading(false);
    }, [contract, contractName, addToast]);

    useEffect(() => {
        fetchApplications();
    }, [fetchApplications]);

    const handleApprove = async (applicationId: string) => {
        if (!contract) return;
        setActionLoading(applicationId);
        try {
            const signer = await provider.getSigner();
            const contractWithSigner = contract.connect(signer);
            const tx = await contractWithSigner.approveApplication(applicationId);
            await tx.wait();
            addToast(`Application ${applicationId} approved!`, 'success');
            fetchApplications(); // Refresh list
        } catch (e) {
            addToast(`Error approving application: ${(e as Error).message}`, 'error');
        } finally {
            setActionLoading(null);
        }
    };

    const handleReject = async () => {
        if (!contract || !rejectingAppId || !rejectionReason) return;
        setActionLoading(rejectingAppId);
        try {
            const signer = await provider.getSigner();
            const contractWithSigner = contract.connect(signer);
            const tx = await contractWithSigner.rejectApplication(rejectingAppId, rejectionReason);
            await tx.wait();
            addToast(`Application ${rejectingAppId} rejected!`, 'success');
            fetchApplications(); // Refresh list
        } catch (e) {
            addToast(`Error rejecting application: ${(e as Error).message}`, 'error');
        } finally {
            setActionLoading(null);
            setRejectingAppId(null);
            setRejectionReason('');
        }
    };

    const startReject = (appId: string) => {
        setRejectingAppId(appId);
        setRejectionReason('');
    };

    const cancelReject = () => {
        setRejectingAppId(null);
        setRejectionReason('');
    };

    const copyToClipboard = (text: string) => {
        navigator.clipboard.writeText(text).then(() => {
            addToast('Address copied to clipboard!', 'success');
        }, (err) => {
            addToast('Failed to copy address.', 'error');
            console.error('Could not copy text: ', err);
        });
    };

    if (loading && applications.length === 0) {
        return <div className="text-center"><span className="spinner-border"></span><p>Loading applications...</p></div>;
    }

    return (
        <>
            <div className="d-flex justify-content-between align-items-center mb-3">
                <h5 className="mb-0">Pending Applications ({applications.length})</h5>
                <button className="btn btn-sm btn-outline-secondary" onClick={fetchApplications} disabled={loading || !!actionLoading}>
                    {loading ? <span className="spinner-border spinner-border-sm"></span> : 'Refresh'}
                </button>
            </div>
            {applications.length === 0 ? (
                <div className="alert alert-secondary">No pending applications.</div>
            ) : (
                <div className={`list-group ${loading ? 'opacity-50' : ''}`}>
                    {applications.map((app) => (
                        <div key={app.id} className="list-group-item list-group-item-action flex-column align-items-start">
                            <div className="d-flex w-100 justify-content-between">
                                <h6 className="mb-1">ID: {app.id} - {app.type}</h6>
                                <small>{new Date(app.timestamp * 1000).toLocaleString()}</small>
                            </div>
                            <p className="mb-1"><small><strong>Applicant:</strong> {app.applicant}</small>
                                <button onClick={() => copyToClipboard(app.applicant)} className="btn btn-link btn-sm p-0 ms-2" title="Copy Address">
                                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-clipboard" viewBox="0 0 16 16"><path d="M4 1.5H3a2 2 0 0 0-2 2V14a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V3.5a2 2 0 0 0-2-2h-1v1h1a1 1 0 0 1 1 1V14a1 1 0 0 1-1 1H3a1 1 0 0 1-1-1V3.5a1 1 0 0 1 1-1h1v-1z"/><path d="M9.5 1a.5.5 0 0 1 .5.5v1a.5.5 0 0 1-.5.5h-3a.5.5 0 0 1-.5-.5v-1a.5.5 0 0 1 .5-.5h3zM-1 8a.5.5 0 0 1 .5-.5h10a.5.5 0 0 1 0 1H-0.5A.5.5 0 0 1-1 8z"/></svg>
                                </button>
                            </p>
                            <p className="mb-1"><strong>Details:</strong> {app.details}</p>
                            
                            {rejectingAppId === app.id ? (
                                <div className="mt-2">
                                    <textarea 
                                        className="form-control form-control-sm mb-2" 
                                        placeholder="Reason for rejection..."
                                        value={rejectionReason}
                                        onChange={(e) => setRejectionReason(e.target.value)}
                                    />
                                    <button className="btn btn-danger btn-sm me-2" onClick={handleReject} disabled={!rejectionReason || !!actionLoading}>
                                        {actionLoading === app.id ? <span className="spinner-border spinner-border-sm"></span> : 'Confirm Reject'}
                                    </button>
                                    <button className="btn btn-secondary btn-sm" onClick={cancelReject} disabled={!!actionLoading}>
                                        Cancel
                                    </button>
                                </div>
                            ) : (
                                <div className="mt-2">
                                    <button 
                                        className="btn btn-success btn-sm me-2" 
                                        onClick={() => handleApprove(app.id)}
                                        disabled={!!actionLoading}
                                    >
                                        {actionLoading === app.id ? <span className="spinner-border spinner-border-sm"></span> : 'Approve'}
                                    </button>
                                    <button 
                                        className="btn btn-danger btn-sm" 
                                        onClick={() => startReject(app.id)}
                                        disabled={!!actionLoading}
                                    >
                                        Reject
                                    </button>
                                </div>
                            )}
                        </div>
                    ))}
                </div>
            )}
        </>
    );
};

export default ApplicationReviewList;