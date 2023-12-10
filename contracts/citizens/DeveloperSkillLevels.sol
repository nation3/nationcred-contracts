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
    mapping(address => uint256) public skillLevels;
    IPassportUtils public passportUtils;

    error PassportExpired(address citizen);
    error RatingValueError(uint8 rating);

    event Rated(address developer, uint8 rating, address citizen);

    constructor(address passportUtils_) {
        passportUtils = IPassportUtils(passportUtils_);
    }

    /**
     * @notice Rate a developer's skills, on a scale from 1 to 5.
     */
    function rate(address developer, uint8 rating) public {
        if (passportUtils.isExpired(msg.sender)) {
            revert PassportExpired(msg.sender);
        }
        if ((rating != 1) && (rating != 2) && (rating != 3) && (rating != 4) && (rating != 5)) {
            revert RatingValueError(rating);
        }
        uint256 ratingInGwei = rating * 1 ether;
        if (skillLevels[developer] == 0) {
            skillLevels[developer] = ratingInGwei;
        } else {
            skillLevels[developer] = (skillLevels[developer] + ratingInGwei) / 2;
        }
        emit Rated(developer, rating, msg.sender);
    }
}
