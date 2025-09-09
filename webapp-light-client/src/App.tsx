import { useState, useEffect } from 'react';
import { ethers, BrowserProvider, Contract } from 'ethers';

// --- Contract ABIs and Addresses ---
const rbacAbi = [
  "function ADMIN_ROLE() view returns (bytes32)",
  "function DUKCAPIL_ROLE() view returns (bytes32)",
  "function hasRole(bytes32 role, address account) view returns (bool)",
  "function grantRole(bytes32 role, address account)",
];
const identityAbi = [
    "function registerIdentity(bytes32 identityHash)",
    "function getIdentity(address wallet) view returns (bytes32)",
];
const dukcapilAbi = [
    "function catatDataBaru(string memory data)",
    "function lastUpdatedData() view returns (string)",
];

const rbacContractAddress = import.meta.env.VITE_RBAC_CONTRACT_ADDRESS;
const identityContractAddress = import.meta.env.VITE_IDENTITY_CONTRACT_ADDRESS;
const dukcapilContractAddress = import.meta.env.VITE_DUKCAPIL_CONTRACT_ADDRESS;
const HARDHAT_CHAIN_ID = 31337;

// --- Type Definitions ---
declare global {
  interface Window {
    ethereum?: ethers.Eip1193Provider;
  }
}

interface PanelProps {
  provider: BrowserProvider;
  userAddress: string;
  rbacContract?: Contract;
  identityContract?: Contract;
  dukcapilContract?: Contract;
}

// --- Panel Components ---
const AdminPanel = ({ provider, rbacContract }: Pick<PanelProps, 'provider' | 'rbacContract'>) => {
  const [address, setAddress] = useState('');
  const [role, setRole] = useState('');
  const [status, setStatus] = useState('');

  const handleGrantRole = async () => {
    if (!address || !role || !rbacContract) return;
    setStatus('Sending transaction...');
    try {
      const signer = await provider.getSigner();
      const rbacWithSigner = rbacContract.connect(signer);
      const tx = await rbacWithSigner.grantRole(role, address);
      await tx.wait();
      setStatus(`Role granted successfully!`);
    } catch (e) { setStatus(`Error: ${(e as Error).message}`); }
  };

  useEffect(() => {
    const getRole = async () => rbacContract && setRole(await rbacContract.DUKCAPIL_ROLE());
    getRole();
  }, [rbacContract]);

  return (
    <div style={{ border: '1px solid blue', padding: '10px', marginTop: '20px' }}>
      <h3>Admin Panel</h3>
      <div><label>Address: </label><input type="text" value={address} onChange={(e) => setAddress(e.target.value)} style={{ width: '400px' }} /></div>
      <div style={{ marginTop: '10px' }}><label>Role: </label><input type="text" value={role} readOnly style={{ width: '400px' }} /></div>
      <button onClick={handleGrantRole} style={{ marginTop: '10px' }}>Grant Role</button>
      {status && <p>{status}</p>}
    </div>
  );
};

const IdentityPanel = ({ provider, identityContract, userAddress }: Pick<PanelProps, 'provider' | 'identityContract' | 'userAddress'>) => {
    const [nik, setNik] = useState('');
    const [status, setStatus] = useState('');
    const [registeredHash, setRegisteredHash] = useState<string | null>(null);

    useEffect(() => {
        const check = async () => {
            if (!identityContract || !userAddress) return;
            const hash = await identityContract.getIdentity(userAddress);
            if (hash !== ethers.ZeroHash) setRegisteredHash(hash);
        };
        check();
    }, [identityContract, userAddress]);

    const handleRegister = async () => {
        if (!nik || !identityContract) return;
        setStatus('Sending transaction...');
        try {
            const nikHash = ethers.keccak256(ethers.toUtf8Bytes(nik));
            const signer = await provider.getSigner();
            const contractWithSigner = identityContract.connect(signer);
            const tx = await contractWithSigner.registerIdentity(nikHash);
            await tx.wait();
            setStatus(`Identity registered successfully!`);
            setRegisteredHash(nikHash);
        } catch (e) { setStatus(`Error: ${(e as Error).message}`); }
    };

    if (registeredHash) return <p>Your identity hash: {registeredHash}</p>;

    return (
        <div style={{ border: '1px solid orange', padding: '10px', marginTop: '20px' }}>
            <h3>Register Your Identity</h3>
            <div><label>NIK: </label><input type="text" value={nik} onChange={(e) => setNik(e.target.value)} /></div>
            <button onClick={handleRegister} style={{ marginTop: '10px' }}>Register Identity</button>
            {status && <p>{status}</p>}
        </div>
    );
};

const DukcapilPanel = ({ provider, dukcapilContract }: Pick<PanelProps, 'provider' | 'dukcapilContract'>) => {
    const [data, setData] = useState('');
    const [status, setStatus] = useState('');
    const [lastData, setLastData] = useState('');

    useEffect(() => {
        const getLastData = async () => dukcapilContract && setLastData(await dukcapilContract.lastUpdatedData());
        getLastData();
    }, [dukcapilContract]);

    const handleCatatData = async () => {
        if (!data || !dukcapilContract) return;
        setStatus('Sending transaction...');
        try {
            const signer = await provider.getSigner();
            const contractWithSigner = dukcapilContract.connect(signer);
            const tx = await contractWithSigner.catatDataBaru(data);
            await tx.wait();
            setStatus(`Data recorded successfully!`);
            setLastData(data);
        } catch (e) { setStatus(`Error: ${(e as Error).message}`); }
    };

    return (
        <div style={{ border: '1px solid purple', padding: '10px', marginTop: '20px' }}>
            <h3>Dukcapil Officer Panel</h3>
            <p>Last recorded data: <strong>{lastData || "N/A"}</strong></p>
            <div><label>New Data: </label><input type="text" value={data} onChange={(e) => setData(e.target.value)} /></div>
            <button onClick={handleCatatData} style={{ marginTop: '10px' }}>Record New Data</button>
            {status && <p>{status}</p>}
        </div>
    );
};

// --- Main App Component ---
function App() {
  const [account, setAccount] = useState<string | null>(null);
  const [provider, setProvider] = useState<BrowserProvider | null>(null);
  const [rbacContract, setRbacContract] = useState<Contract | null>(null);
  const [identityContract, setIdentityContract] = useState<Contract | null>(null);
  const [dukcapilContract, setDukcapilContract] = useState<Contract | null>(null);
  const [userRoles, setUserRoles] = useState({ isAdmin: false, isDukcapil: false });
  const [isCorrectNetwork, setIsCorrectNetwork] = useState<boolean>(false);

  const connectWallet = async () => {
    if (!window.ethereum) return alert('Please install MetaMask!');
    try {
      const p = new ethers.BrowserProvider(window.ethereum);
      const accs = await p.send("eth_requestAccounts", []);
      setAccount(accs[0]);
      setProvider(p);
      checkNetwork(p);
    } catch (e) { console.error("Could not connect wallet", e); }
  };

  const checkNetwork = async (p: BrowserProvider) => {
    const network = await p.getNetwork();
    const correct = network.chainId === BigInt(HARDHAT_CHAIN_ID);
    setIsCorrectNetwork(correct);
    return correct;
  };

  useEffect(() => {
    const initialize = async () => {
      if (!window.ethereum) return;
      const p = new ethers.BrowserProvider(window.ethereum);
      setProvider(p);
      const accs = await p.listAccounts();
      if (accs.length > 0) setAccount(accs[0].address);

      if (await checkNetwork(p)) {
        setRbacContract(new ethers.Contract(rbacContractAddress, rbacAbi, p));
        setIdentityContract(new ethers.Contract(identityContractAddress, identityAbi, p));
        setDukcapilContract(new ethers.Contract(dukcapilContractAddress, dukcapilAbi, p));
      }
    };
    initialize();
    window.ethereum.on('chainChanged', () => window.location.reload());
    window.ethereum.on('accountsChanged', () => window.location.reload());
  }, []);

  useEffect(() => {
    const checkUserRoles = async () => {
      if (!account || !rbacContract) return;
      try {
        const adminRole = await rbacContract.ADMIN_ROLE();
        const dukcapilRole = await rbacContract.DUKCAPIL_ROLE();
        const isAdmin = await rbacContract.hasRole(adminRole, account);
        const isDukcapil = await rbacContract.hasRole(dukcapilRole, account);
        setUserRoles({ isAdmin, isDukcapil });
      } catch (e) { console.error("Could not check user roles", e); }
    };
    checkUserRoles();
  }, [account, rbacContract]);

  const renderUserPanel = () => {
    if (!provider) return null;
    if (userRoles.isAdmin) return <AdminPanel provider={provider} rbacContract={rbacContract!} />;
    if (userRoles.isDukcapil) return <DukcapilPanel provider={provider} dukcapilContract={dukcapilContract!} />;
    return <IdentityPanel provider={provider} identityContract={identityContract!} userAddress={account!} />;
  }

  return (
    <div style={{ padding: '20px', fontFamily: 'sans-serif' }}>
      <header style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <h1>Prototipe Web3 Kabupaten</h1>
        {account ? <p>Connected: {`${account.substring(0, 6)}...`}</p> : <button onClick={connectWallet}>Connect Wallet</button>}
      </header>
      <hr />
      <main>
        {!isCorrectNetwork ? (
          <div style={{color: 'red'}}><p><strong>Wrong Network!</strong> Please connect to Hardhat (Chain ID: {HARDHAT_CHAIN_ID}).</p></div>
        ) : (
          <div>{account ? renderUserPanel() : <p>Please connect your wallet to continue.</p>}</div>
        )}
      </main>
    </div>
  );
}

export default App;
