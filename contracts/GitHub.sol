//SPDX-License-Identifier: GPL-3.0-or-later
pragma solidity ^0.8.17;

import { IVotingEscrow } from "./governance/IVotingEscrow.sol";

contract GitHub {
    mapping(address => string) public usernames;
    IVotingEscrow public veToken;

    constructor(address veToken_) {
        veToken = IVotingEscrow(veToken_);
    }

    function updateUsername(string calldata username) public {
        usernames[msg.sender] = username;
    }
}
