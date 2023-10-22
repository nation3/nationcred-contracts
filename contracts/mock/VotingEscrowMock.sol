//SPDX-License-Identifier: GPL-3.0-or-later
pragma solidity ^0.8.19;

import "../governance/IVotingEscrow.sol";
import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "hardhat/console.sol";

contract VotingEscrowMock is ERC20, IVotingEscrow {
    mapping(address => LockedBalance) locks;

    constructor() ERC20("Vote-escrowed NATION", "veNATION") {
        _mint(msg.sender, 100 * 1e18);
    }

    function create_lock(int128 _value, uint256 _unlock_time) public {
        console.log("create_lock");
        console.log("uint256(int256(_value)):", uint256(int256(_value)));
        console.log("_unlock_time:", _unlock_time);
        LockedBalance memory lockedBalance = LockedBalance({
            amount: _value,
            end: _unlock_time
        });
        locks[msg.sender] = lockedBalance;
    }

    function locked(
        address account
    ) public view returns (LockedBalance memory lockedBalance) {
        return locks[account];
    }
}
