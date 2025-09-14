// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import "./RBAC.sol";
import "./Identity.sol";
import "@openzeppelin/contracts/utils/Strings.sol";

contract LayananKesehatan {
    using Strings for uint256;

    RBAC private _rbac;
    Identity private _identity;
    bytes32 public constant KESEHATAN_ROLE = keccak256("KESEHATAN_ROLE");

    enum Status { Pending, Approved, Rejected }

    struct Application {
        address applicant;
        string applicationType;
        string applicationDetails;
        uint256 timestamp;
        Status status;
    }

    struct BpjsRecord {
        string bpjsId;
        string nik;
        bool isValid;
        string facility;
    }

    uint256 private _applicationCounter;
    mapping(string => Application) public applications;
    mapping(string => BpjsRecord) private _bpjsData;

    event BPJSValidated(string indexed bpjsId, address indexed officer, uint timestamp);
    event ApplicationSubmitted(string applicationId, address indexed applicant, string applicationType, uint256 timestamp);
    event ApplicationApproved(string indexed applicationId, address indexed approver, uint timestamp);
    event ApplicationRejected(string indexed applicationId, string reason, address indexed rejecter, uint timestamp);

    constructor(address rbacAddress, address identityAddress) {
        require(rbacAddress != address(0) && identityAddress != address(0), "Invalid addresses");
        _rbac = RBAC(rbacAddress);
        _identity = Identity(identityAddress);
    }

    modifier onlyKesehatanOfficer() {
        require(_rbac.hasRole(KESEHATAN_ROLE, msg.sender), "Caller is not a Kesehatan officer");
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

    function approveApplication(string memory _applicationId) external onlyKesehatanOfficer {
        Application storage app = applications[_applicationId];
        require(app.applicant != address(0), "Application does not exist.");
        require(app.status == Status.Pending, "Application not pending.");

        app.status = Status.Approved;
        emit ApplicationApproved(_applicationId, msg.sender, block.timestamp);
    }

    function rejectApplication(string memory _applicationId, string memory _reason) external onlyKesehatanOfficer {
        Application storage app = applications[_applicationId];
        require(app.applicant != address(0), "Application does not exist.");
        require(app.status == Status.Pending, "Application not pending.");

        app.status = Status.Rejected;
        emit ApplicationRejected(_applicationId, _reason, msg.sender, block.timestamp);
    }

    function recordBPJSValidation(string memory _bpjsId, string memory _nik, bool _isValid, string memory _facility) external onlyKesehatanOfficer {
        require(_identity.getWallet(keccak256(abi.encodePacked(_nik))) != address(0), "NIK is not registered");
        _bpjsData[_bpjsId] = BpjsRecord({
            bpjsId: _bpjsId,
            nik: _nik,
            isValid: _isValid,
            facility: _facility
        });
        emit BPJSValidated(_bpjsId, msg.sender, block.timestamp);
    }

    function getBPJSData(string memory _bpjsId) public view returns (BpjsRecord memory) {
        return _bpjsData[_bpjsId];
    }
}