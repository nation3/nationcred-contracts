// SPDX-License-Identifier: MIT
pragma solidity ^0.8.17;

import "@openzeppelin/contracts/access/Ownable.sol";

contract ActiveCitizens is Ownable {
    address[] citizens;

    constructor() {
    }

    function _addCitizen(address addr) private onlyOwner() {
        citizens.push(addr);
    }

    function _removeCitizen(address addr) private onlyOwner() {

    }

    function viewActiveCitizen() public view returns (address[] memory) {

    }
}