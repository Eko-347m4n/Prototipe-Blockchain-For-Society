// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import "./RBAC.sol";
import "./Identity.sol";
import "@openzeppelin/contracts/utils/Strings.sol";

contract LayananDukcapil {
    using Strings for uint256;

    RBAC private _rbac;
    Identity private _identity;
    bytes32 public constant DUKCAPIL_ROLE = keccak256("DUKCAPIL_ROLE");

    enum Status { Pending, Approved, Rejected }

    struct Application {
        address applicant;
        string applicationType;
        string applicationDetails;
        uint256 timestamp;
        Status status;
    }

    struct Citizen {
        string nik;
        string name;
        string dob;
        string addr;
        string maritalStatus;
        string economicStatus;
        bool active;
    }

    uint256 private _applicationCounter;
    mapping(string => Application) public applications;
    mapping(string => Citizen) public citizenData;
    mapping(bytes32 => bool) private _nikHashes;

    event CitizenDataUpdated(string indexed nik, address indexed officer, uint timestamp);
    event ApplicationSubmitted(string applicationId, address indexed applicant, string applicationType, uint256 timestamp);
    event ApplicationApproved(string indexed applicationId, address indexed approver, uint timestamp);
    event ApplicationRejected(string indexed applicationId, string reason, address indexed rejecter, uint timestamp);

    constructor(address rbacAddress, address identityAddress) {
        require(rbacAddress != address(0) && identityAddress != address(0), "Invalid addresses");
        _rbac = RBAC(rbacAddress);
        _identity = Identity(identityAddress);
    }

    modifier onlyDukcapilOfficer() {
        require(_rbac.hasRole(DUKCAPIL_ROLE, msg.sender), "Caller is not a Dukcapil officer");
        _;
    }

    function submitApplication(string memory _applicationType, string memory _applicationDetails) external {
        require(bytes(_applicationType).length > 0, "Application type cannot be empty");
        
        _applicationCounter++;
        string memory applicationId = _applicationCounter.toString();
        
        applications[applicationId] = Application({
            applicant: msg.sender,
            applicationType: _applicationType,
            applicationDetails: _applicationDetails,
            timestamp: block.timestamp,
            status: Status.Pending
        });

        emit ApplicationSubmitted(applicationId, msg.sender, _applicationType, block.timestamp);
    }

    function approveApplication(string memory _applicationId) external onlyDukcapilOfficer {
        Application storage app = applications[_applicationId];
        require(app.applicant != address(0), "Application does not exist.");
        require(app.status == Status.Pending, "Application not pending.");

        app.status = Status.Approved;
        emit ApplicationApproved(_applicationId, msg.sender, block.timestamp);
    }

    function rejectApplication(string memory _applicationId, string memory _reason) external onlyDukcapilOfficer {
        Application storage app = applications[_applicationId];
        require(app.applicant != address(0), "Application does not exist.");
        require(app.status == Status.Pending, "Application not pending.");

        app.status = Status.Rejected;
        emit ApplicationRejected(_applicationId, _reason, msg.sender, block.timestamp);
    }

    function updateCitizenData(
        string memory _nik,
        string memory _name,
        string memory _dob,
        string memory _address,
        string memory _maritalStatus,
        string memory _economicStatus
    ) external onlyDukcapilOfficer {
        require(bytes(_nik).length > 0, "NIK cannot be empty");
        
        bytes32 nikHash = keccak256(abi.encodePacked(_nik));
        if (!_nikHashes[nikHash]) {
            require(_identity.getWallet(nikHash) != address(0), "NIK not registered in Identity contract");
            _nikHashes[nikHash] = true;
        }

        citizenData[_nik] = Citizen({
            nik: _nik,
            name: _name,
            dob: _dob,
            addr: _address,
            maritalStatus: _maritalStatus,
            economicStatus: _economicStatus,
            active: true
        });
        emit CitizenDataUpdated(_nik, msg.sender, block.timestamp);
    }

    function getCitizenData(string memory _nik) external view returns (Citizen memory) {
        return citizenData[_nik];
    }

    function isNikRegistered(string memory _nik) external view returns (bool) {
        return _nikHashes[keccak256(abi.encodePacked(_nik))];
    }
}