// SPDX-License-Identifier: MIT
pragma solidity ^0.8.17;

interface IVotingEscrow {
    function balanceOf(address) external view returns (uint256);
}
