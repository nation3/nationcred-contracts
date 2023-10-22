//SPDX-License-Identifier: GPL-3.0-or-later
pragma solidity ^0.8.19;

import "./IPassportUtils.sol";
import "../passport/IPassportIssuer.sol";
import "../governance/IVotingEscrow.sol";
import "hardhat/console.sol";

contract PassportUtils is IPassportUtils {
    string public constant VERSION = "0.6.1";
    IPassportIssuer public passportIssuer;
    IVotingEscrow public votingEscrow;

    constructor(address passportIssuerAddress, address votingEscrowAddress) {
        passportIssuer = IPassportIssuer(passportIssuerAddress);
        votingEscrow = IVotingEscrow(votingEscrowAddress);
    }

    function isExpired(address citizen) public view returns (bool) {
        uint256 revokeUnderBalance = passportIssuer.revokeUnderBalance();
        console.log("revokeUnderBalance:", revokeUnderBalance);
        uint256 votingEscrowBalance = votingEscrow.balanceOf(citizen);
        console.log("votingEscrowBalance:", votingEscrowBalance);
        return votingEscrowBalance < revokeUnderBalance;
    }

    function getExpirationTimestamp(
        address citizen
    ) public view returns (uint256) {
        IVotingEscrow.LockedBalance memory lockedBalance = votingEscrow.locked(
            citizen
        );
        uint256 lockAmount = uint256(int256(lockedBalance.amount));
        console.log("lockAmount:", lockAmount);
        uint256 lockEnd = lockedBalance.end;
        console.log("lockEnd:", lockEnd);
        uint256 revokeUnderBalance = passportIssuer.revokeUnderBalance();
        console.log("revokeUnderBalance:", revokeUnderBalance);
        return
            calculateThresholdTimestamp(
                lockAmount,
                lockEnd,
                revokeUnderBalance
            );
    }

    function calculateThresholdTimestamp(
        uint256 lockAmount,
        uint256 lockEnd,
        uint256 votingEscrowThreshold
    ) public view returns (uint256) {
        console.log("lockAmount:", lockAmount);
        console.log("lockEnd:", lockEnd);
        console.log("votingEscrowThreshold:", votingEscrowThreshold);

        uint256 maxLockPeriod = 4 * 365 days;
        console.log("maxLockPeriod:", maxLockPeriod);
        console.log("block.timestamp:", block.timestamp);
        uint256 secondsUntilUnlock = lockEnd - block.timestamp;
        console.log("secondsUntilUnlock:", secondsUntilUnlock);

        uint256 thresholdPercentageOfLocked = (100 ether *
            votingEscrowThreshold) / lockAmount;
        console.log(
            "thresholdPercentageOfLocked:",
            thresholdPercentageOfLocked
        );

        uint256 secondsFromThresholdToUnlock = (maxLockPeriod *
            thresholdPercentageOfLocked) / 100 ether;
        console.log(
            "secondsFromThresholdToUnlock:",
            secondsFromThresholdToUnlock
        );

        return lockEnd - secondsFromThresholdToUnlock;
    }
}
