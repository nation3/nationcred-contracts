//SPDX-License-Identifier: GPL-3.0-or-later
pragma solidity ^0.8.19;

import {IPassportUtils} from "./utils/IPassportUtils.sol";

contract GitHubUsernames {
    string public constant VERSION = "0.6.3";
    mapping(address => string) public usernames;
    IPassportUtils public passportUtils;

    error PassportExpired(address citizen);

    event UsernameUpdated(address citizen, string username);

    constructor(address passportUtils_) {
        passportUtils = IPassportUtils(passportUtils_);
    }

    function updateUsername(string calldata username) public {
        if (passportUtils.isExpired(msg.sender)) {
            revert PassportExpired(msg.sender);
        } else {
            usernames[msg.sender] = username;
            emit UsernameUpdated(msg.sender, username);
        }
    }
}
