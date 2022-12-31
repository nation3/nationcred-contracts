// SPDX-License-Identifier: MIT
pragma solidity ^0.8.17;

// To-Do: Change access control mechanism
import "@openzeppelin/contracts/access/Ownable.sol";

contract ActiveCitizens is Ownable {
    address[] private citizens;

    /**
     * @notice push an address to nation3 active citizen array
     * @dev if the address already exists, it should not be added again
     */
    function _addCitizen(address addr) public onlyOwner {
        // Impliment a better way to add addresses. This isn't gas efficient
        citizens.push(addr);
    }

    /**
     * @notice check if citizen already exist on the active citizen list.
     */
    function exists() internal view returns (bool) {}

    /**
     * @notice remove an address from the array
     */
    function _removeCitizen(address addr) private {}

    /**
     * @notice view address of active citizens
     */
    function viewActiveCitizen() public view returns (address[] memory) {
        // not the best solution for array that will grow indefinately
        return citizens;
    }
}
