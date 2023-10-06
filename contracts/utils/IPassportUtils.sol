//SPDX-License-Identifier: GPL-3.0-or-later
pragma solidity ^0.8.17;

interface IPassportUtils {
    /**
     * Returns `true` if a citizen's passport has become revocable.
     *
     * @param citizen The address of an NFT passport's owner
     */
    function isExpired(address citizen) external view returns (bool);

    // /**
    //  * Returns the Unix epoch time when the passport will become revocable.
    //  *
    //  * @param passportID The NFT passport ID
    //  */
    // function getExpirationTime(uint16 passportID) external view returns (uint256);
}
