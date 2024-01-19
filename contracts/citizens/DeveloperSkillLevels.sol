// SPDX-License-Identifier: GPL-3.0-or-later
pragma solidity ^0.8.19;

import {IPassportUtils} from "../utils/IPassportUtils.sol";
import {IEAS, AttestationRequest, AttestationRequestData} from "@ethereum-attestation-service/eas-contracts/contracts/IEAS.sol";
import {NO_EXPIRATION_TIME, EMPTY_UID} from "@ethereum-attestation-service/eas-contracts/contracts/Common.sol";

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
    string public constant VERSION = "0.6.5";
    address public owner;
    mapping(address => uint256) public skillLevelAverages;
    mapping(address => uint8) public skillLevelRatingsCount;
    mapping(address => uint256) private skillLevelRatingsSum;
    mapping(address => mapping(address => uint8)) public skillLevelRatings;
    IPassportUtils public passportUtils;
    IEAS private immutable eas;
    bytes32 private immutable easSchemaUID;

    error NotPassportOwner(address illegalAlien);
    error PassportExpired(address citizen);
    error RatingValueError(uint8 rating);

    event Rated(address developer, uint8 rating, address citizen);

    constructor(address passportUtils_, address eas_, bytes32 easSchemaUID_) {
        owner = address(msg.sender);
        passportUtils = IPassportUtils(passportUtils_);
        eas = IEAS(eas_);
        easSchemaUID = easSchemaUID_;
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
     * @notice Rate a developer's skills, on a scale from 1 to 5.
     * @dev Only citizens with a valid passport can rate developers.
     */
    function rate(address developer, uint8 rating) public {
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

        if (skillLevelRatings[developer][msg.sender] == 0) {
            skillLevelRatingsCount[developer] += 1;
            skillLevelRatingsSum[developer] += ratingInGwei;
        } else {
            uint256 previousRatingInGwei = skillLevelRatings[developer][
                msg.sender
            ] * 1 ether;
            if (previousRatingInGwei != ratingInGwei) {
                skillLevelRatingsSum[developer] -= previousRatingInGwei;
                skillLevelRatingsSum[developer] += ratingInGwei;
            }
        }
        uint256 newSkillLevelAverage = skillLevelRatingsSum[developer] /
            skillLevelRatingsCount[developer];

        skillLevelAverages[developer] = newSkillLevelAverage;
        skillLevelRatings[developer][msg.sender] = rating;
        emit Rated(developer, rating, msg.sender);

        eas.attest(
            AttestationRequest({
                schema: easSchemaUID,
                data: AttestationRequestData({
                    recipient: developer,
                    expirationTime: NO_EXPIRATION_TIME,
                    revocable: false,
                    refUID: EMPTY_UID,
                    data: abi.encode("Developer", rating),
                    value: 0
                })
            })
        );
    }
}
