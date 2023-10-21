//SPDX-License-Identifier: GPL-3.0-or-later
pragma solidity ^0.8.17;

import "./IPassportUtils.sol";
import "../passport/IPassportIssuer.sol";
import "@openzeppelin/contracts/token/ERC20/utils/SafeERC20.sol";
import "hardhat/console.sol";

contract PassportUtils is IPassportUtils {
    using SafeERC20 for IERC20;

    IPassportIssuer public passportIssuer;
    IERC20 public votingEscrow;

    constructor(address passportIssuerAddress, address votingEscrowAddress) {
        passportIssuer = IPassportIssuer(passportIssuerAddress);
        votingEscrow = IERC20(votingEscrowAddress);
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
        // TO DO
        return 0;
    }

    function calculateThresholdTimestamp(
        uint256 lockAmount,
        uint256 lockEnd,
        uint256 votingEscrowThreshold
    ) public view returns (uint256) {
        console.log('lockAmount:', lockAmount);
        console.log('lockEnd:', lockEnd);
        console.log('votingEscrowThreshold:', votingEscrowThreshold);

        uint256 maxLockPeriod = 4 * 365 days;
        console.log('maxLockPeriod:', maxLockPeriod);
        console.log('block.timestamp:', block.timestamp);
        uint256 secondsUntilUnlock = lockEnd - block.timestamp;
        console.log('secondsUntilUnlock:', secondsUntilUnlock);

        uint256 thresholdPercentageOfLocked = 100 ether * votingEscrowThreshold / lockAmount;
        console.log('thresholdPercentageOfLocked:', thresholdPercentageOfLocked);

        uint256 secondsFromThresholdToUnlock = maxLockPeriod * thresholdPercentageOfLocked / 100 ether;
        console.log('secondsFromThresholdToUnlock:', secondsFromThresholdToUnlock);

        return lockEnd - secondsFromThresholdToUnlock;
    }
}
