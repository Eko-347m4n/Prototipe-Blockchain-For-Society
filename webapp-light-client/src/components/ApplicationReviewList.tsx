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
    const [rejectionReason, setRejectionReason] = useState('');
    const [selectedApp, setSelectedApp] = useState<Application | null>(null);

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
        if (!contract || !selectedApp || !rejectionReason) return;
        setActionLoading(selectedApp.id);
        try {
            const signer = await provider.getSigner();
            const contractWithSigner = contract.connect(signer);
            const tx = await contractWithSigner.rejectApplication(selectedApp.id, rejectionReason);
            await tx.wait();
            addToast(`Application ${selectedApp.id} rejected!`, 'success');
            fetchApplications(); // Refresh list
        } catch (e) {
            addToast(`Error rejecting application: ${(e as Error).message}`, 'error');
        } finally {
            setActionLoading(null);
            setSelectedApp(null);
            setRejectionReason('');
        }
    };

    if (loading) {
        return <div className="text-center"><span className="spinner-border"></span><p>Loading applications...</p></div>;
    }

    return (
        <>
            <div className="d-flex justify-content-between align-items-center mb-3">
                <h5 className="mb-0">Pending Applications ({applications.length})</h5>
                <button className="btn btn-sm btn-outline-secondary" onClick={fetchApplications} disabled={loading || !!actionLoading}>
                    Refresh
                </button>
            </div>
            {applications.length === 0 ? (
                <div className="alert alert-secondary">No pending applications.</div>
            ) : (
                <div className="list-group">
                    {applications.map((app) => (
                        <div key={app.id} className="list-group-item list-group-item-action flex-column align-items-start">
                            <div className="d-flex w-100 justify-content-between">
                                <h6 className="mb-1">ID: {app.id} - {app.type}</h6>
                                <small>{new Date(app.timestamp * 1000).toLocaleString()}</small>
                            </div>
                            <p className="mb-1"><small><strong>Applicant:</strong> {app.applicant}</small></p>
                            <p className="mb-1"><strong>Details:</strong> {app.details}</p>
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
                                    onClick={() => setSelectedApp(app)}
                                    disabled={!!actionLoading}
                                    data-bs-toggle="modal" 
                                    data-bs-target="#rejectionModal"
                                >
                                    Reject
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            )}

            {/* Rejection Modal */}
            <div className="modal fade" id="rejectionModal" tabIndex={-1} aria-labelledby="rejectionModalLabel" aria-hidden="true">
                <div className="modal-dialog">
                    <div className="modal-content">
                        <div className="modal-header">
                            <h5 className="modal-title" id="rejectionModalLabel">Reject Application #{selectedApp?.id}</h5>
                            <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close" onClick={() => setSelectedApp(null)}></button>
                        </div>
                        <div className="modal-body">
                            <div className="mb-3">
                                <label htmlFor="rejectionReason" className="form-label">Reason for Rejection</label>
                                <textarea 
                                    className="form-control" 
                                    id="rejectionReason" 
                                    rows={3}
                                    value={rejectionReason}
                                    onChange={(e) => setRejectionReason(e.target.value)}
                                ></textarea>
                            </div>
                        </div>
                        <div className="modal-footer">
                            <button type="button" className="btn btn-secondary" data-bs-dismiss="modal" onClick={() => setSelectedApp(null)}>Cancel</button>
                            <button 
                                type="button" 
                                className="btn btn-danger" 
                                onClick={handleReject}
                                disabled={!rejectionReason || !!actionLoading}
                            >
                                {actionLoading === selectedApp?.id ? <span className="spinner-border spinner-border-sm"></span> : 'Confirm Rejection'}
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
};

export default ApplicationReviewList;