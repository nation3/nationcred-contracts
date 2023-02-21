//SPDX-License-Identifier: GPL-3.0-or-later
pragma solidity ^0.8.17;

import "@openzeppelin/contracts/utils/cryptography/MerkleProof.sol";
import "@openzeppelin/contracts/access/AccessControl.sol";
import {IPassport} from "./interfaces/IPassport.sol";
import {INationCred} from "./interfaces/INationCred.sol";

/// @notice Citizen profile data
struct Profile {
    string discord;
    string twitter;
    string github;
    string forum;
}

contract NationCred is AccessControl {
    // -------------------------------------------------------------------- //
    //                                Storage                               //
    // -------------------------------------------------------------------- //

    /// @notice The role required to update the merkle root
    bytes32 private constant UPDATER_ROLE = keccak256("UPDATER_ROLE");

    /// @notice Merkle Tree root hash
    bytes32 private rootHash;

    /// @notice Passport Contract
    IPassport private constant passport =
        IPassport(0x3337dac9F251d4E403D6030E18e3cfB6a2cb1333);

    /// @notice Passport Ids -> Profiles
    mapping(uint256 => Profile) public profiles;

    // -------------------------------------------------------------------- //
    //                            Errors & Events                           //
    // -------------------------------------------------------------------- //

    /// @notice The caller is not the owner or signer of the passport
    error NotOwnerOrSigner();

    /// @notice The caller is not the updater
    error NotUpdater();

    /// @notice Called when a profile is updated
    event ProfileUpdated(uint256 passportId, Profile profile);

    /// @notice Called when a proof is stored
    event ProofStored(bytes32 merkleTree);

    // -------------------------------------------------------------------- //
    //                                Functions                             //
    // -------------------------------------------------------------------- //

    /// @notice Constructor
    constructor() {
        _setupRole(DEFAULT_ADMIN_ROLE, msg.sender);
        _setupRole(UPDATER_ROLE, msg.sender);
    }

    /// @notice Update a citizen profile
    /// @param _passportId The passport id
    /// @param _profile The profile data
    function updateProfile(
        uint256 _passportId,
        Profile calldata _profile
    ) external {
        if (
            msg.sender != passport.ownerOf(_passportId) ||
            msg.sender != passport.signerOf(_passportId)
        ) revert NotOwnerOrSigner();

        profiles[_passportId] = _profile;

        emit ProfileUpdated(_passportId, _profile);
    }

    /// @notice Store a new merkle tree root hash
    /// @param _newRoot The new merkle tree root hash
    function storeProof(bytes32 _newRoot) external {
        if (!hasRole(UPDATER_ROLE, msg.sender)) revert NotUpdater();
        rootHash = _newRoot;
    }

    //  @inheritdoc INationCred
    function isActive(
        uint256 _id,
        bytes32[] calldata _proof
    ) external view returns (bool) {
        bytes32 leaf = keccak256(abi.encodePacked(_id));
        return MerkleProof.verify(_proof, rootHash, leaf);
    }
}
