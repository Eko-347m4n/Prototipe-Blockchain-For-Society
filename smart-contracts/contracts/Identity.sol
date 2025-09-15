// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import "./RBAC.sol";

/**
 * @title Identity
 * @dev Contract for managing the link between a wallet address and a real-world identity hash (e.g., NIK/NIP).
 * Registration is controlled by an admin role.
 */
contract Identity {
    RBAC private _rbac;
    bytes32 public constant ADMIN_ROLE = keccak256("ADMIN_ROLE");

    // Mapping from an address to an identity hash
    mapping(address => bytes32) private _addressToIdentity;
    // Mapping from an identity hash to an address
    mapping(bytes32 => address) private _identityToAddress;
    // Mapping from an identity hash to a verification status
    mapping(bytes32 => bool) private _isVerified;

    event IdentityRegistered(address indexed wallet, bytes32 indexed identityHash, address indexed admin);
    event IdentityVerified(bytes32 indexed identityHash, address indexed verifier);

    /**
     * @dev Sets the address of the RBAC contract.
     */
    constructor(address _rbacAddress) {
        require(_rbacAddress != address(0), "Identity: Invalid RBAC contract address");
        _rbac = RBAC(_rbacAddress);
    }

    /**
     * @dev Modifier to restrict function access to admins only.
     */
    modifier onlyAdmin() {
        require(_rbac.hasRole(ADMIN_ROLE, msg.sender), "Identity: Caller is not an admin");
        _;
    }

    /**
     * @dev Registers a new identity, linking a wallet address to an identity hash.
     * Can only be called by an address with the ADMIN_ROLE.
     * Emits an {IdentityRegistered} event.
     */
    function registerIdentity(address _wallet, bytes32 _identityHash) external onlyAdmin {
        require(_wallet != address(0), "Identity: Wallet address cannot be zero");
        require(_identityHash != bytes32(0), "Identity: Hash cannot be zero");
        require(_addressToIdentity[_wallet] == bytes32(0), "Identity: Address already registered");
        require(_identityToAddress[_identityHash] == address(0), "Identity: Hash already registered");

        _addressToIdentity[_wallet] = _identityHash;
        _identityToAddress[_identityHash] = _wallet;

        emit IdentityRegistered(_wallet, _identityHash, msg.sender);
    }

    /**
     * @dev Marks an identity as verified. This could be used after on-device checks.
     * Can only be called by an address with the ADMIN_ROLE.
     * Emits an {IdentityVerified} event.
     */
    function setVerifiedStatus(bytes32 _identityHash, bool _status) external onlyAdmin {
        require(_identityToAddress[_identityHash] != address(0), "Identity: Hash not registered");
        _isVerified[_identityHash] = _status;
        emit IdentityVerified(_identityHash, msg.sender);
    }

    /**
     * @dev Returns the identity hash linked to a given address.
     */
    function getIdentity(address _wallet) public view returns (bytes32) {
        return _addressToIdentity[_wallet];
    }

    /**
     * @dev Returns the address linked to a given identity hash.
     */
    function getWallet(bytes32 _identityHash) public view returns (address) {
        return _identityToAddress[_identityHash];
    }

    /**
     * @dev Checks if an address is already registered.
     */
    function isRegistered(address _wallet) public view returns (bool) {
        return _addressToIdentity[_wallet] != bytes32(0);
    }

    /**
     * @dev Checks if an identity hash is verified.
     */
    function isVerified(bytes32 _identityHash) public view returns (bool) {
        return _isVerified[_identityHash];
    }
}
