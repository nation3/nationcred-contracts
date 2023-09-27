//SPDX-License-Identifier: GPL-3.0-or-later
pragma solidity ^0.8.17;

import { IVotingEscrow } from "./governance/IVotingEscrow.sol";

contract GitHub {
    mapping(address => string) public usernames;
    IVotingEscrow public veToken;

    error PassportExpired();

    constructor(address veToken_) {
        veToken = IVotingEscrow(veToken_);
    }

    function updateUsername(string calldata username) public {
        if (isPassportExpired(msg.sender)) {
            revert PassportExpired();
        } else {
            usernames[msg.sender] = username;
        }
    }

    function isPassportExpired(address passportOwner) public view returns (bool) {
        uint256 veTokenBalance = veToken.balanceOf(passportOwner);
        if (veTokenBalance < (1.5 * 1e18)) {
            return false;
        } else {
            return true;
        }
    }
}
