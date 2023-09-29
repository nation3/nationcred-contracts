//SPDX-License-Identifier: GPL-3.0-or-later
pragma solidity ^0.8.17;

interface IPassportUtils {
    // TO DO
    // isPassportOwner

    /**
     * Returns `true` if a citizen's vote-escrowed `$NATION` balance has
     * dropped below the passport expiry threshold; `false` otherwise.
     *
     * @param citizen The address of the passport owner
     */
    function isPassportExpired(address citizen) external view returns (bool);

    // TO DO
    // getPassportExpirationDate
}
