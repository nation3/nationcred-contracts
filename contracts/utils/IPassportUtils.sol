//SPDX-License-Identifier: GPL-3.0-or-later
pragma solidity ^0.8.17;

interface IPassportUtils {
    /**
     * Returns `true` if a citizen's passport has become revocable.
     *
     * @param citizen The address of an NFT passport's owner
     */
    function isExpired(address citizen) external view returns (bool);

    /**
     * Returns the Unix epoch timestamp when a citizen's passport will become revocable.
     *
     * @param citizen The address of an NFT passport's owner
     */
    function getExpirationTimestamp(
        address citizen
    ) external view returns (uint256);

    /**
     * Calculates the time when vote-escrowed `$NATION` will drop below the passport expiry threshold.
     */
    function calculateExpirationTimestamp(
        uint256 lockAmount,
        uint256 lockEnd
    ) external view returns (uint256);
}
