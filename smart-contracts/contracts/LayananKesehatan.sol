// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import "./RBAC.sol";

/**
 * @title LayananKesehatan
 * @dev Contract for managing health services and BPJS validation, protected by RBAC.
 */
contract LayananKesehatan {
    RBAC private _rbac;
    bytes32 public constant KESEHATAN_ROLE = keccak256("KESEHATAN_ROLE");

    // Mapping from BPJS ID to their validation data
    mapping(string => string) private _bpjsValidationData;

    event BPJSValidated(string indexed bpjsId, string data, address indexed officer, uint timestamp);

    /**
     * @dev The constructor sets the address of the RBAC contract.
     */
    constructor(address rbacAddress) {
        require(rbacAddress != address(0), "RBAC address cannot be zero");
        _rbac = RBAC(rbacAddress);
    }

    /**
     * @dev Modifier to check if the caller has the KESEHATAN_ROLE.
     */
    modifier onlyKesehatanOfficer() {
        require(_rbac.hasRole(KESEHATAN_ROLE, msg.sender), "Caller is not a Kesehatan officer");
        _;
    }

    /**
     * @dev A protected function that can only be called by a Kesehatan officer to record BPJS validation.
     * @param _bpjsId The BPJS ID of the patient.
     * @param _data The BPJS validation data to be recorded.
     */
    function recordBPJSValidation(string memory _bpjsId, string memory _data) external onlyKesehatanOfficer {
        require(bytes(_bpjsId).length > 0, "BPJS ID cannot be empty");
        _bpjsValidationData[_bpjsId] = _data;
        emit BPJSValidated(_bpjsId, _data, msg.sender, block.timestamp);
    }

    /**
     * @dev Returns the BPJS validation data for a given BPJS ID.
     * @param _bpjsId The BPJS ID of the patient.
     * @return The BPJS validation data associated with the BPJS ID.
     */
    function getBPJSValidation(string memory _bpjsId) public view returns (string memory) {
        return _bpjsValidationData[_bpjsId];
    }

    event ApplicationSubmitted(address indexed applicant, string applicationType, string applicationDetails, uint timestamp);
    event ApplicationApproved(string indexed applicationId, address indexed approver, uint timestamp);
    event ApplicationRejected(string indexed applicationId, string reason, address indexed rejecter, uint timestamp);

    /**
     * @dev Allows a user to submit an application.
     * @param _applicationType The type of application (e.g., "BPJS Claim", "Medical Record Request").
     * @param _applicationDetails Details of the application.
     */
    function submitApplication(string memory _applicationType, string memory _applicationDetails) external {
        require(bytes(_applicationType).length > 0, "Application type cannot be empty");
        require(bytes(_applicationDetails).length > 0, "Application details cannot be empty");
        emit ApplicationSubmitted(msg.sender, _applicationType, _applicationDetails, block.timestamp);
    }

    /**
     * @dev Allows a Kesehatan officer to approve an application.
     * @param _applicationId A unique identifier for the application (e.g., transaction hash of submission).
     */
    function approveApplication(string memory _applicationId) external onlyKesehatanOfficer {
        require(bytes(_applicationId).length > 0, "Application ID cannot be empty");
        emit ApplicationApproved(_applicationId, msg.sender, block.timestamp);
    }

    /**
     * @dev Allows a Kesehatan officer to reject an application.
     * @param _applicationId A unique identifier for the application.
     * @param _reason The reason for rejection.
     */
    function rejectApplication(string memory _applicationId, string memory _reason) external onlyKesehatanOfficer {
        require(bytes(_applicationId).length > 0, "Application ID cannot be empty");
        require(bytes(_reason).length > 0, "Reason for rejection cannot be empty");
        emit ApplicationRejected(_applicationId, _reason, msg.sender, block.timestamp);
    }
}
