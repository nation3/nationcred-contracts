// SPDX-License-Identifier: MIT
pragma solidity ^0.8.21;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "hardhat/console.sol";

contract PassportMock is ERC721, Ownable {
    uint256 private _tokenIdCounter;

    constructor()
        ERC721("Nation3 Genesis Passport", "PASS3")
        Ownable(msg.sender)
    {}

    function safeMint(address to) public onlyOwner {
        console.log("safeMint");
        uint256 tokenId = _tokenIdCounter;
        _tokenIdCounter++;
        _safeMint(to, tokenId);
    }
}
