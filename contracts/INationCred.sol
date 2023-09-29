//SPDX-License-Identifier: GPL-3.0-or-later
pragma solidity ^0.8.17;

interface INationCred {
    /**
     * Returns `true` if the passport ID belongs to an active Nation3 Citizen; `false` otherwise.
     *
     * @param passportID The NFT passport ID
     */
    function isActive(uint16 passportID) external view returns (bool);

    /**
     * Returns `true` if a citizen's vote-escrowed `$NATION` balance has dropped below the passport expiry threshold; `false` otherwise.
     *
     * @param citizen The address of the passport owner
     */
    function isPassportExpired(address citizen) external view returns (bool);
}
