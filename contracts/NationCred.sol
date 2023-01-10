// SPDX-License-Identifier: MIT
pragma solidity ^0.8.17;

import "@openzeppelin/contracts/utils/cryptography/MerkleProof.sol";

/**
 * @title NationCred
 * @author Nation3
 * @notice This contract will store proof of active Nation3 citizens using Merkle Proof for allowlist
 */
contract NationCred {
    // Root hash generated from Merkle tree
    bytes32 public root;

    // address[] citizens;

    // /**
    //  * @notice push an address to nation3 active citizen array
    //  * @dev if the address already exists, it should not be added again
    //  */
    // function addCitizen(address addr) public onlyOwner {
    //     // Impliment a better way to add addresses. This isn't efficient
    //     citizens.push(addr);
    // }

    // /**
    //  * @notice check if citizen already exist on the active citizen list.
    //  */
    // function exists() private view returns (bool) {}

    // /**
    //  * @notice remove an address from the array
    //  */
    // function removeCitizen(address addr) public onlyOwner {}

    // /**
    //  * @notice view address of active citizens
    //  */
    // function viewActiveCitizen() public view returns (address[] memory) {
    //     // not the best solution for arrays that will grow indefinately
    //     return citizens;
    // }

    // TO-DO: Add access control with role and add modifier to function
    // TO-DO: Create root hash from merkle tree
    function updateRootHash(bytes32 _root) public {
        root = _root;
    }

    // leaf = hashed eth address per sender - this is where my issue is
    // in this case the citizens have to run this themselves
    function isValid(bytes32[] calldata proof) public view returns (bool) {
        bytes32 leaf = keccak256(abi.encodePacked(msg.sender));
        require(MerkleProof.verify(proof, root, leaf), "Incorrect proof");
        return true;
    }

    function isActiveCitizen(address account) external view returns (bool) {}
}
