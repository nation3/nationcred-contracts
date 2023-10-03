//SPDX-License-Identifier: GPL-3.0-or-later
pragma solidity ^0.8.17;

import {INationCred} from "./INationCred.sol";
import {IERC721} from "@openzeppelin/contracts/interfaces/IERC721.sol";

/**
 * @notice Stores the passport IDs of active Nation3 citizens.
 */
contract NationCred is INationCred {
    address public owner;
    IERC721 public passport;
    uint16[] private passportIDs;

    constructor() {
        owner = address(msg.sender);
        passport = IERC721(0x3337dac9F251d4E403D6030E18e3cfB6a2cb1333);
    }

    function setOwner(address owner_) public {
        require(msg.sender == owner, "You are not the owner");
        owner = owner_;
    }

    function setActiveCitizens(uint16[] calldata passportIDs_) public {
        require(msg.sender == owner, "You are not the owner");
        passportIDs = passportIDs_;
    }

    function isActive(uint16 passportID) public view returns (bool) {
        for (uint16 i = 0; i < passportIDs.length; i++) {
            if (passportIDs[i] == passportID) {
                return true;
            }
        }
        return false;
    }

    function isActiveByAddress(address citizen) public view returns (bool) {
        for (uint16 i = 0; i < passportIDs.length; i++) {
            uint256 passportID = passportIDs[i];
            address passportOwner = passport.ownerOf(passportID);
            if (passportOwner == citizen) {
                return true;
            }
        }
        return false;
    }
}
