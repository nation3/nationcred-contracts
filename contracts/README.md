# Nation3 NationCred Smart Contracts

A library for interacting with Nation3's NationCred smart contracts.

## Installation

```
npm install @nation3/nationcred-contracts
```

## Usage

```solidity
pragma solidity ^0.8.25;

import { IPassportUtils } from "@nation3/nationcred-contracts/utils/IPassportUtils.sol";

contract MyContract {
  IPassportUtils public passportUtils;

  constructor(address passportUtils_) {
    passportUtils = IPassportUtils(passportUtils_);
  }
}
```
