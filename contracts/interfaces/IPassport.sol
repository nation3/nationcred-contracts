//SPDX-License-Identifier: GPL-3.0-or-later
pragma solidity ^0.8.17;

interface IPassport {
    function ownerOf(uint256 tokenId) external view returns (address);

    function signerOf(uint256 tokenId) external view returns (address);
}
