//SPDX-License-Identifier: GPL-3.0-or-later
pragma solidity ^0.8.17;

contract Discord {
    mapping(address => string) public usernames;

    constructor() {
        // Include usernames that have been previously added to SourceCred
        usernames[0x4e3072f7b5C075EA5FdEb423DA95312C4B99dc22] = "Aahna Ashina#2568";
        usernames[0xEf736f0036647A1B6828c92A9fEe27a6DDC2B250] = "Anastasiya_Belyaeva ☁🇺🇳#6320";
        usernames[0xEdd000B7Db3cb8931d4E0cb1D0DBe6B947Ceb09A] = "JohnMark13#0838";
        usernames[0x327b0c1Ecd110651dC9994b6764b695c9cdC29bA] = "Luis Cuende ☁🇺🇳#3333";
        usernames[0xD153751aCDBB6c2c7645671dcC2Cef98A83F5327] = "raymond#2998";
        usernames[0x636d65212C815b93B8E5b069f7082169cec851b7] = "0xGallego#6035";
    }

    function updateUsername(string calldata username) public {
        usernames[msg.sender] = username;
    }
}
