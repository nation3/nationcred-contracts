//SPDX-License-Identifier: GPL-3.0-or-later
pragma solidity ^0.8.17;

import "./IPassportUtils.sol";

contract PassportUtils is IPassportUtils {
    function isExpired(uint16 passportID) public view returns (bool) {
        return true;
    }
}
