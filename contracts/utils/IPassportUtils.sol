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
     * Returns the Unix epoch time when a citizen's passport will become revocable.
     *
     * @param citizen The address of an NFT passport's owner
     */
    function getExpirationTimestamp(
        address citizen
    ) external view returns (uint256);

    /**
     * Calculates the Unix epoch time when vote-escrowed `$NATION` will drop below a given threshold.
     *
     * @param lockAmount The amount of `$NATION` tokens that were locked
     * @param lockEnd The lock expiration date in seconds
     * @param votingEscrowThreshold The vote-escrowed `$NATION` balance when a passport will become revocable
     */
    function calculateThresholdTimestamp(
        uint256 lockAmount,
        uint256 lockEnd,
        uint256 votingEscrowThreshold
    ) external view returns (uint256);
}
