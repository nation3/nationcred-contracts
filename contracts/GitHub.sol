//SPDX-License-Identifier: GPL-3.0-or-later
pragma solidity ^0.8.17;

import {IVotingEscrow} from "./governance/IVotingEscrow.sol";
import {IPassportUtils} from "./utils/IPassportUtils.sol";

contract GitHub {
    mapping(address => string) public usernames;
    IVotingEscrow public veToken;
    IPassportUtils public passportUtils;

    error PassportExpired();

    constructor(address veToken_, address passportUtils_) {
        veToken = IVotingEscrow(veToken_);
        passportUtils = IPassportUtils(passportUtils_);
    }

    function updateUsername(string calldata username) public {
        if (passportUtils.isExpired(msg.sender)) {
            revert PassportExpired();
        } else {
            usernames[msg.sender] = username;
        }
    }
}
