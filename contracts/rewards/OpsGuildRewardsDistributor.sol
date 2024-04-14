// SPDX-License-Identifier: GPL-3.0-or-later
pragma solidity ^0.8.25;

import {IPassportUtils} from "../utils/IPassportUtils.sol";
import {IERC20} from "@openzeppelin/contracts/token/ERC20/IERC20.sol";

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
contract OpsGuildRewardsDistributor {
    string public constant VERSION = "0.7.0";

    address public owner;
    IPassportUtils public passportUtils;
    IERC20 public rewardToken;
    uint64 public immutable CLIFF_VESTING_DATE;

    mapping(address => uint256) public claimable;
    uint256 public claimableTotal;

    mapping(address => uint256) public claimed;
    uint256 public claimedTotal;

    error NotPassportOwner(address illegalAlien);
    error PassportExpired(address citizen);
    error NotYetVestingDate(address citizen);

    constructor(
        address passportUtils_,
        address rewardToken_,
        uint64 CLIFF_VESTING_DATE_
    ) {
        owner = address(msg.sender);
        passportUtils = IPassportUtils(passportUtils_);
        rewardToken = IERC20(rewardToken_);
        CLIFF_VESTING_DATE = CLIFF_VESTING_DATE_;
    }

    function setOwner(address owner_) public {
        require(msg.sender == owner, "You are not the owner");
        owner = owner_;
    }

    function setPassportUtils(address passportUtils_) public {
        require(msg.sender == owner, "You are not the owner");
        passportUtils = IPassportUtils(passportUtils_);
    }

    function addReward(address citizen, uint256 amount) public {
        require(msg.sender == owner, "You are not the owner");
        claimable[citizen] += amount;
        claimableTotal += amount;
    }

    function claim() public {
        if (!passportUtils.isOwner(msg.sender)) {
            revert NotPassportOwner(msg.sender);
        }
        if (passportUtils.isExpired(msg.sender)) {
            revert PassportExpired(msg.sender);
        }
        if (CLIFF_VESTING_DATE > block.timestamp) {
            revert NotYetVestingDate(msg.sender);
        }

        uint256 claimableAmount = claimable[msg.sender];
        rewardToken.transfer(msg.sender, claimableAmount);

        claimable[msg.sender] = 0;
        claimableTotal -= claimableAmount;

        claimed[msg.sender] += claimableAmount;
        claimedTotal += claimableAmount;
    }
}
