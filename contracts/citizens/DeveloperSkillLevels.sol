//SPDX-License-Identifier: GPL-3.0-or-later
pragma solidity 0.8.19;

import { IPassportUtils } from "../utils/IPassportUtils.sol";

/**
 *        ---------::::       
 *     ---------:---::::::    
 *   -----------::---:::::::  
 *  ------------:.:--:::::::: 
 * -------------: .:--::::::::
 * -------------:   .:::::::::
 * -------------:.......::::::
 * -----:..    .:-------::::::
 * --------:.. .:-------::::::
 * ----------:..:--------:::::
 *  -----------.:--------:::: 
 *   ----------::--------:::  
 *     -------------------    
 *        -------------       
 * 
 *         Nation3 DAO
 *     https://nation3.org
 */
contract DeveloperSkillLevels {
    mapping(address => uint8) public skillLevels;
    IPassportUtils public immutable passportUtils;

    error PassportExpired(address citizen);
    error RatingValueError(uint8 rating);

    constructor(address passportUtils_) {
        passportUtils = IPassportUtils(passportUtils_);
    }

    /**
     * @notice Rate a developer's skills, on a scale from 1 to 5.
     */
    function rate(address citizen, uint8 rating) public {
        if (passportUtils.isExpired(citizen)) {
            revert PassportExpired(msg.sender);
        }
        if ((rating != 1) && (rating != 2) && (rating != 3) && (rating != 4) && (rating != 5)) {
            revert RatingValueError(rating);
        }
        skillLevels[citizen] = rating;
    }
}
