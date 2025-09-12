import { useState, useEffect, useCallback } from 'react';
import { ethers, BrowserProvider, Contract } from 'ethers';
import LoginPage from './pages/LoginPage';
import DashboardPage from './pages/DashboardPage';

// --- ABIs ---
const rbacAbi = ["function ADMIN_ROLE() view returns (bytes32)","function DUKCAPIL_ROLE() view returns (bytes32)","function PENDIDIKAN_ROLE() view returns (bytes32)","function SOSIAL_ROLE() view returns (bytes32)","function KESEHATAN_ROLE() view returns (bytes32)","function hasRole(bytes32 role, address account) view returns (bool)","function grantRole(bytes32 role, address account)",];
const identityAbi = ["function registerIdentity(bytes32 identityHash)","function getIdentity(address wallet) view returns (bytes32)",];
const dukcapilAbi = ["function updateCitizenData(string memory _nik, string memory _data)","function getCitizenData(string memory _nik) view returns (string memory)","function submitApplication(string memory _applicationType, string memory _applicationDetails)","function approveApplication(string memory _applicationId)","function rejectApplication(string memory _applicationId, string memory _reason)","event ApplicationSubmitted(address indexed applicant, string applicationType, string applicationDetails, uint timestamp)","event ApplicationApproved(string indexed applicationId, address indexed approver, uint timestamp)","event ApplicationRejected(string indexed applicationId, string reason, address indexed rejecter, uint timestamp)",];
const pendidikanAbi = ["function updateAcademicRecord(string memory _studentId, string memory _data)","function getAcademicRecord(string memory _studentId) view returns (string memory)","function submitApplication(string memory _applicationType, string memory _applicationDetails)","function approveApplication(string memory _applicationId)","function rejectApplication(string memory _applicationId, string memory _reason)","event ApplicationSubmitted(address indexed applicant, string applicationType, string applicationDetails, uint timestamp)","event ApplicationApproved(string indexed applicationId, address indexed approver, uint timestamp)","event ApplicationRejected(string indexed applicationId, string reason, address indexed rejecter, uint timestamp)",];
const sosialAbi = ["function recordAidDistribution(string memory _beneficiaryId, string memory _data)","function getAidDistribution(string memory _beneficiaryId) view returns (string memory)","function submitApplication(string memory _applicationType, string memory _applicationDetails)","function approveApplication(string memory _applicationId)","function rejectApplication(string memory _applicationId, string memory _reason)","event ApplicationSubmitted(address indexed applicant, string applicationType, string applicationDetails, uint timestamp)","event ApplicationApproved(string indexed applicationId, address indexed approver, uint timestamp)","event ApplicationRejected(string indexed applicationId, string reason, address indexed rejecter, uint timestamp)",];
const kesehatanAbi = ["function recordBPJSValidation(string memory _bpjsId, string memory _data)","function getBPJSValidation(string memory _bpjsId) view returns (string memory)","function submitApplication(string memory _applicationType, string memory _applicationDetails)","function approveApplication(string memory _applicationId)","function rejectApplication(string memory _applicationId, string memory _reason)","event ApplicationSubmitted(address indexed applicant, string applicationType, string applicationDetails, uint timestamp)","event ApplicationApproved(string indexed applicationId, address indexed approver, uint timestamp)","event ApplicationRejected(string indexed applicationId, string reason, address indexed rejecter, uint timestamp)",];

// --- Contract Addresses & Constants ---
const rbacContractAddress = import.meta.env.VITE_RBAC_CONTRACT_ADDRESS;
const identityContractAddress = import.meta.env.VITE_IDENTITY_CONTRACT_ADDRESS;
const dukcapilContractAddress = import.meta.env.VITE_DUKCAPIL_CONTRACT_ADDRESS;
const pendidikanContractAddress = import.meta.env.VITE_PENDIDIKAN_CONTRACT_ADDRESS;
const sosialContractAddress = import.meta.env.VITE_SOSIAL_CONTRACT_ADDRESS;
const kesehatanContractAddress = import.meta.env.VITE_KESEHATAN_CONTRACT_ADDRESS;
const GOCHAIN_TESTNET_CHAIN_ID = 31337;

// --- Type Definitions ---
declare global {
  interface Window {
    ethereum?: ethers.Eip1193Provider;
  }
}

function App() {
  const [account, setAccount] = useState<string | null>(null);
  const [provider, setProvider] = useState<BrowserProvider | null>(null);
  const [userRoles, setUserRoles] = useState({ isAdmin: false, isDukcapil: false, isPendidikan: false, isSosial: false, isKesehatan: false });
  const [isCorrectNetwork, setIsCorrectNetwork] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState(true);

  // Contract states
  const [rbacContract, setRbacContract] = useState<Contract | null>(null);
  const [identityContract, setIdentityContract] = useState<Contract | null>(null);
  const [dukcapilContract, setDukcapilContract] = useState<Contract | null>(null);
  const [pendidikanContract, setPendidikanContract] = useState<Contract | null>(null);
  const [sosialContract, setSosialContract] = useState<Contract | null>(null);
  const [kesehatanContract, setKesehatanContract] = useState<Contract | null>(null);

  const handleLogout = () => {
    setAccount(null);
    setProvider(null);
    setUserRoles({ isAdmin: false, isDukcapil: false, isPendidikan: false, isSosial: false, isKesehatan: false });
    setRbacContract(null);
    setIdentityContract(null);
    setDukcapilContract(null);
    setPendidikanContract(null);
    setSosialContract(null);
    setKesehatanContract(null);
    setIsCorrectNetwork(false);
  };

  const connectWallet = async () => {
    if (!window.ethereum) return alert('Please install MetaMask!');
    setIsLoading(true);
    try {
      const p = new ethers.BrowserProvider(window.ethereum);
      
      try {
        // This EIP-2255 method prompts the user to select accounts and grant permissions.
        // It's a good way to force the account selection dialog.
        await p.send("wallet_requestPermissions", [{ eth_accounts: {} }]);
      } catch (error) {
        // Some wallets may not support this method, or the user may deny permission.
        // We'll log the error and continue, as eth_requestAccounts will still work as a fallback.
        console.log("wallet_requestPermissions was rejected or is not supported:", error);
      }

      const accs = await p.send("eth_requestAccounts", []);
      if (accs.length > 0) {
        setAccount(accs[0]);
        setProvider(p);
        await initializeContracts(p);
      }
    } catch (e) { 
      console.error("Could not connect wallet", e); 
    } finally {
      setIsLoading(false);
    }
  };

  const checkNetwork = async (p: BrowserProvider) => {
    const network = await p.getNetwork();
    const correct = network.chainId === BigInt(GOCHAIN_TESTNET_CHAIN_ID);
    setIsCorrectNetwork(correct);
    return correct;
  };

  const initializeContracts = useCallback(async (p: BrowserProvider) => {
    if (await checkNetwork(p)) {
      setRbacContract(new ethers.Contract(rbacContractAddress, rbacAbi, p));
      setIdentityContract(new ethers.Contract(identityContractAddress, identityAbi, p));
      setDukcapilContract(new ethers.Contract(dukcapilContractAddress, dukcapilAbi, p));
      setPendidikanContract(new ethers.Contract(pendidikanContractAddress, pendidikanAbi, p));
      setSosialContract(new ethers.Contract(sosialContractAddress, sosialAbi, p));
      setKesehatanContract(new ethers.Contract(kesehatanContractAddress, kesehatanAbi, p));
    }
  }, []);

  useEffect(() => {
    const handleAccountsChanged = (accounts: string[]) => {
      if (accounts.length === 0) {
        handleLogout();
      } else {
        window.location.reload();
      }
    };

    const initialize = async () => {
      if (window.ethereum) {
        const p = new ethers.BrowserProvider(window.ethereum);
        const accs = await p.listAccounts();
        if (accs.length > 0) {
          setAccount(accs[0].address);
          setProvider(p);
          await initializeContracts(p);
        }
      }
      setIsLoading(false);
    };

    initialize();

    window.ethereum?.on('chainChanged', () => window.location.reload());
    window.ethereum?.on('accountsChanged', handleAccountsChanged);

    return () => {
      window.ethereum?.removeListener('chainChanged', () => window.location.reload());
      window.ethereum?.removeListener('accountsChanged', handleAccountsChanged);
    }
  }, [initializeContracts]);

  useEffect(() => {
    const checkUserRoles = async () => {
      if (!account || !rbacContract) return;
      setIsLoading(true);
      try {
        const [adminRole, dukcapilRole, pendidikanRole, sosialRole, kesehatanRole] = await Promise.all([
          rbacContract.ADMIN_ROLE(),
          rbacContract.DUKCAPIL_ROLE(),
          rbacContract.PENDIDIKAN_ROLE(),
          rbacContract.SOSIAL_ROLE(),
          rbacContract.KESEHATAN_ROLE(),
        ]);
        const [isAdmin, isDukcapil, isPendidikan, isSosial, isKesehatan] = await Promise.all([
          rbacContract.hasRole(adminRole, account),
          rbacContract.hasRole(dukcapilRole, account),
          rbacContract.hasRole(pendidikanRole, account),
          rbacContract.hasRole(sosialRole, account),
          rbacContract.hasRole(kesehatanRole, account),
        ]);
        setUserRoles({ isAdmin, isDukcapil, isPendidikan, isSosial, isKesehatan });
      } catch (e) { 
        console.error("Could not check user roles", e); 
      } finally {
        setIsLoading(false);
      }
    };
    checkUserRoles();
  }, [account, rbacContract]);

  return (
    <>
      <nav className="navbar navbar-expand-lg navbar-dark bg-dark">
        <div className="container">
          <a className="navbar-brand" href="#">Prototipe Web3 Kabupaten</a>
          {account && (
            <div className="d-flex align-items-center">
              <span className="navbar-text me-3">
                Connected: {`${account.substring(0, 6)}...${account.substring(account.length - 4)}`}
              </span>
              <button className="btn btn-outline-light" onClick={handleLogout}>Disconnect</button>
            </div>
          )}
        </div>
      </nav>
      <main className="container mt-4">
        {!account ? (
          <LoginPage connectWallet={connectWallet} isLoading={isLoading} />
        ) : !isCorrectNetwork ? (
          <div className="alert alert-danger"><strong>Wrong Network!</strong> Please connect to the GoChain Testnet network (Chain ID: {GOCHAIN_TESTNET_CHAIN_ID}).</div>
        ) : isLoading ? (
          <p>Loading user data...</p>
        ) : (
          <DashboardPage 
            provider={provider!}
            account={account}
            userRoles={userRoles}
            rbacContract={rbacContract!}
            identityContract={identityContract!}
            dukcapilContract={dukcapilContract!}
            pendidikanContract={pendidikanContract!}
            sosialContract={sosialContract!}
            kesehatanContract={kesehatanContract!}
          />
        )}
      </main>
    </>
  );
}

export default App;
