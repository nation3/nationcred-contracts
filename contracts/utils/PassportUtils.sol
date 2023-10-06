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
}
