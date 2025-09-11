// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import "./RBAC.sol";

/**
 * @title LayananDukcapil
 * @dev Example of a service contract protected by RBAC.
 */
contract LayananDukcapil {
    RBAC private _rbac;
    bytes32 public constant DUKCAPIL_ROLE = keccak256("DUKCAPIL_ROLE");

    // Mapping from NIK to citizen data
    mapping(string => string) private _citizenData;

    event CitizenDataUpdated(string indexed nik, string data, address indexed petugas, uint timestamp);
    event ApplicationSubmitted(address indexed applicant, string applicationType, string applicationDetails, uint timestamp);

    /**
     * @dev The constructor sets the address of the RBAC contract.
     */
    constructor(address rbacAddress) {
        require(rbacAddress != address(0), "RBAC address cannot be zero");
        _rbac = RBAC(rbacAddress);
    }

    /**
     * @dev Allows a user to submit an application.
     * @param _applicationType The type of application (e.g., "KTP", "KK").
     * @param _applicationDetails Details of the application.
     */
    function submitApplication(string memory _applicationType, string memory _applicationDetails) external {
        require(bytes(_applicationType).length > 0, "Application type cannot be empty");
        require(bytes(_applicationDetails).length > 0, "Application details cannot be empty");
        emit ApplicationSubmitted(msg.sender, _applicationType, _applicationDetails, block.timestamp);
    }

    /**
     * @dev Modifier to check if the caller has the DUKCAPIL_ROLE.
     */
    modifier onlyDukcapilOfficer() {
        require(_rbac.hasRole(DUKCAPIL_ROLE, msg.sender), "Caller is not a Dukcapil officer");
        _;
    }

    /**
     * @dev A protected function that can only be called by a Dukcapil officer to record or update citizen data.
     * @param _nik The NIK (Nomor Induk Kependudukan) of the citizen.
     * @param _data The data to be recorded for the citizen.
     */
    function updateCitizenData(string memory _nik, string memory _data) external onlyDukcapilOfficer {
        require(bytes(_nik).length > 0, "NIK cannot be empty");
        _citizenData[_nik] = _data;
        emit CitizenDataUpdated(_nik, _data, msg.sender, block.timestamp);
    }

    /**
     * @dev Returns the citizen data for a given NIK.
     * @param _nik The NIK of the citizen.
     * @return The data associated with the NIK.
     */
    function getCitizenData(string memory _nik) public view returns (string memory) {
        return _citizenData[_nik];
    }

    event ApplicationApproved(string indexed applicationId, address indexed approver, uint timestamp);
    event ApplicationRejected(string indexed applicationId, string reason, address indexed rejecter, uint timestamp);

    /**
     * @dev Allows a Dukcapil officer to approve an application.
     * @param _applicationId A unique identifier for the application (e.g., transaction hash of submission).
     */
    function approveApplication(string memory _applicationId) external onlyDukcapilOfficer {
        require(bytes(_applicationId).length > 0, "Application ID cannot be empty");
        // In a real system, you would check the application's state and update it.
        // For this prototype, we just emit an event.
        emit ApplicationApproved(_applicationId, msg.sender, block.timestamp);
    }

    /**
     * @dev Allows a Dukcapil officer to reject an application.
     * @param _applicationId A unique identifier for the application.
     * @param _reason The reason for rejection.
     */
    function rejectApplication(string memory _applicationId, string memory _reason) external onlyDukcapilOfficer {
        require(bytes(_applicationId).length > 0, "Application ID cannot be empty");
        require(bytes(_reason).length > 0, "Reason for rejection cannot be empty");
        // In a real system, you would check the application's state and update it.
        // For this prototype, we just emit an event.
        emit ApplicationRejected(_applicationId, _reason, msg.sender, block.timestamp);
    }
}
