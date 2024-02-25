// SPDX-License-Identifier: GPL-3.0-or-later
pragma solidity ^0.8.20;

import {AttestationRequest, AttestationRequestData} from "@ethereum-attestation-service/eas-contracts/contracts/EAS.sol";
import "hardhat/console.sol";

contract EASMock {
    function attest(
        AttestationRequest calldata request
    ) external payable returns (bytes32) {
        console.log("attest");
        AttestationRequestData[] memory data = new AttestationRequestData[](1);
        data[0] = request.data;

        // return _attest(request.schema, data, msg.sender, msg.value, true).uids[0];
        return 0;
    }
}
