//SPDX-License-Identifier: GPL-3.0-or-later
pragma solidity ^0.8.19;

import {IPassportUtils} from "../utils/IPassportUtils.sol";

contract DiscourseUsernames {
    string public constant VERSION = "0.6.7";
    address public owner;
    mapping(address => string) public usernames;
    IPassportUtils public passportUtils;

    error NotPassportOwner(address illegalAlien);
    error PassportExpired(address citizen);

    event UsernameUpdated(address citizen, string username);

    constructor(address passportUtils_) {
        owner = address(msg.sender);
        passportUtils = IPassportUtils(passportUtils_);
    }

    function setOwner(address owner_) public {
        require(msg.sender == owner, "You are not the owner");
        owner = owner_;
    }

    function setPassportUtils(address passportUtils_) public {
        require(msg.sender == owner, "You are not the owner");
        passportUtils = IPassportUtils(passportUtils_);
    }

    function updateUsername(string calldata username) public {
        if (!passportUtils.isOwner(msg.sender)) {
            revert NotPassportOwner(msg.sender);
        }
        if (passportUtils.isExpired(msg.sender)) {
            revert PassportExpired(msg.sender);
        }
        usernames[msg.sender] = username;
        emit UsernameUpdated(msg.sender, username);
    }
}
