//SPDX-License-Identifier: GPL-3.0-or-later
pragma solidity ^0.8.19;

import "../passport/IPassportIssuer.sol";

contract PassportIssuerMock is IPassportIssuer {
    function revokeUnderBalance() public view returns (uint256) {
        return 1.5 * 1e18;
    }
}
