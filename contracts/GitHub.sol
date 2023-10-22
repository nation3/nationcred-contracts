//SPDX-License-Identifier: GPL-3.0-or-later
pragma solidity ^0.8.17;

import {IPassportUtils} from "./utils/IPassportUtils.sol";

contract GitHub {
    mapping(address => string) public usernames;
    IPassportUtils public immutable passportUtils;

    error PassportExpired();

    event UsernameUpdated(address citizen, string username);

    constructor(address passportUtils_) {
        passportUtils = IPassportUtils(passportUtils_);
    }

    function updateUsername(string calldata username) public {
        if (passportUtils.isExpired(msg.sender)) {
            revert PassportExpired();
        } else {
            usernames[msg.sender] = username;
            emit UsernameUpdated(msg.sender, username);
        }
    }
}
