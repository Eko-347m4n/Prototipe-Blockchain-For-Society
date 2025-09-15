import { PROVIDER_URL as ENV_PROVIDER_URL } from '@env';

export const PROVIDER_URL = ENV_PROVIDER_URL;

// Deployed contract addresses on Sepolia
export const RBAC_CONTRACT_ADDRESS = '0x2352975Bf6699b4d11A188f9052f21cB477C502C';
export const IDENTITY_CONTRACT_ADDRESS = '0xfc6C10F6df4e6015b78c3E5BaFF643270829717b';
export const DUKCAPIL_CONTRACT_ADDRESS = '0x9ce5889688FeA7209D58c123D74D2c3b4CeF5073';
export const PENDIDIKAN_CONTRACT_ADDRESS = '0x5BAE7A1cD8891dfB2756Bad2b7ebdF88320a22A9';
export const SOSIAL_CONTRACT_ADDRESS = '0xE678692372693aB6F54BD7B7ca357393e346B738';
export const KESEHATAN_CONTRACT_ADDRESS = '0x33b7A623F4f1ad40016b3b2751533f510f6447E2';

// Contract ABIs
export const RBAC_ABI = [
    {
      "inputs": [],
      "stateMutability": "nonpayable",
      "type": "constructor"
    },
    {
      "inputs": [],
      "name": "AccessControlBadConfirmation",
      "type": "error"
    },
    {
      "inputs": [
        {
          "internalType": "address",
          "name": "account",
          "type": "address"
        },
        {
          "internalType": "bytes32",
          "name": "neededRole",
          "type": "bytes32"
        }
      ],
      "name": "AccessControlUnauthorizedAccount",
      "type": "error"
    },
    {
      "anonymous": false,
      "inputs": [
        {
          "indexed": true,
          "internalType": "bytes32",
          "name": "role",
          "type": "bytes32"
        },
        {
          "indexed": true,
          "internalType": "bytes32",
          "name": "previousAdminRole",
          "type": "bytes32"
        },
        {
          "indexed": true,
          "internalType": "bytes32",
          "name": "newAdminRole",
          "type": "bytes32"
        }
      ],
      "name": "RoleAdminChanged",
      "type": "event"
    },
    {
      "anonymous": false,
      "inputs": [
        {
          "indexed": true,
          "internalType": "bytes32",
          "name": "role",
          "type": "bytes32"
        },
        {
          "indexed": true,
          "internalType": "address",
          "name": "account",
          "type": "address"
        },
        {
          "indexed": true,
          "internalType": "address",
          "name": "sender",
          "type": "address"
        }
      ],
      "name": "RoleGranted",
      "type": "event"
    },
    {
      "anonymous": false,
      "inputs": [
        {
          "indexed": true,
          "internalType": "bytes32",
          "name": "role",
          "type": "bytes32"
        },
        {
          "indexed": true,
          "internalType": "address",
          "name": "account",
          "type": "address"
        },
        {
          "indexed": true,
          "internalType": "address",
          "name": "sender",
          "type": "address"
        }
      ],
      "name": "RoleRevoked",
      "type": "event"
    },
    {
      "inputs": [],
      "name": "ADMIN_ROLE",
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
      "inputs": [],
      "name": "DEFAULT_ADMIN_ROLE",
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
      "inputs": [],
      "name": "DUKCAPIL_ROLE",
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
      "inputs": [],
      "name": "KESEHATAN_ROLE",
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
      "inputs": [],
      "name": "PENDIDIKAN_ROLE",
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
      "inputs": [],
      "name": "SOSIAL_ROLE",
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
          "name": "role",
          "type": "bytes32"
        }
      ],
      "name": "getRoleAdmin",
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
          "name": "role",
          "type": "bytes32"
        },
        {
          "internalType": "address",
          "name": "account",
          "type": "address"
        }
      ],
      "name": "grantRole",
      "outputs": [],
      "stateMutability": "nonpayable",
      "type": "function"
    },
    {
      "inputs": [
        {
          "internalType": "bytes32",
          "name": "role",
          "type": "bytes32"
        },
        {
          "internalType": "address",
          "name": "account",
          "type": "address"
        }
      ],
      "name": "hasRole",
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
          "name": "role",
          "type": "bytes32"
        },
        {
          "internalType": "address",
          "name": "callerConfirmation",
          "type": "address"
        }
      ],
      "name": "renounceRole",
      "outputs": [],
      "stateMutability": "nonpayable",
      "type": "function"
    },
    {
      "inputs": [
        {
          "internalType": "bytes32",
          "name": "role",
          "type": "bytes32"
        },
        {
          "internalType": "address",
          "name": "account",
          "type": "address"
        }
      ],
      "name": "revokeRole",
      "outputs": [],
      "stateMutability": "nonpayable",
      "type": "function"
    },
    {
      "inputs": [
        {
          "internalType": "bytes4",
          "name": "interfaceId",
          "type": "bytes4"
        }
      ],
      "name": "supportsInterface",
      "outputs": [
        {
          "internalType": "bool",
          "name": "",
          "type": "bool"
        }
      ],
      "stateMutability": "view",
      "type": "function"
    }
];

export const IDENTITY_ABI = [
    {
      "inputs": [
        {
          "internalType": "address",
          "name": "_rbacAddress",
          "type": "address"
        }
      ],
      "stateMutability": "nonpayable",
      "type": "constructor"
    },
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
        },
        {
          "indexed": true,
          "internalType": "address",
          "name": "admin",
          "type": "address"
        }
      ],
      "name": "IdentityRegistered",
      "type": "event"
    },
    {
      "anonymous": false,
      "inputs": [
        {
          "indexed": true,
          "internalType": "bytes32",
          "name": "identityHash",
          "type": "bytes32"
        },
        {
          "indexed": true,
          "internalType": "address",
          "name": "verifier",
          "type": "address"
        }
      ],
      "name": "IdentityVerified",
      "type": "event"
    },
    {
      "inputs": [],
      "name": "ADMIN_ROLE",
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
          "internalType": "address",
          "name": "_wallet",
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
          "name": "_identityHash",
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
          "name": "_wallet",
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
          "name": "_identityHash",
          "type": "bytes32"
        }
      ],
      "name": "isVerified",
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
          "internalType": "address",
          "name": "_wallet",
          "type": "address"
        },
        {
          "internalType": "bytes32",
          "name": "_identityHash",
          "type": "bytes32"
        }
      ],
      "name": "registerIdentity",
      "outputs": [],
      "stateMutability": "nonpayable",
      "type": "function"
    },
    {
      "inputs": [
        {
          "internalType": "bytes32",
          "name": "_identityHash",
          "type": "bytes32"
        },
        {
          "internalType": "bool",
          "name": "_status",
          "type": "bool"
        }
      ],
      "name": "setVerifiedStatus",
      "outputs": [],
      "stateMutability": "nonpayable",
      "type": "function"
    }
];

export const DUKCAPIL_ABI = [
    {
      "inputs": [
        {
          "internalType": "address",
          "name": "rbacAddress",
          "type": "address"
        },
        {
          "internalType": "address",
          "name": "identityAddress",
          "type": "address"
        }
      ],
      "stateMutability": "nonpayable",
      "type": "constructor"
    },
    {
      "anonymous": false,
      "inputs": [
        {
          "indexed": true,
          "internalType": "string",
          "name": "applicationId",
          "type": "string"
        },
        {
          "indexed": true,
          "internalType": "address",
          "name": "approver",
          "type": "address"
        },
        {
          "indexed": false,
          "internalType": "uint256",
          "name": "timestamp",
          "type": "uint256"
        }
      ],
      "name": "ApplicationApproved",
      "type": "event"
    },
    {
      "anonymous": false,
      "inputs": [
        {
          "indexed": true,
          "internalType": "string",
          "name": "applicationId",
          "type": "string"
        },
        {
          "indexed": false,
          "internalType": "string",
          "name": "reason",
          "type": "string"
        },
        {
          "indexed": true,
          "internalType": "address",
          "name": "rejecter",
          "type": "address"
        },
        {
          "indexed": false,
          "internalType": "uint256",
          "name": "timestamp",
          "type": "uint256"
        }
      ],
      "name": "ApplicationRejected",
      "type": "event"
    },
    {
      "anonymous": false,
      "inputs": [
        {
          "indexed": false,
          "internalType": "string",
          "name": "applicationId",
          "type": "string"
        },
        {
          "indexed": true,
          "internalType": "address",
          "name": "applicant",
          "type": "address"
        },
        {
          "indexed": false,
          "internalType": "string",
          "name": "applicationType",
          "type": "string"
        },
        {
          "indexed": false,
          "internalType": "uint256",
          "name": "timestamp",
          "type": "uint256"
        }
      ],
      "name": "ApplicationSubmitted",
      "type": "event"
    },
    {
      "anonymous": false,
      "inputs": [
        {
          "indexed": true,
          "internalType": "string",
          "name": "nik",
          "type": "string"
        },
        {
          "indexed": true,
          "internalType": "address",
          "name": "officer",
          "type": "address"
        },
        {
          "indexed": false,
          "internalType": "uint256",
          "name": "timestamp",
          "type": "uint256"
        }
      ],
      "name": "CitizenDataUpdated",
      "type": "event"
    },
    {
      "inputs": [],
      "name": "DUKCAPIL_ROLE",
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
          "internalType": "string",
          "name": "",
          "type": "string"
        }
      ],
      "name": "applications",
      "outputs": [
        {
          "internalType": "address",
          "name": "applicant",
          "type": "address"
        },
        {
          "internalType": "string",
          "name": "applicationType",
          "type": "string"
        },
        {
          "internalType": "string",
          "name": "applicationDetails",
          "type": "string"
        },
        {
          "internalType": "uint256",
          "name": "timestamp",
          "type": "uint256"
        },
        {
          "internalType": "enum LayananDukcapil.Status",
          "name": "status",
          "type": "uint8"
        }
      ],
      "stateMutability": "view",
      "type": "function"
    },
    {
      "inputs": [
        {
          "internalType": "string",
          "name": "_applicationId",
          "type": "string"
        }
      ],
      "name": "approveApplication",
      "outputs": [],
      "stateMutability": "nonpayable",
      "type": "function"
    },
    {
      "inputs": [
        {
          "internalType": "string",
          "name": "",
          "type": "string"
        }
      ],
      "name": "citizenData",
      "outputs": [
        {
          "internalType": "string",
          "name": "nik",
          "type": "string"
        },
        {
          "internalType": "string",
          "name": "name",
          "type": "string"
        },
        {
          "internalType": "string",
          "name": "dob",
          "type": "string"
        },
        {
          "internalType": "string",
          "name": "addr",
          "type": "string"
        },
        {
          "internalType": "string",
          "name": "maritalStatus",
          "type": "string"
        },
        {
          "internalType": "string",
          "name": "economicStatus",
          "type": "string"
        },
        {
          "internalType": "bool",
          "name": "active",
          "type": "bool"
        }
      ],
      "stateMutability": "view",
      "type": "function"
    },
    {
      "inputs": [
        {
          "internalType": "string",
          "name": "_nik",
          "type": "string"
        }
      ],
      "name": "getCitizenData",
      "outputs": [
        {
          "components": [
            {
              "internalType": "string",
              "name": "nik",
              "type": "string"
            },
            {
              "internalType": "string",
              "name": "name",
              "type": "string"
            },
            {
              "internalType": "string",
              "name": "dob",
              "type": "string"
            },
            {
              "internalType": "string",
              "name": "addr",
              "type": "string"
            },
            {
              "internalType": "string",
              "name": "maritalStatus",
              "type": "string"
            },
            {
              "internalType": "string",
              "name": "economicStatus",
              "type": "string"
            },
            {
              "internalType": "bool",
              "name": "active",
              "type": "bool"
            }
          ],
          "internalType": "struct LayananDukcapil.Citizen",
          "name": "",
          "type": "tuple"
        }
      ],
      "stateMutability": "view",
      "type": "function"
    },
    {
      "inputs": [
        {
          "internalType": "string",
          "name": "_nik",
          "type": "string"
        }
      ],
      "name": "isNikRegistered",
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
          "internalType": "string",
          "name": "_applicationId",
          "type": "string"
        },
        {
          "internalType": "string",
          "name": "_reason",
          "type": "string"
        }
      ],
      "name": "rejectApplication",
      "outputs": [],
      "stateMutability": "nonpayable",
      "type": "function"
    },
    {
      "inputs": [
        {
          "internalType": "string",
          "name": "_applicationType",
          "type": "string"
        },
        {
          "internalType": "string",
          "name": "_applicationDetails",
          "type": "string"
        }
      ],
      "name": "submitApplication",
      "outputs": [],
      "stateMutability": "nonpayable",
      "type": "function"
    },
    {
      "inputs": [
        {
          "internalType": "string",
          "name": "_nik",
          "type": "string"
        },
        {
          "internalType": "string",
          "name": "_name",
          "type": "string"
        },
        {
          "internalType": "string",
          "name": "_dob",
          "type": "string"
        },
        {
          "internalType": "string",
          "name": "_address",
          "type": "string"
        },
        {
          "internalType": "string",
          "name": "_maritalStatus",
          "type": "string"
        },
        {
          "internalType": "string",
          "name": "_economicStatus",
          "type": "string"
        }
      ],
      "name": "updateCitizenData",
      "outputs": [],
      "stateMutability": "nonpayable",
      "type": "function"
    }
];

export const PENDIDIKAN_ABI = [
    {
      "inputs": [
        {
          "internalType": "address",
          "name": "rbacAddress",
          "type": "address"
        },
        {
          "internalType": "address",
          "name": "identityAddress",
          "type": "address"
        }
      ],
      "stateMutability": "nonpayable",
      "type": "constructor"
    },
    {
      "anonymous": false,
      "inputs": [
        {
          "indexed": true,
          "internalType": "string",
          "name": "studentId",
          "type": "string"
        },
        {
          "indexed": true,
          "internalType": "address",
          "name": "officer",
          "type": "address"
        },
        {
          "indexed": false,
          "internalType": "uint256",
          "name": "timestamp",
          "type": "uint256"
        }
      ],
      "name": "AcademicRecordUpdated",
      "type": "event"
    },
    {
      "anonymous": false,
      "inputs": [
        {
          "indexed": true,
          "internalType": "string",
          "name": "applicationId",
          "type": "string"
        },
        {
          "indexed": true,
          "internalType": "address",
          "name": "approver",
          "type": "address"
        },
        {
          "indexed": false,
          "internalType": "uint256",
          "name": "timestamp",
          "type": "uint256"
        }
      ],
      "name": "ApplicationApproved",
      "type": "event"
    },
    {
      "anonymous": false,
      "inputs": [
        {
          "indexed": true,
          "internalType": "string",
          "name": "applicationId",
          "type": "string"
        },
        {
          "indexed": false,
          "internalType": "string",
          "name": "reason",
          "type": "string"
        },
        {
          "indexed": true,
          "internalType": "address",
          "name": "rejecter",
          "type": "address"
        },
        {
          "indexed": false,
          "internalType": "uint256",
          "name": "timestamp",
          "type": "uint256"
        }
      ],
      "name": "ApplicationRejected",
      "type": "event"
    },
    {
      "anonymous": false,
      "inputs": [
        {
          "indexed": false,
          "internalType": "string",
          "name": "applicationId",
          "type": "string"
        },
        {
          "indexed": true,
          "internalType": "address",
          "name": "applicant",
          "type": "address"
        },
        {
          "indexed": false,
          "internalType": "string",
          "name": "applicationType",
          "type": "string"
        },
        {
          "indexed": false,
          "internalType": "uint256",
          "name": "timestamp",
          "type": "uint256"
        }
      ],
      "name": "ApplicationSubmitted",
      "type": "event"
    },
    {
      "inputs": [],
      "name": "PENDIDIKAN_ROLE",
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
          "internalType": "string",
          "name": "",
          "type": "string"
        }
      ],
      "name": "applications",
      "outputs": [
        {
          "internalType": "address",
          "name": "applicant",
          "type": "address"
        },
        {
          "internalType": "string",
          "name": "applicationType",
          "type": "string"
        },
        {
          "internalType": "string",
          "name": "applicationDetails",
          "type": "string"
        },
        {
          "internalType": "uint256",
          "name": "timestamp",
          "type": "uint256"
        },
        {
          "internalType": "enum LayananPendidikan.Status",
          "name": "status",
          "type": "uint8"
        }
      ],
      "stateMutability": "view",
      "type": "function"
    },
    {
      "inputs": [
        {
          "internalType": "string",
          "name": "_applicationId",
          "type": "string"
        }
      ],
      "name": "approveApplication",
      "outputs": [],
      "stateMutability": "nonpayable",
      "type": "function"
    },
    {
      "inputs": [
        {
          "internalType": "string",
          "name": "_studentId",
          "type": "string"
        }
      ],
      "name": "getAcademicRecord",
      "outputs": [
        {
          "components": [
            {
              "internalType": "string",
              "name": "studentId",
              "type": "string"
            },
            {
              "internalType": "string",
              "name": "nik",
              "type": "string"
            },
            {
              "internalType": "string",
              "name": "school",
              "type": "string"
            },
            {
              "internalType": "string",
              "name": "grade",
              "type": "string"
            },
            {
              "internalType": "bool",
              "name": "isScholarshipRecipient",
              "type": "bool"
            }
          ],
          "internalType": "struct LayananPendidikan.StudentRecord",
          "name": "",
          "type": "tuple"
        }
      ],
      "stateMutability": "view",
      "type": "function"
    },
    {
      "inputs": [
        {
          "internalType": "string",
          "name": "_applicationId",
          "type": "string"
        },
        {
          "internalType": "string",
          "name": "_reason",
          "type": "string"
        }
      ],
      "name": "rejectApplication",
      "outputs": [],
      "stateMutability": "nonpayable",
      "type": "function"
    },
    {
      "inputs": [
        {
          "internalType": "string",
          "name": "_applicationType",
          "type": "string"
        },
        {
          "internalType": "string",
          "name": "_applicationDetails",
          "type": "string"
        }
      ],
      "name": "submitApplication",
      "outputs": [],
      "stateMutability": "nonpayable",
      "type": "function"
    },
    {
      "inputs": [
        {
          "internalType": "string",
          "name": "_studentId",
          "type": "string"
        },
        {
          "internalType": "string",
          "name": "_nik",
          "type": "string"
        },
        {
          "internalType": "string",
          "name": "_school",
          "type": "string"
        },
        {
          "internalType": "string",
          "name": "_grade",
          "type": "string"
        }
      ],
      "name": "updateAcademicRecord",
      "outputs": [],
      "stateMutability": "nonpayable",
      "type": "function"
    }
];

export const SOSIAL_ABI = [
    {
      "inputs": [
        {
          "internalType": "address",
          "name": "rbacAddress",
          "type": "address"
        },
        {
          "internalType": "address",
          "name": "identityAddress",
          "type": "address"
        },
        {
          "internalType": "address",
          "name": "dukcapilAddress",
          "type": "address"
        }
      ],
      "stateMutability": "nonpayable",
      "type": "constructor"
    },
    {
      "anonymous": false,
      "inputs": [
        {
          "indexed": true,
          "internalType": "string",
          "name": "beneficiaryId",
          "type": "string"
        },
        {
          "indexed": true,
          "internalType": "address",
          "name": "officer",
          "type": "address"
        },
        {
          "indexed": false,
          "internalType": "uint256",
          "name": "timestamp",
          "type": "uint256"
        }
      ],
      "name": "AidRecorded",
      "type": "event"
    },
    {
      "anonymous": false,
      "inputs": [
        {
          "indexed": true,
          "internalType": "string",
          "name": "applicationId",
          "type": "string"
        },
        {
          "indexed": true,
          "internalType": "address",
          "name": "approver",
          "type": "address"
        },
        {
          "indexed": false,
          "internalType": "uint256",
          "name": "timestamp",
          "type": "uint256"
        }
      ],
      "name": "ApplicationApproved",
      "type": "event"
    },
    {
      "anonymous": false,
      "inputs": [
        {
          "indexed": true,
          "internalType": "string",
          "name": "applicationId",
          "type": "string"
        },
        {
          "indexed": false,
          "internalType": "string",
          "name": "reason",
          "type": "string"
        },
        {
          "indexed": true,
          "internalType": "address",
          "name": "rejecter",
          "type": "address"
        },
        {
          "indexed": false,
          "internalType": "uint256",
          "name": "timestamp",
          "type": "uint256"
        }
      ],
      "name": "ApplicationRejected",
      "type": "event"
    },
    {
      "anonymous": false,
      "inputs": [
        {
          "indexed": false,
          "internalType": "string",
          "name": "applicationId",
          "type": "string"
        },
        {
          "indexed": true,
          "internalType": "address",
          "name": "applicant",
          "type": "address"
        },
        {
          "indexed": false,
          "internalType": "string",
          "name": "applicationType",
          "type": "string"
        },
        {
          "indexed": false,
          "internalType": "uint256",
          "name": "timestamp",
          "type": "uint256"
        }
      ],
      "name": "ApplicationSubmitted",
      "type": "event"
    },
    {
      "inputs": [],
      "name": "SOSIAL_ROLE",
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
          "internalType": "string",
          "name": "",
          "type": "string"
        }
      ],
      "name": "applications",
      "outputs": [
        {
          "internalType": "address",
          "name": "applicant",
          "type": "address"
        },
        {
          "internalType": "string",
          "name": "applicationType",
          "type": "string"
        },
        {
          "internalType": "string",
          "name": "applicationDetails",
          "type": "string"
        },
        {
          "internalType": "uint256",
          "name": "timestamp",
          "type": "uint256"
        },
        {
          "internalType": "enum LayananSosial.Status",
          "name": "status",
          "type": "uint8"
        }
      ],
      "stateMutability": "view",
      "type": "function"
    },
    {
      "inputs": [
        {
          "internalType": "string",
          "name": "_applicationId",
          "type": "string"
        }
      ],
      "name": "approveApplication",
      "outputs": [],
      "stateMutability": "nonpayable",
      "type": "function"
    },
    {
      "inputs": [
        {
          "internalType": "string",
          "name": "_beneficiaryId",
          "type": "string"
        }
      ],
      "name": "getAidRecord",
      "outputs": [
        {
          "components": [
            {
              "internalType": "string",
              "name": "beneficiaryId",
              "type": "string"
            },
            {
              "internalType": "string",
              "name": "aidType",
              "type": "string"
            },
            {
              "internalType": "string",
              "name": "status",
              "type": "string"
            },
            {
              "internalType": "uint256",
              "name": "amount",
              "type": "uint256"
            }
          ],
          "internalType": "struct LayananSosial.AidRecord",
          "name": "",
          "type": "tuple"
        }
      ],
      "stateMutability": "view",
      "type": "function"
    },
    {
      "inputs": [
        {
          "internalType": "string",
          "name": "_beneficiaryId",
          "type": "string"
        },
        {
          "internalType": "string",
          "name": "_aidType",
          "type": "string"
        },
        {
          "internalType": "string",
          "name": "_status",
          "type": "string"
        },
        {
          "internalType": "uint256",
          "name": "_amount",
          "type": "uint256"
        }
      ],
      "name": "recordAidDistribution",
      "outputs": [],
      "stateMutability": "nonpayable",
      "type": "function"
    },
    {
      "inputs": [
        {
          "internalType": "string",
          "name": "_applicationId",
          "type": "string"
        },
        {
          "internalType": "string",
          "name": "_reason",
          "type": "string"
        }
      ],
      "name": "rejectApplication",
      "outputs": [],
      "stateMutability": "nonpayable",
      "type": "function"
    },
    {
      "inputs": [
        {
          "internalType": "string",
          "name": "_applicationType",
          "type": "string"
        },
        {
          "internalType": "string",
          "name": "_applicationDetails",
          "type": "string"
        }
      ],
      "name": "submitApplication",
      "outputs": [],
      "stateMutability": "nonpayable",
      "type": "function"
    }
];

export const KESEHATAN_ABI = [
    {
      "inputs": [
        {
          "internalType": "address",
          "name": "rbacAddress",
          "type": "address"
        },
        {
          "internalType": "address",
          "name": "identityAddress",
          "type": "address"
        }
      ],
      "stateMutability": "nonpayable",
      "type": "constructor"
    },
    {
      "anonymous": false,
      "inputs": [
        {
          "indexed": true,
          "internalType": "string",
          "name": "applicationId",
          "type": "string"
        },
        {
          "indexed": true,
          "internalType": "address",
          "name": "approver",
          "type": "address"
        },
        {
          "indexed": false,
          "internalType": "uint256",
          "name": "timestamp",
          "type": "uint256"
        }
      ],
      "name": "ApplicationApproved",
      "type": "event"
    },
    {
      "anonymous": false,
      "inputs": [
        {
          "indexed": true,
          "internalType": "string",
          "name": "applicationId",
          "type": "string"
        },
        {
          "indexed": false,
          "internalType": "string",
          "name": "reason",
          "type": "string"
        },
        {
          "indexed": true,
          "internalType": "address",
          "name": "rejecter",
          "type": "address"
        },
        {
          "indexed": false,
          "internalType": "uint256",
          "name": "timestamp",
          "type": "uint256"
        }
      ],
      "name": "ApplicationRejected",
      "type": "event"
    },
    {
      "anonymous": false,
      "inputs": [
        {
          "indexed": false,
          "internalType": "string",
          "name": "applicationId",
          "type": "string"
        },
        {
          "indexed": true,
          "internalType": "address",
          "name": "applicant",
          "type": "address"
        },
        {
          "indexed": false,
          "internalType": "string",
          "name": "applicationType",
          "type": "string"
        },
        {
          "indexed": false,
          "internalType": "uint256",
          "name": "timestamp",
          "type": "uint256"
        }
      ],
      "name": "ApplicationSubmitted",
      "type": "event"
    },
    {
      "anonymous": false,
      "inputs": [
        {
          "indexed": true,
          "internalType": "string",
          "name": "bpjsId",
          "type": "string"
        },
        {
          "indexed": true,
          "internalType": "address",
          "name": "officer",
          "type": "address"
        },
        {
          "indexed": false,
          "internalType": "uint256",
          "name": "timestamp",
          "type": "uint256"
        }
      ],
      "name": "BPJSValidated",
      "type": "event"
    },
    {
      "inputs": [],
      "name": "KESEHATAN_ROLE",
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
          "internalType": "string",
          "name": "",
          "type": "string"
        }
      ],
      "name": "applications",
      "outputs": [
        {
          "internalType": "address",
          "name": "applicant",
          "type": "address"
        },
        {
          "internalType": "string",
          "name": "applicationType",
          "type": "string"
        },
        {
          "internalType": "string",
          "name": "applicationDetails",
          "type": "string"
        },
        {
          "internalType": "uint256",
          "name": "timestamp",
          "type": "uint256"
        },
        {
          "internalType": "enum LayananKesehatan.Status",
          "name": "status",
          "type": "uint8"
        }
      ],
      "stateMutability": "view",
      "type": "function"
    },
    {
      "inputs": [
        {
          "internalType": "string",
          "name": "_applicationId",
          "type": "string"
        }
      ],
      "name": "approveApplication",
      "outputs": [],
      "stateMutability": "nonpayable",
      "type": "function"
    },
    {
      "inputs": [
        {
          "internalType": "string",
          "name": "_bpjsId",
          "type": "string"
        }
      ],
      "name": "getBPJSData",
      "outputs": [
        {
          "components": [
            {
              "internalType": "string",
              "name": "bpjsId",
              "type": "string"
            },
            {
              "internalType": "string",
              "name": "nik",
              "type": "string"
            },
            {
              "internalType": "bool",
              "name": "isValid",
              "type": "bool"
            },
            {
              "internalType": "string",
              "name": "facility",
              "type": "string"
            }
          ],
          "internalType": "struct LayananKesehatan.BpjsRecord",
          "name": "",
          "type": "tuple"
        }
      ],
      "stateMutability": "view",
      "type": "function"
    },
    {
      "inputs": [
        {
          "internalType": "string",
          "name": "_bpjsId",
          "type": "string"
        },
        {
          "internalType": "string",
          "name": "_nik",
          "type": "string"
        },
        {
          "internalType": "bool",
          "name": "_isValid",
          "type": "bool"
        },
        {
          "internalType": "string",
          "name": "_facility",
          "type": "string"
        }
      ],
      "name": "recordBPJSValidation",
      "outputs": [],
      "stateMutability": "nonpayable",
      "type": "function"
    },
    {
      "inputs": [
        {
          "internalType": "string",
          "name": "_applicationId",
          "type": "string"
        },
        {
          "internalType": "string",
          "name": "_reason",
          "type": "string"
        }
      ],
      "name": "rejectApplication",
      "outputs": [],
      "stateMutability": "nonpayable",
      "type": "function"
    },
    {
      "inputs": [
        {
          "internalType": "string",
          "name": "_applicationType",
          "type": "string"
        },
        {
          "internalType": "string",
          "name": "_applicationDetails",
          "type": "string"
        }
      ],
      "name": "submitApplication",
      "outputs": [],
      "stateMutability": "nonpayable",
      "type": "function"
    }
];