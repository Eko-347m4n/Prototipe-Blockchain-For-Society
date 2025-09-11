// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import "./RBAC.sol";

/**
 * @title LayananSosial
 * @dev Contract for managing social services and aid distribution, protected by RBAC.
 */
contract LayananSosial {
    RBAC private _rbac;
    bytes32 public constant SOSIAL_ROLE = keccak256("SOSIAL_ROLE");

    // Mapping from beneficiary ID to their aid distribution data
    mapping(string => string) private _aidDistributionData;

    event AidDistributed(string indexed beneficiaryId, string data, address indexed officer, uint timestamp);

    /**
     * @dev The constructor sets the address of the RBAC contract.
     */
    constructor(address rbacAddress) {
        require(rbacAddress != address(0), "RBAC address cannot be zero");
        _rbac = RBAC(rbacAddress);
    }

    /**
     * @dev Modifier to check if the caller has the SOSIAL_ROLE.
     */
    modifier onlySosialOfficer() {
        require(_rbac.hasRole(SOSIAL_ROLE, msg.sender), "Caller is not a Sosial officer");
        _;
    }

    /**
     * @dev A protected function that can only be called by a Sosial officer to record aid distribution.
     * @param _beneficiaryId The ID of the beneficiary.
     * @param _data The aid distribution data to be recorded.
     */
    function recordAidDistribution(string memory _beneficiaryId, string memory _data) external onlySosialOfficer {
        require(bytes(_beneficiaryId).length > 0, "Beneficiary ID cannot be empty");
        _aidDistributionData[_beneficiaryId] = _data;
        emit AidDistributed(_beneficiaryId, _data, msg.sender, block.timestamp);
    }

    /**
     * @dev Returns the aid distribution data for a given beneficiary ID.
     * @param _beneficiaryId The ID of the beneficiary.
     * @return The aid distribution data associated with the beneficiary ID.
     */
    function getAidDistribution(string memory _beneficiaryId) public view returns (string memory) {
        return _aidDistributionData[_beneficiaryId];
    }

    event ApplicationSubmitted(address indexed applicant, string applicationType, string applicationDetails, uint timestamp);
    event ApplicationApproved(string indexed applicationId, address indexed approver, uint timestamp);
    event ApplicationRejected(string indexed applicationId, string reason, address indexed rejecter, uint timestamp);

    /**
     * @dev Allows a user to submit an application.
     * @param _applicationType The type of application (e.g., "Aid Request", "Grant Application").
     * @param _applicationDetails Details of the application.
     */
    function submitApplication(string memory _applicationType, string memory _applicationDetails) external {
        require(bytes(_applicationType).length > 0, "Application type cannot be empty");
        require(bytes(_applicationDetails).length > 0, "Application details cannot be empty");
        emit ApplicationSubmitted(msg.sender, _applicationType, _applicationDetails, block.timestamp);
    }

    /**
     * @dev Allows a Sosial officer to approve an application.
     * @param _applicationId A unique identifier for the application (e.g., transaction hash of submission).
     */
    function approveApplication(string memory _applicationId) external onlySosialOfficer {
        require(bytes(_applicationId).length > 0, "Application ID cannot be empty");
        emit ApplicationApproved(_applicationId, msg.sender, block.timestamp);
    }

    /**
     * @dev Allows a Sosial officer to reject an application.
     * @param _applicationId A unique identifier for the application.
     * @param _reason The reason for rejection.
     */
    function rejectApplication(string memory _applicationId, string memory _reason) external onlySosialOfficer {
        require(bytes(_applicationId).length > 0, "Application ID cannot be empty");
        require(bytes(_reason).length > 0, "Reason for rejection cannot be empty");
        emit ApplicationRejected(_applicationId, _reason, msg.sender, block.timestamp);
    }
}
