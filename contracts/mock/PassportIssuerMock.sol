//SPDX-License-Identifier: GPL-3.0-or-later
pragma solidity ^0.8.20;

import "../passport/IPassportIssuer.sol";
import "./PassportMock.sol";
import "hardhat/console.sol";

contract PassportIssuerMock is IPassportIssuer {
    /// @dev Map the passport status of an account: (0) Not issued, (1) Issued, (2) Revoked.
    mapping(address => uint8) internal _status;

    function passportStatus(
        address account
    ) external view virtual returns (uint8) {
        return _status[account];
    }

    function revokeUnderBalance() public view returns (uint256) {
        return 1.5 * 1e18;
    }

    function claim() external virtual {
        console.log("claim");
        _issue(msg.sender);
    }

    /// @dev Mints a new passport token for the recipient.
    /// @param recipient Address to issue the passport to.
    function _issue(address recipient) internal virtual {
        console.log("_issue");
        _status[recipient] = 1;
    }
}
