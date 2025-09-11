// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import "./RBAC.sol";

/**
 * @title LayananPendidikan
 * @dev Contract for managing education-related services, protected by RBAC.
 */
contract LayananPendidikan {
    RBAC private _rbac;
    bytes32 public constant PENDIDIKAN_ROLE = keccak256("PENDIDIKAN_ROLE");

    // Mapping from student ID to their academic record data
    mapping(string => string) private _academicRecords;

    event AcademicRecordUpdated(string indexed studentId, string data, address indexed officer, uint timestamp);

    /**
     * @dev The constructor sets the address of the RBAC contract.
     */
    constructor(address rbacAddress) {
        require(rbacAddress != address(0), "RBAC address cannot be zero");
        _rbac = RBAC(rbacAddress);
    }

    /**
     * @dev Modifier to check if the caller has the PENDIDIKAN_ROLE.
     */
    modifier onlyPendidikanOfficer() {
        require(_rbac.hasRole(PENDIDIKAN_ROLE, msg.sender), "Caller is not a Pendidikan officer");
        _;
    }

    /**
     * @dev A protected function that can only be called by a Pendidikan officer to update academic records.
     * @param _studentId The ID of the student.
     * @param _data The academic data to be recorded for the student.
     */
    function updateAcademicRecord(string memory _studentId, string memory _data) external onlyPendidikanOfficer {
        require(bytes(_studentId).length > 0, "Student ID cannot be empty");
        _academicRecords[_studentId] = _data;
        emit AcademicRecordUpdated(_studentId, _data, msg.sender, block.timestamp);
    }

    /**
     * @dev Returns the academic record for a given student ID.
     * @param _studentId The ID of the student.
     * @return The academic data associated with the student ID.
     */
    function getAcademicRecord(string memory _studentId) public view returns (string memory) {
        return _academicRecords[_studentId];
    }

    event ApplicationSubmitted(address indexed applicant, string applicationType, string applicationDetails, uint timestamp);
    event ApplicationApproved(string indexed applicationId, address indexed approver, uint timestamp);
    event ApplicationRejected(string indexed applicationId, string reason, address indexed rejecter, uint timestamp);

    /**
     * @dev Allows a user to submit an application.
     * @param _applicationType The type of application (e.g., "Enrollment", "Scholarship").
     * @param _applicationDetails Details of the application.
     */
    function submitApplication(string memory _applicationType, string memory _applicationDetails) external {
        require(bytes(_applicationType).length > 0, "Application type cannot be empty");
        require(bytes(_applicationDetails).length > 0, "Application details cannot be empty");
        emit ApplicationSubmitted(msg.sender, _applicationType, _applicationDetails, block.timestamp);
    }

    /**
     * @dev Allows a Pendidikan officer to approve an application.
     * @param _applicationId A unique identifier for the application (e.g., transaction hash of submission).
     */
    function approveApplication(string memory _applicationId) external onlyPendidikanOfficer {
        require(bytes(_applicationId).length > 0, "Application ID cannot be empty");
        emit ApplicationApproved(_applicationId, msg.sender, block.timestamp);
    }

    /**
     * @dev Allows a Pendidikan officer to reject an application.
     * @param _applicationId A unique identifier for the application.
     * @param _reason The reason for rejection.
     */
    function rejectApplication(string memory _applicationId, string memory _reason) external onlyPendidikanOfficer {
        require(bytes(_applicationId).length > 0, "Application ID cannot be empty");
        require(bytes(_reason).length > 0, "Reason for rejection cannot be empty");
        emit ApplicationRejected(_applicationId, _reason, msg.sender, block.timestamp);
    }
}
