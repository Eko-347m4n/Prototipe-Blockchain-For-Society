// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import "./RBAC.sol";
import "./Identity.sol";
import "./LayananDukcapil.sol";
import "@openzeppelin/contracts/utils/Strings.sol";

contract LayananSosial {
    using Strings for uint256;

    RBAC private _rbac;
    Identity private _identity;
    LayananDukcapil private _dukcapil;
    bytes32 public constant SOSIAL_ROLE = keccak256("SOSIAL_ROLE");

    enum Status { Pending, Approved, Rejected }

    struct Application {
        address applicant;
        string applicationType;
        string applicationDetails;
        uint256 timestamp;
        Status status;
    }

    struct AidRecord {
        string beneficiaryId; // NIK
        string aidType;
        string status;
        uint amount;
    }

    uint256 private _applicationCounter;
    mapping(string => Application) public applications;
    mapping(string => AidRecord) private _aidRecords;

    event AidRecorded(string indexed beneficiaryId, address indexed officer, uint timestamp);
    event ApplicationSubmitted(string applicationId, address indexed applicant, string applicationType, uint256 timestamp);
    event ApplicationApproved(string indexed applicationId, address indexed approver, uint timestamp);
    event ApplicationRejected(string indexed applicationId, string reason, address indexed rejecter, uint timestamp);

    constructor(address rbacAddress, address identityAddress, address dukcapilAddress) {
        require(rbacAddress != address(0) && identityAddress != address(0) && dukcapilAddress != address(0), "Invalid addresses");
        _rbac = RBAC(rbacAddress);
        _identity = Identity(identityAddress);
        _dukcapil = LayananDukcapil(dukcapilAddress);
    }

    modifier onlySosialOfficer() {
        require(_rbac.hasRole(SOSIAL_ROLE, msg.sender), "Caller is not a Sosial officer");
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

    function approveApplication(string memory _applicationId) external onlySosialOfficer {
        Application storage app = applications[_applicationId];
        require(app.applicant != address(0), "Application does not exist.");
        require(app.status == Status.Pending, "Application not pending.");

        app.status = Status.Approved;
        emit ApplicationApproved(_applicationId, msg.sender, block.timestamp);
    }

    function rejectApplication(string memory _applicationId, string memory _reason) external onlySosialOfficer {
        Application storage app = applications[_applicationId];
        require(app.applicant != address(0), "Application does not exist.");
        require(app.status == Status.Pending, "Application not pending.");

        app.status = Status.Rejected;
        emit ApplicationRejected(_applicationId, _reason, msg.sender, block.timestamp);
    }

    function recordAidDistribution(string memory _beneficiaryId, string memory _aidType, string memory _status, uint _amount) external onlySosialOfficer {
        require(_dukcapil.isNikRegistered(_beneficiaryId), "Beneficiary NIK is not registered in Dukcapil");
        
        _aidRecords[_beneficiaryId] = AidRecord({
            beneficiaryId: _beneficiaryId,
            aidType: _aidType,
            status: _status,
            amount: _amount
        });
        emit AidRecorded(_beneficiaryId, msg.sender, block.timestamp);
    }

    function getAidRecord(string memory _beneficiaryId) public view returns (AidRecord memory) {
        return _aidRecords[_beneficiaryId];
    }
}