//SPDX-License-Identifier: GPL-3.0-or-later
pragma solidity ^0.8.17;

import "../governance/IVotingEscrow.sol";
import "@openzeppelin/contracts/token/ERC20/ERC20.sol";

contract VotingEscrowMock is ERC20, IVotingEscrow {
    constructor() ERC20("Vote-escrowed NATION", "veNATION") {
        _mint(msg.sender, 100 * 1e18);
    }

    function locked(
        address
    ) public view returns (LockedBalance memory lockedBalance) {
        LockedBalance memory lockedBalance = LockedBalance({
            amount: 1,
            end: block.timestamp
        });
        return lockedBalance;
    }
}
