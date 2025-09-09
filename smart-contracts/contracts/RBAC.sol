// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import "@openzeppelin/contracts/access/AccessControl.sol";

/**
 * @title RBAC
 * @dev This contract uses OpenZeppelin's AccessControl to manage roles for the regency's services.
 * It defines specific roles for different departments and levels of administration.
 */
contract RBAC is AccessControl {
    // Role for the top-level system administrator (Kabupaten Admin)
    bytes32 public constant ADMIN_ROLE = keccak256("ADMIN_ROLE");

    // Roles for specific departments (Dinas)
    bytes32 public constant DUKCAPIL_ROLE = keccak256("DUKCAPIL_ROLE");
    bytes32 public constant PENDIDIKAN_ROLE = keccak256("PENDIDIKAN_ROLE");
    bytes32 public constant SOSIAL_ROLE = keccak256("SOSIAL_ROLE");
    bytes32 public constant KESEHATAN_ROLE = keccak256("KESEHATAN_ROLE");

    /**
     * @dev Sets up the initial roles. The deployer of the contract is granted the default admin role,
     * which can then grant other roles, including the top-level ADMIN_ROLE.
     */
    constructor() {
        // The account that deploys the contract gets the default admin role.
        // This role is required to grant other roles.
        _grantRole(DEFAULT_ADMIN_ROLE, msg.sender);

        // Optionally, the deployer can also be made the first top-level admin.
        _grantRole(ADMIN_ROLE, msg.sender);
    }
}
