//SPDX-License-Identifier: GPL-3.0-or-later
pragma solidity 0.8.19;

import { IPassportUtils } from "../utils/IPassportUtils.sol";
import "hardhat/console.sol";

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
    mapping(address => uint8) public skillLevelRatingsCount;
    mapping(address => uint256) public skillLevelRatingsSum;
    mapping(address => mapping(address => uint8)) public skillLevelRatings;
    IPassportUtils public passportUtils;

    error PassportExpired(address citizen);
    error RatingValueError(uint8 rating);

    event Rated(address developer, uint8 rating, address citizen);

    constructor(address passportUtils_) {
        passportUtils = IPassportUtils(passportUtils_);
    }

    /**
     * @notice Rate a developer's skills, on a scale from 1 to 5.
     * @dev Only citizens with a valid passport can rate developers.
     */
    function rate(address developer, uint8 rating) public {
        if (passportUtils.isExpired(msg.sender)) {
            revert PassportExpired(msg.sender);
        }
        if ((rating != 1) && (rating != 2) && (rating != 3) && (rating != 4) && (rating != 5)) {
            revert RatingValueError(rating);
        }

        uint256 ratingInGwei = rating * 1 ether;

        // Check if the citizen has rated this developer previously
        bool isFirstTimeRating = true;
        if (skillLevelRatings[developer][msg.sender] != 0) {
            isFirstTimeRating = false;
        }
        console.log("isFirstTimeRating:", isFirstTimeRating);

        // Calculate the developer's new skill rating average
        uint256 newSkillLevelAverage;
        if (isFirstTimeRating) {
            // First time this citizen rates this developer
            if (skillLevels[developer] == 0) {
                // 1st rating for this developer
                skillLevelRatingsCount[developer] = 1;
                skillLevelRatingsSum[developer] = ratingInGwei;
                newSkillLevelAverage = ratingInGwei;
            } else {
                // 2nd+ rating for this developer
                skillLevelRatingsCount[developer] += 1;
                skillLevelRatingsSum[developer] += ratingInGwei;
                newSkillLevelAverage = skillLevelRatingsSum[developer] / skillLevelRatingsCount[developer];
            }
        } else {
            // 2nd+ time this citizen rates this developer
            uint256 previousRatingInGwei = skillLevelRatings[developer][msg.sender] * 1 ether;
            console.log("previousRatingInGwei:", previousRatingInGwei);
            if (previousRatingInGwei != ratingInGwei) {
                // Replace previous rating with new rating
                skillLevelRatingsSum[developer] -= previousRatingInGwei;
                skillLevelRatingsSum[developer] += ratingInGwei;
            }
            newSkillLevelAverage = skillLevelRatingsSum[developer] / skillLevelRatingsCount[developer];
        }
        console.log("skillLevels[developer]:", skillLevels[developer]);
        console.log("skillLevelRatingsSum[developer]:", skillLevelRatingsSum[developer]);
        console.log("skillLevelRatingsCount[developer]:", skillLevelRatingsCount[developer]);
        console.log("newSkillLevelAverage:", newSkillLevelAverage);

        skillLevels[developer] = newSkillLevelAverage;
        skillLevelRatings[developer][msg.sender] = rating;
        emit Rated(developer, rating, msg.sender);
    }
}
