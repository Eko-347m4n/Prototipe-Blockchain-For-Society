// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import "@openzeppelin/contracts/utils/Context.sol";

/**
 * @title Identity
 * @dev Contract for managing the link between a wallet address and a real-world identity hash (e.g., NIK/NIP).
 */
contract Identity is Context {
    // Mapping from an address to an identity hash
    mapping(address => bytes32) private _addressToIdentity;
    // Mapping from an identity hash to an address
    mapping(bytes32 => address) private _identityToAddress;

    event IdentityRegistered(address indexed wallet, bytes32 indexed identityHash);

    /**
     * @dev Registers a new identity, linking the sender's address to an identity hash.
     * Emits an {IdentityRegistered} event.
     *
     * Requirements:
     * - The sender's address must not already be registered.
     * - The identity hash must not already be registered.
     */
    function registerIdentity(bytes32 identityHash) external {
        address sender = _msgSender();
        require(identityHash != bytes32(0), "Identity: Hash cannot be zero");
        require(_addressToIdentity[sender] == bytes32(0), "Identity: Address already registered");
        require(_identityToAddress[identityHash] == address(0), "Identity: Hash already registered");

        _addressToIdentity[sender] = identityHash;
        _identityToAddress[identityHash] = sender;

        emit IdentityRegistered(sender, identityHash);
    }

    /**
     * @dev Returns the identity hash linked to a given address.
     */
    function getIdentity(address wallet) public view returns (bytes32) {
        return _addressToIdentity[wallet];
    }

    /**
     * @dev Returns the address linked to a given identity hash.
     */
    function getWallet(bytes32 identityHash) public view returns (address) {
        return _identityToAddress[identityHash];
    }

    /**
     * @dev Checks if an address is already registered.
     */
    function isRegistered(address wallet) public view returns (bool) {
        return _addressToIdentity[wallet] != bytes32(0);
    }
}
