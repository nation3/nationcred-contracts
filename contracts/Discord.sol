//SPDX-License-Identifier: GPL-3.0-or-later
pragma solidity ^0.8.17;

contract Discord {
    mapping(address => string) public usernames;

    function updateUsername(string calldata username) public {
        usernames[msg.sender] = username;
    }
}
