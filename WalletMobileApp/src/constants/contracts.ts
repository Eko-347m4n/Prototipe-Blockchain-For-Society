export const IDENTITY_CONTRACT_ADDRESS = 'your_identity_contract_address_here';
export const RBAC_CONTRACT_ADDRESS = 'your_rbac_contract_address_here';
export const DUKCAPIL_CONTRACT_ADDRESS = 'your_dukcapil_contract_address_here';

export const IDENTITY_CONTRACT_ABI = [
  {
    "anonymous": false,
    "inputs": [
      {
        "indexed": true,
        "internalType": "address",
        "name": "wallet",
        "type": "address"
      },
      {
        "indexed": true,
        "internalType": "bytes32",
        "name": "identityHash",
        "type": "bytes32"
      }
    ],
    "name": "IdentityRegistered",
    "type": "event"
  },
  {
    "inputs": [
      {
        "internalType": "address",
        "name": "wallet",
        "type": "address"
      }
    ],
    "name": "getIdentity",
    "outputs": [
      {
        "internalType": "bytes32",
        "name": "",
        "type": "bytes32"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "bytes32",
        "name": "identityHash",
        "type": "bytes32"
      }
    ],
    "name": "getWallet",
    "outputs": [
      {
        "internalType": "address",
        "name": "",
        "type": "address"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "address",
        "name": "wallet",
        "type": "address"
      }
    ],
    "name": "isRegistered",
    "outputs": [
      {
        "internalType": "bool",
        "name": "",
        "type": "bool"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "bytes32",
        "name": "identityHash",
        "type": "bytes32"
      }
    ],
    "name": "registerIdentity",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  }
];

export const RBAC_CONTRACT_ABI = [
  "function ADMIN_ROLE() view returns (bytes32)",
  "function DUKCAPIL_ROLE() view returns (bytes32)",
  "function PENDIDIKAN_ROLE() view returns (bytes32)",
  "function SOSIAL_ROLE() view returns (bytes32)",
  "function KESEHATAN_ROLE() view returns (bytes32)",
  "function hasRole(bytes32 role, address account) view returns (bool)",
  "function grantRole(bytes32 role, address account)",
  "function revokeRole(bytes32 role, address account)",
];

export const DUKCAPIL_CONTRACT_ABI = [
    "function updateCitizenData(string memory _nik, string memory _data)",
    "function getCitizenData(string memory _nik) view returns (string memory)",
    "function submitApplication(string memory _applicationType, string memory _applicationDetails)",
    "function approveApplication(string memory _applicationId)",
    "function rejectApplication(string memory _applicationId, string memory _reason)",
    "event ApplicationSubmitted(address indexed applicant, string applicationType, string applicationDetails, uint timestamp)",
    "event ApplicationApproved(string indexed applicationId, address indexed approver, uint timestamp)",
    "event ApplicationRejected(string indexed applicationId, string reason, address indexed rejecter, uint timestamp)",
];
