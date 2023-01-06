//SPDX-License-Identifier: GPL-3.0-or-later
pragma solidity ^0.8.17;

interface INationCred {
    /**
     * Returns `true` if the account belongs to an active Nation3 Citizen; `false` otherwise.
     *
     * @param account The NFT passport owner address
     */
    function isActive(address account) external view returns (bool);
}
