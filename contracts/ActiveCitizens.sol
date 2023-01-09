// SPDX-License-Identifier: MIT
pragma solidity ^0.8.17;

// To-Do: Change access control mechanism
// import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/cryptography/MerkleProof.sol";

contract ActiveCitizens {
    bytes32 public root;

    // address[] citizens;

    constructor(bytes32 _root) {
        root = _root;
    }

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
    //     // not the best solution for array that will grow indefinately
    //     return citizens;
    // }

    // function _leaf(address account) internal pure returns (bytes32) {
    //     return keccak256(abi.encodePacked(account));
    // }

    // function _verify(bytes32 leaf, bytes32[] memory proof)
    //     internal
    //     view
    //     returns (bool)
    // {
    //     return MerkleProof.verify(proof, root, leaf);
    // }

    function isValid(bytes32[] memory proof, bytes32 leaf)
        public
        view
        returns (bool)
    {
        return MerkleProof.verify(proof, root, leaf);
    }
}
