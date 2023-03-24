//SPDX-License-Identifier: GPL-3.0-or-later
pragma solidity ^0.8.17;

import "./INationCred.sol";

/**
 * @notice Stores the passport IDs of active Nation3 citizens.
 */
contract NationCred is INationCred {
    address public owner;

    mapping(uint16 => bool) public activeCitizens;
    uint16[] public passportIDs;

    constructor() {
        owner = address(msg.sender);
    }

    function setOwner(address owner_) public {
        require(msg.sender == owner, "Only the owner can call this function");
        owner = owner_;
    }

    function setActiveCitizens(uint16[] calldata updatedPassportIDs) public {
        require(msg.sender == owner, "Only the owner can call this function");
        for (uint16 i = 0; i < passportIDs.length; i++) {
            activeCitizens[passportIDs[i]] = false;
        }
        for (uint16 i = 0; i < updatedPassportIDs.length; i++) {
            activeCitizens[updatedPassportIDs[i]] = true;
        }
        passportIDs = updatedPassportIDs;
    }

    function isActive(uint16 passportID) public view returns (bool) {
        return activeCitizens[passportID];
    }
}
