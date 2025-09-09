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

    string public lastUpdatedData;
    uint public lastUpdateTime;

    event DataCatat(address indexed petugas, string data, uint timestamp);

    /**
     * @dev The constructor sets the address of the RBAC contract.
     */
    constructor(address rbacAddress) {
        require(rbacAddress != address(0), "RBAC address cannot be zero");
        _rbac = RBAC(rbacAddress);
    }

    /**
     * @dev Modifier to check if the caller has the DUKCAPIL_ROLE.
     */
    modifier onlyDukcapilOfficer() {
        require(_rbac.hasRole(DUKCAPIL_ROLE, msg.sender), "Caller is not a Dukcapil officer");
        _;
    }

    /**
     * @dev A protected function that can only be called by a Dukcapil officer.
     */
    function catatDataBaru(string memory data) external onlyDukcapilOfficer {
        lastUpdatedData = data;
        lastUpdateTime = block.timestamp;
        emit DataCatat(msg.sender, data, block.timestamp);
    }
}
