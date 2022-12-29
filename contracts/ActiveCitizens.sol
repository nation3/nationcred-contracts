// SPDX-License-Identifier: MIT
pragma solidity ^0.8.17;

import "@openzeppelin/contracts/access/Ownable.sol";

contract ActiveCitizens is Ownable {
    address[] citizens;

    /**
     * @notice push an address to the array
     * @dev if the address already exists, it should not be added again
     */
    function _addCitizen(address addr) private onlyOwner {
        citizens.push(addr);
    }


    /**
     * @notice check if citizen already exist on the active citizen list.
     */
    function exists() internal view returns (bool) {}

    /**
     * @notice remove an address from the array
     */
    function _removeCitizen(address addr) private onlyOwner {}

    function viewActiveCitizen() public view returns (address[] memory) {}
}
