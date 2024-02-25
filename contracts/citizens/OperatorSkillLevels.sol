// SPDX-License-Identifier: GPL-3.0-or-later
pragma solidity ^0.8.20;

import {IPassportUtils} from "../utils/IPassportUtils.sol";

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
contract OperatorSkillLevels {
    string public constant VERSION = "0.6.7";
    address public owner;
    mapping(address => uint256) public skillLevelAverages;
    mapping(address => uint8) public skillLevelRatingsCount;
    mapping(address => uint256) private skillLevelRatingsSum;
    mapping(address => mapping(address => uint8)) public skillLevelRatings;
    IPassportUtils public passportUtils;

    error NotPassportOwner(address illegalAlien);
    error PassportExpired(address citizen);
    error RatingValueError(uint8 rating);

    event Rated(address operator, uint8 rating, address citizen);

    constructor(address passportUtils_) {
        owner = address(msg.sender);
        passportUtils = IPassportUtils(passportUtils_);
    }

    function setOwner(address owner_) public {
        require(msg.sender == owner, "You are not the owner");
        owner = owner_;
    }

    function setPassportUtils(address passportUtils_) public {
        require(msg.sender == owner, "You are not the owner");
        passportUtils = IPassportUtils(passportUtils_);
    }

    /**
     * @notice Rate an operator's skills, on a scale from 1 to 5.
     * @dev Only citizens with a valid passport can rate operators.
     */
    function rate(address operator, uint8 rating) public {
        if (!passportUtils.isOwner(msg.sender)) {
            revert NotPassportOwner(msg.sender);
        }
        if (passportUtils.isExpired(msg.sender)) {
            revert PassportExpired(msg.sender);
        }
        if (
            (rating != 1) &&
            (rating != 2) &&
            (rating != 3) &&
            (rating != 4) &&
            (rating != 5)
        ) {
            revert RatingValueError(rating);
        }

        uint256 ratingInGwei = rating * 1 ether;

        if (skillLevelRatings[operator][msg.sender] == 0) {
            skillLevelRatingsCount[operator] += 1;
            skillLevelRatingsSum[operator] += ratingInGwei;
        } else {
            uint256 previousRatingInGwei = skillLevelRatings[operator][
                msg.sender
            ] * 1 ether;
            if (previousRatingInGwei != ratingInGwei) {
                skillLevelRatingsSum[operator] -= previousRatingInGwei;
                skillLevelRatingsSum[operator] += ratingInGwei;
            }
        }
        uint256 newSkillLevelAverage = skillLevelRatingsSum[operator] /
            skillLevelRatingsCount[operator];

        skillLevelAverages[operator] = newSkillLevelAverage;
        skillLevelRatings[operator][msg.sender] = rating;
        emit Rated(operator, rating, msg.sender);
    }
}
