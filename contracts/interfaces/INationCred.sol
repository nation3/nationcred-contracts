//SPDX-License-Identifier: GPL-3.0-or-later
pragma solidity ^0.8.17;

interface INationCred {
    /// @param passportId The NFT passport id
    /// @return `true` if the account belongs to an active Nation3 Citizen; `false` otherwise.
    function isActive(uint256 passportId) external view returns (bool);
}
