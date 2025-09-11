import {
    NEXT_PUBLIC_IDENTITY_CONTRACT_ADDRESS,
    NEXT_PUBLIC_RBAC_CONTRACT_ADDRESS,
    NEXT_PUBLIC_DUKCAPIL_CONTRACT_ADDRESS,
    NEXT_PUBLIC_PENDIDIKAN_CONTRACT_ADDRESS,
    NEXT_PUBLIC_SOSIAL_CONTRACT_ADDRESS,
    NEXT_PUBLIC_KESEHATAN_CONTRACT_ADDRESS
} from '@env';

export const IDENTITY_CONTRACT_ADDRESS = NEXT_PUBLIC_IDENTITY_CONTRACT_ADDRESS;
export const RBAC_CONTRACT_ADDRESS = NEXT_PUBLIC_RBAC_CONTRACT_ADDRESS;
export const DUKCAPIL_CONTRACT_ADDRESS = NEXT_PUBLIC_DUKCAPIL_CONTRACT_ADDRESS;
export const PENDIDIKAN_CONTRACT_ADDRESS = NEXT_PUBLIC_PENDIDIKAN_CONTRACT_ADDRESS;
export const SOSIAL_CONTRACT_ADDRESS = NEXT_PUBLIC_SOSIAL_CONTRACT_ADDRESS;
export const KESEHATAN_CONTRACT_ADDRESS = NEXT_PUBLIC_KESEHATAN_CONTRACT_ADDRESS;

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

export const PENDIDIKAN_CONTRACT_ABI = [
    {
      "inputs": [
        {
          "internalType": "address",
          "name": "rbacAddress",
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
          "indexed": false,
          "internalType": "string",
          "name": "data",
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
          "internalType": "string",
          "name": "applicationDetails",
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
          "internalType": "string",
          "name": "",
          "type": "string"
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
          "name": "_data",
          "type": "string"
        }
      ],
      "name": "updateAcademicRecord",
      "outputs": [],
      "stateMutability": "nonpayable",
      "type": "function"
    }
  ];

export const SOSIAL_CONTRACT_ABI = [
    {
      "inputs": [
        {
          "internalType": "address",
          "name": "rbacAddress",
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
          "indexed": false,
          "internalType": "string",
          "name": "data",
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
      "name": "AidDistributed",
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
          "internalType": "string",
          "name": "applicationDetails",
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
      "name": "getAidDistribution",
      "outputs": [
        {
          "internalType": "string",
          "name": "",
          "type": "string"
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
          "name": "_data",
          "type": "string"
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

export const KESEHATAN_CONTRACT_ABI = [
    {
      "inputs": [
        {
          "internalType": "address",
          "name": "rbacAddress",
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
          "internalType": "string",
          "name": "applicationDetails",
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
          "indexed": false,
          "internalType": "string",
          "name": "data",
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
      "name": "getBPJSValidation",
      "outputs": [
        {
          "internalType": "string",
          "name": "",
          "type": "string"
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
          "name": "_data",
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