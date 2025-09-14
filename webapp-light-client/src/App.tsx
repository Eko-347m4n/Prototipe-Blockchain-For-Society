import { useState, useEffect, useCallback } from 'react';
import { ethers, BrowserProvider, Contract } from 'ethers';
import LoginPage from './pages/LoginPage';
import DashboardPage from './pages/DashboardPage';

// --- ABIs ---
const rbacAbi = [{"inputs":[],"stateMutability":"nonpayable","type":"constructor"},{"inputs":[],"name":"AccessControlBadConfirmation","type":"error"},{"inputs":[{"internalType":"address","name":"account","type":"address"},{"internalType":"bytes32","name":"neededRole","type":"bytes32"}],"name":"AccessControlUnauthorizedAccount","type":"error"},{"anonymous":false,"inputs":[{"indexed":true,"internalType":"bytes32","name":"role","type":"bytes32"},{"indexed":true,"internalType":"bytes32","name":"previousAdminRole","type":"bytes32"},{"indexed":true,"internalType":"bytes32","name":"newAdminRole","type":"bytes32"}],"name":"RoleAdminChanged","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"internalType":"bytes32","name":"role","type":"bytes32"},{"indexed":true,"internalType":"address","name":"account","type":"address"},{"indexed":true,"internalType":"address","name":"sender","type":"address"}],"name":"RoleGranted","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"internalType":"bytes32","name":"role","type":"bytes32"},{"indexed":true,"internalType":"address","name":"account","type":"address"},{"indexed":true,"internalType":"address","name":"sender","type":"address"}],"name":"RoleRevoked","type":"event"},{"inputs":[],"name":"ADMIN_ROLE","outputs":[{"internalType":"bytes32","name":"","type":"bytes32"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"DEFAULT_ADMIN_ROLE","outputs":[{"internalType":"bytes32","name":"","type":"bytes32"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"DUKCAPIL_ROLE","outputs":[{"internalType":"bytes32","name":"","type":"bytes32"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"KESEHATAN_ROLE","outputs":[{"internalType":"bytes32","name":"","type":"bytes32"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"PENDIDIKAN_ROLE","outputs":[{"internalType":"bytes32","name":"","type":"bytes32"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"SOSIAL_ROLE","outputs":[{"internalType":"bytes32","name":"","type":"bytes32"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"bytes32","name":"role","type":"bytes32"}],"name":"getRoleAdmin","outputs":[{"internalType":"bytes32","name":"","type":"bytes32"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"bytes32","name":"role","type":"bytes32"},{"internalType":"address","name":"account","type":"address"}],"name":"grantRole","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"bytes32","name":"role","type":"bytes32"},{"internalType":"address","name":"account","type":"address"}],"name":"hasRole","outputs":[{"internalType":"bool","name":"","type":"bool"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"bytes32","name":"role","type":"bytes32"},{"internalType":"address","name":"callerConfirmation","type":"address"}],"name":"renounceRole","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"bytes32","name":"role","type":"bytes32"},{"internalType":"address","name":"account","type":"address"}],"name":"revokeRole","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"bytes4","name":"interfaceId","type":"bytes4"}],"name":"supportsInterface","outputs":[{"internalType":"bool","name":"","type":"bool"}],"stateMutability":"view","type":"function"}];
const identityAbi = [{"anonymous":false,"inputs":[{"indexed":true,"internalType":"address","name":"wallet","type":"address"},{"indexed":true,"internalType":"bytes32","name":"identityHash","type":"bytes32"}],"name":"IdentityRegistered","type":"event"},{"inputs":[{"internalType":"address","name":"wallet","type":"address"}],"name":"getIdentity","outputs":[{"internalType":"bytes32","name":"","type":"bytes32"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"bytes32","name":"identityHash","type":"bytes32"}],"name":"getWallet","outputs":[{"internalType":"address","name":"","type":"address"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"address","name":"wallet","type":"address"}],"name":"isRegistered","outputs":[{"internalType":"bool","name":"","type":"bool"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"bytes32","name":"identityHash","type":"bytes32"}],"name":"registerIdentity","outputs":[],"stateMutability":"nonpayable","type":"function"}];
const dukcapilAbi = [{"inputs":[{"internalType":"address","name":"rbacAddress","type":"address"},{"internalType":"address","name":"identityAddress","type":"address"}],"stateMutability":"nonpayable","type":"constructor"},{"anonymous":false,"inputs":[{"indexed":true,"internalType":"string","name":"applicationId","type":"string"},{"indexed":true,"internalType":"address","name":"approver","type":"address"},{"indexed":false,"internalType":"uint256","name":"timestamp","type":"uint256"}],"name":"ApplicationApproved","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"internalType":"string","name":"applicationId","type":"string"},{"indexed":false,"internalType":"string","name":"reason","type":"string"},{"indexed":true,"internalType":"address","name":"rejecter","type":"address"},{"indexed":false,"internalType":"uint256","name":"timestamp","type":"uint256"}],"name":"ApplicationRejected","type":"event"},{"anonymous":false,"inputs":[{"indexed":false,"internalType":"string","name":"applicationId","type":"string"},{"indexed":true,"internalType":"address","name":"applicant","type":"address"},{"indexed":false,"internalType":"string","name":"applicationType","type":"string"},{"indexed":false,"internalType":"uint256","name":"timestamp","type":"uint256"}],"name":"ApplicationSubmitted","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"internalType":"string","name":"nik","type":"string"},{"indexed":true,"internalType":"address","name":"officer","type":"address"},{"indexed":false,"internalType":"uint256","name":"timestamp","type":"uint256"}],"name":"CitizenDataUpdated","type":"event"},{"inputs":[],"name":"DUKCAPIL_ROLE","outputs":[{"internalType":"bytes32","name":"","type":"bytes32"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"string","name":"","type":"string"}],"name":"applications","outputs":[{"internalType":"address","name":"applicant","type":"address"},{"internalType":"string","name":"applicationType","type":"string"},{"internalType":"string","name":"applicationDetails","type":"string"},{"internalType":"uint256","name":"timestamp","type":"uint256"},{"internalType":"enum LayananDukcapil.Status","name":"status","type":"uint8"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"string","name":"_applicationId","type":"string"}],"name":"approveApplication","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"string","name":"","type":"string"}],"name":"citizenData","outputs":[{"internalType":"string","name":"nik","type":"string"},{"internalType":"string","name":"name","type":"string"},{"internalType":"string","name":"dob","type":"string"},{"internalType":"string","name":"addr","type":"string"},{"internalType":"string","name":"maritalStatus","type":"string"},{"internalType":"string","name":"economicStatus","type":"string"},{"internalType":"bool","name":"active","type":"bool"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"string","name":"_nik","type":"string"}],"name":"getCitizenData","outputs":[{"components":[{"internalType":"string","name":"nik","type":"string"},{"internalType":"string","name":"name","type":"string"},{"internalType":"string","name":"dob","type":"string"},{"internalType":"string","name":"addr","type":"string"},{"internalType":"string","name":"maritalStatus","type":"string"},{"internalType":"string","name":"economicStatus","type":"string"},{"internalType":"bool","name":"active","type":"bool"}],"internalType":"struct LayananDukcapil.Citizen","name":"","type":"tuple"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"string","name":"_nik","type":"string"}],"name":"isNikRegistered","outputs":[{"internalType":"bool","name":"","type":"bool"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"string","name":"_applicationId","type":"string"},{"internalType":"string","name":"_reason","type":"string"}],"name":"rejectApplication","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"string","name":"_applicationType","type":"string"},{"internalType":"string","name":"_applicationDetails","type":"string"}],"name":"submitApplication","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"string","name":"_nik","type":"string"},{"internalType":"string","name":"_name","type":"string"},{"internalType":"string","name":"_dob","type":"string"},{"internalType":"string","name":"_address","type":"string"},{"internalType":"string","name":"_maritalStatus","type":"string"},{"internalType":"string","name":"_economicStatus","type":"string"}],"name":"updateCitizenData","outputs":[],"stateMutability":"nonpayable","type":"function"}];
const pendidikanAbi = [{"inputs":[{"internalType":"address","name":"rbacAddress","type":"address"},{"internalType":"address","name":"identityAddress","type":"address"}],"stateMutability":"nonpayable","type":"constructor"},{"anonymous":false,"inputs":[{"indexed":true,"internalType":"string","name":"studentId","type":"string"},{"indexed":true,"internalType":"address","name":"officer","type":"address"},{"indexed":false,"internalType":"uint256","name":"timestamp","type":"uint256"}],"name":"AcademicRecordUpdated","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"internalType":"string","name":"applicationId","type":"string"},{"indexed":true,"internalType":"address","name":"approver","type":"address"},{"indexed":false,"internalType":"uint256","name":"timestamp","type":"uint256"}],"name":"ApplicationApproved","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"internalType":"string","name":"applicationId","type":"string"},{"indexed":false,"internalType":"string","name":"reason","type":"string"},{"indexed":true,"internalType":"address","name":"rejecter","type":"address"},{"indexed":false,"internalType":"uint256","name":"timestamp","type":"uint256"}],"name":"ApplicationRejected","type":"event"},{"anonymous":false,"inputs":[{"indexed":false,"internalType":"string","name":"applicationId","type":"string"},{"indexed":true,"internalType":"address","name":"applicant","type":"address"},{"indexed":false,"internalType":"string","name":"applicationType","type":"string"},{"indexed":false,"internalType":"uint256","name":"timestamp","type":"uint256"}],"name":"ApplicationSubmitted","type":"event"},{"inputs":[],"name":"PENDIDIKAN_ROLE","outputs":[{"internalType":"bytes32","name":"","type":"bytes32"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"string","name":"","type":"string"}],"name":"applications","outputs":[{"internalType":"address","name":"applicant","type":"address"},{"internalType":"string","name":"applicationType","type":"string"},{"internalType":"string","name":"applicationDetails","type":"string"},{"internalType":"uint256","name":"timestamp","type":"uint256"},{"internalType":"enum LayananPendidikan.Status","name":"status","type":"uint8"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"string","name":"_applicationId","type":"string"}],"name":"approveApplication","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"string","name":"_studentId","type":"string"}],"name":"getAcademicRecord","outputs":[{"components":[{"internalType":"string","name":"studentId","type":"string"},{"internalType":"string","name":"nik","type":"string"},{"internalType":"string","name":"school","type":"string"},{"internalType":"string","name":"grade","type":"string"},{"internalType":"bool","name":"isScholarshipRecipient","type":"bool"}],"internalType":"struct LayananPendidikan.StudentRecord","name":"","type":"tuple"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"string","name":"_applicationId","type":"string"},{"internalType":"string","name":"_reason","type":"string"}],"name":"rejectApplication","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"string","name":"_applicationType","type":"string"},{"internalType":"string","name":"_applicationDetails","type":"string"}],"name":"submitApplication","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"string","name":"_studentId","type":"string"},{"internalType":"string","name":"_nik","type":"string"},{"internalType":"string","name":"_school","type":"string"},{"internalType":"string","name":"_grade","type":"string"}],"name":"updateAcademicRecord","outputs":[],"stateMutability":"nonpayable","type":"function"}];
const sosialAbi = [{"inputs":[{"internalType":"address","name":"rbacAddress","type":"address"},{"internalType":"address","name":"identityAddress","type":"address"},{"internalType":"address","name":"dukcapilAddress","type":"address"}],"stateMutability":"nonpayable","type":"constructor"},{"anonymous":false,"inputs":[{"indexed":true,"internalType":"string","name":"beneficiaryId","type":"string"},{"indexed":true,"internalType":"address","name":"officer","type":"address"},{"indexed":false,"internalType":"uint256","name":"timestamp","type":"uint256"}],"name":"AidRecorded","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"internalType":"string","name":"applicationId","type":"string"},{"indexed":true,"internalType":"address","name":"approver","type":"address"},{"indexed":false,"internalType":"uint256","name":"timestamp","type":"uint256"}],"name":"ApplicationApproved","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"internalType":"string","name":"applicationId","type":"string"},{"indexed":false,"internalType":"string","name":"reason","type":"string"},{"indexed":true,"internalType":"address","name":"rejecter","type":"address"},{"indexed":false,"internalType":"uint256","name":"timestamp","type":"uint256"}],"name":"ApplicationRejected","type":"event"},{"anonymous":false,"inputs":[{"indexed":false,"internalType":"string","name":"applicationId","type":"string"},{"indexed":true,"internalType":"address","name":"applicant","type":"address"},{"indexed":false,"internalType":"string","name":"applicationType","type":"string"},{"indexed":false,"internalType":"uint256","name":"timestamp","type":"uint256"}],"name":"ApplicationSubmitted","type":"event"},{"inputs":[],"name":"SOSIAL_ROLE","outputs":[{"internalType":"bytes32","name":"","type":"bytes32"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"string","name":"","type":"string"}],"name":"applications","outputs":[{"internalType":"address","name":"applicant","type":"address"},{"internalType":"string","name":"applicationType","type":"string"},{"internalType":"string","name":"applicationDetails","type":"string"},{"internalType":"uint256","name":"timestamp","type":"uint256"},{"internalType":"enum LayananSosial.Status","name":"status","type":"uint8"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"string","name":"_applicationId","type":"string"}],"name":"approveApplication","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"string","name":"_beneficiaryId","type":"string"}],"name":"getAidRecord","outputs":[{"components":[{"internalType":"string","name":"beneficiaryId","type":"string"},{"internalType":"string","name":"aidType","type":"string"},{"internalType":"string","name":"status","type":"string"},{"internalType":"uint256","name":"amount","type":"uint256"}],"internalType":"struct LayananSosial.AidRecord","name":"","type":"tuple"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"string","name":"_beneficiaryId","type":"string"},{"internalType":"string","name":"_aidType","type":"string"},{"internalType":"string","name":"_status","type":"string"},{"internalType":"uint256","name":"_amount","type":"uint256"}],"name":"recordAidDistribution","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"string","name":"_applicationId","type":"string"},{"internalType":"string","name":"_reason","type":"string"}],"name":"rejectApplication","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"string","name":"_applicationType","type":"string"},{"internalType":"string","name":"_applicationDetails","type":"string"}],"name":"submitApplication","outputs":[],"stateMutability":"nonpayable","type":"function"}];
const kesehatanAbi = [{"inputs":[{"internalType":"address","name":"rbacAddress","type":"address"},{"internalType":"address","name":"identityAddress","type":"address"}],"stateMutability":"nonpayable","type":"constructor"},{"anonymous":false,"inputs":[{"indexed":true,"internalType":"string","name":"applicationId","type":"string"},{"indexed":true,"internalType":"address","name":"approver","type":"address"},{"indexed":false,"internalType":"uint256","name":"timestamp","type":"uint256"}],"name":"ApplicationApproved","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"internalType":"string","name":"applicationId","type":"string"},{"indexed":false,"internalType":"string","name":"reason","type":"string"},{"indexed":true,"internalType":"address","name":"rejecter","type":"address"},{"indexed":false,"internalType":"uint256","name":"timestamp","type":"uint256"}],"name":"ApplicationRejected","type":"event"},{"anonymous":false,"inputs":[{"indexed":false,"internalType":"string","name":"applicationId","type":"string"},{"indexed":true,"internalType":"address","name":"applicant","type":"address"},{"indexed":false,"internalType":"string","name":"applicationType","type":"string"},{"indexed":false,"internalType":"uint256","name":"timestamp","type":"uint256"}],"name":"ApplicationSubmitted","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"internalType":"string","name":"bpjsId","type":"string"},{"indexed":true,"internalType":"address","name":"officer","type":"address"},{"indexed":false,"internalType":"uint256","name":"timestamp","type":"uint256"}],"name":"BPJSValidated","type":"event"},{"inputs":[],"name":"KESEHATAN_ROLE","outputs":[{"internalType":"bytes32","name":"","type":"bytes32"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"string","name":"","type":"string"}],"name":"applications","outputs":[{"internalType":"address","name":"applicant","type":"address"},{"internalType":"string","name":"applicationType","type":"string"},{"internalType":"string","name":"applicationDetails","type":"string"},{"internalType":"uint256","name":"timestamp","type":"uint256"},{"internalType":"enum LayananKesehatan.Status","name":"status","type":"uint8"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"string","name":"_applicationId","type":"string"}],"name":"approveApplication","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"string","name":"_bpjsId","type":"string"}],"name":"getBPJSData","outputs":[{"components":[{"internalType":"string","name":"bpjsId","type":"string"},{"internalType":"string","name":"nik","type":"string"},{"internalType":"bool","name":"isValid","type":"bool"},{"internalType":"string","name":"facility","type":"string"}],"internalType":"struct LayananKesehatan.BpjsRecord","name":"","type":"tuple"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"string","name":"_bpjsId","type":"string"},{"internalType":"string","name":"_nik","type":"string"},{"internalType":"bool","name":"_isValid","type":"bool"},{"internalType":"string","name":"_facility","type":"string"}],"name":"recordBPJSValidation","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"string","name":"_applicationId","type":"string"},{"internalType":"string","name":"_reason","type":"string"}],"name":"rejectApplication","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"string","name":"_applicationType","type":"string"},{"internalType":"string","name":"_applicationDetails","type":"string"}],"name":"submitApplication","outputs":[],"stateMutability":"nonpayable","type":"function"}];

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
      
      // Explicitly request permissions to encourage the wallet selection prompt
      await p.send("wallet_requestPermissions", [{ eth_accounts: {} }]);

      // Then, request the accounts
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
      <nav className="navbar navbar-expand-lg navbar-light bg-white border-bottom">
        <div className="container">
          <a className="navbar-brand" href="#">Prototipe Web3 Kabupaten</a>
          {account && (
            <div className="d-flex align-items-center">
              <span className="navbar-text me-3">
                Terhubung: {`${account.substring(0, 6)}...${account.substring(account.length - 4)}`}
              </span>
              <button className="btn btn-outline-secondary btn-sm" onClick={handleLogout}>Putuskan Koneksi</button>
            </div>
          )}
        </div>
      </nav>
      <main className="container mt-4">
        {!account ? (
          <LoginPage connectWallet={connectWallet} isLoading={isLoading} />
        ) : !isCorrectNetwork ? (
          <div className="alert alert-danger"><strong>Wrong Network!</strong> Please connect to the Hardhat network (Chain ID: {GOCHAIN_TESTNET_CHAIN_ID}).</div>
        ) : isLoading ? (
          <p>Memuat data pengguna...</p>
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