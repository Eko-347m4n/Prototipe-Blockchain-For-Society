import { useState, useEffect, useCallback } from 'react';
import { ethers, Contract } from 'ethers';
import { useWeb3ModalProvider, useWeb3ModalAccount } from '@web3modal/ethers/react';
import DashboardPage from './pages/DashboardPage';
import LoginPage from './pages/LoginPage';

// Import constants
import { rbacAbi, identityAbi, dukcapilAbi, pendidikanAbi, sosialAbi, kesehatanAbi } from './constants/abis';
import { 
  rbacContractAddress, 
  identityContractAddress, 
  dukcapilContractAddress, 
  pendidikanContractAddress, 
  sosialContractAddress, 
  kesehatanContractAddress, 
  SEPOLIA_CHAIN_ID 
} from './constants/addresses';

// Initialize Web3Modal
import './blockchain';

function App() {
  // Web3Modal hooks
  const { address, chainId, isConnected } = useWeb3ModalAccount();
  const { walletProvider } = useWeb3ModalProvider();

  // App state
  const [userRoles, setUserRoles] = useState({ isAdmin: false, isDukcapil: false, isPendidikan: false, isSosial: false, isKesehatan: false });
  const [isLoading, setIsLoading] = useState(false);
  const [provider, setProvider] = useState<ethers.BrowserProvider | null>(null);

  // Contract states
  const [rbacContract, setRbacContract] = useState<Contract | null>(null);
  const [identityContract, setIdentityContract] = useState<Contract | null>(null);
  const [dukcapilContract, setDukcapilContract] = useState<Contract | null>(null);
  const [pendidikanContract, setPendidikanContract] = useState<Contract | null>(null);
  const [sosialContract, setSosialContract] = useState<Contract | null>(null);
  const [kesehatanContract, setKesehatanContract] = useState<Contract | null>(null);

  const isCorrectNetwork = chainId === SEPOLIA_CHAIN_ID;

  const initializeContracts = useCallback(async (p: ethers.BrowserProvider) => {
    setRbacContract(new ethers.Contract(rbacContractAddress, rbacAbi, p));
    setIdentityContract(new ethers.Contract(identityContractAddress, identityAbi, p));
    setDukcapilContract(new ethers.Contract(dukcapilContractAddress, dukcapilAbi, p));
    setPendidikanContract(new ethers.Contract(pendidikanContractAddress, pendidikanAbi, p));
    setSosialContract(new ethers.Contract(sosialContractAddress, sosialAbi, p));
    setKesehatanContract(new ethers.Contract(kesehatanContractAddress, kesehatanAbi, p));
  }, []);

  useEffect(() => {
    const setup = async () => {
      if (isConnected && walletProvider && isCorrectNetwork) {
        const ethersProvider = new ethers.BrowserProvider(walletProvider);
        setProvider(ethersProvider);
        await initializeContracts(ethersProvider);
      } else {
        setProvider(null);
      }
    };
    setup();
  }, [isConnected, walletProvider, chainId, isCorrectNetwork, initializeContracts]);

  useEffect(() => {
    const checkUserRoles = async () => {
      if (!address || !rbacContract) return;
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
          rbacContract.hasRole(adminRole, address),
          rbacContract.hasRole(dukcapilRole, address),
          rbacContract.hasRole(pendidikanRole, address),
          rbacContract.hasRole(sosialRole, address),
          rbacContract.hasRole(kesehatanRole, address),
        ]);
        setUserRoles({ isAdmin, isDukcapil, isPendidikan, isSosial, isKesehatan });
      } catch (e) { 
        console.error("Could not check user roles", e); 
      } finally {
        setIsLoading(false);
      }
    };
    checkUserRoles();
  }, [address, rbacContract]);

  function renderContent() {
    if (!isConnected) {
      return <LoginPage />;
    }
    if (!isCorrectNetwork) {
      return <div className="alert alert-danger"><strong>Wrong Network!</strong> Please connect to the Sepolia network (Chain ID: {SEPOLIA_CHAIN_ID}).</div>;
    }
    if (isLoading || !provider) {
      return <p>Loading user data...</p>;
    }
    return (
      <DashboardPage 
        provider={provider!}
        account={address!}
        userRoles={userRoles}
        rbacContract={rbacContract!}
        identityContract={identityContract!}
        dukcapilContract={dukcapilContract!}
        pendidikanContract={pendidikanContract!}
        sosialContract={sosialContract!}
        kesehatanContract={kesehatanContract!}
      />
    );
  }

  return (
    <>
      <nav className="navbar navbar-expand-lg navbar-light bg-white border-bottom">
        <div className="container d-flex justify-content-between">
          <a className="navbar-brand" href="#">Prototipe Web3 Kabupaten</a>
          <w3m-button />
        </div>
      </nav>
      <main className="container mt-4">
        {renderContent()}
      </main>
    </>
  );
}

export default App;
