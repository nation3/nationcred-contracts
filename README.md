# NationCred Smart Contracts

Smart contracts used by the Nation3 [Citizen Directory](https://github.com/nation3/citizen-directory) and [Nation3 Basic Income](https://github.com/nation3/n3bi) (N3BI).

## Install Dependencies

```
npm install
```

## Build

```
npx hardhat clean
npx hardhat compile
```

## Unit Tests

Run unit tests:

```
npx hardhat test
```

### Code Coverage

[![codecov](https://codecov.io/gh/nation3/nationcred-contracts/branch/main/graph/badge.svg)](https://codecov.io/gh/nation3/nationcred-contracts)

Run code coverage:

```
npx hardhat coverage
```

Check if coverage threshold has been met:

```
npx istanbul check-coverage --lines 90
```

## Linting

Run Solhint:

```
npx solhint 'contracts/*.sol' --fix
```

## Prettier

Run Prettier:

```
npx prettier '**/*.{json,sol,md}' --check
npx prettier '**/*.{json,sol,md}' --write
```

## Local Ethereum Node

Start a local Ethereum network node:

```
npx hardhat node
```

This will start Hardhat Network, and expose it as a JSON-RPC and Websocket server at http://127.0.0.1:8545/.

## Deploy to Local Ethereum Node

```
npx hardhat run scripts/deploy-<contract>.ts
```

## Deploy to Test Network

Add an `.env` file, and set the variables:

```
cp .env.example .env
```

```
npx hardhat run --network sepolia scripts/deploy-<contract>.ts
```

```
npx hardhat verify --network sepolia <address>
```

## Deploy to Main Network

Add an `.env` file, and set the variables:

```
cp .env.example .env
```

```
npx hardhat run --network mainnet scripts/deploy-<contract>.ts
```

```
npx hardhat verify --network mainnet <address> <parameters>
```

## Deployments

### Sepolia (`v0.6.8`)

https://github.com/nation3/foundations/blob/main/deployments/sepolia.json

- `citizens/`

  - `DeveloperSkillLevels.sol`: [`0xF7639A56A63a3373E235062273C463eF6203101D`](https://sepolia.etherscan.io/address/0xF7639A56A63a3373E235062273C463eF6203101D)
  - `OperatorSkillLevels.sol`: [`0xd5199a4bc8E9159A9f5F739034071a5F3ddB71b9`](https://sepolia.etherscan.io/address/0xd5199a4bc8E9159A9f5F739034071a5F3ddB71b9)
  - `MarketeerSkillLevels.sol`: [`0x0360Fb7f6C37Dc68046124ba029CAeee8Fd124D9`](https://sepolia.etherscan.io/address/0x0360Fb7f6C37Dc68046124ba029CAeee8Fd124D9)

  - `DiscordUsernames`: [`0x0E9866Eb4E0a2Eac5D65282837E24D8065b53316`](https://sepolia.etherscan.io/address/0x0E9866Eb4E0a2Eac5D65282837E24D8065b53316)
  - `DiscourseUsernames`: [`0xC94aF6DBE897b8b887d71d0740708012323Fb8C1`](https://sepolia.etherscan.io/address/0xC94aF6DBE897b8b887d71d0740708012323Fb8C1)
  - `GitHubUsernames`: [`0x3807908FDf7bE559C5bF21d349326da5cCE86692`](https://sepolia.etherscan.io/address/0x3807908FDf7bE559C5bF21d349326da5cCE86692)

- `rewards/`

  - `DevGuildRewardsDistributor.sol`: [`0xD86272F30AF4f9221D2d28547F125B061eB8Ef05`](https://sepolia.etherscan.io/address/0xD86272F30AF4f9221D2d28547F125B061eB8Ef05)
  - `OpsGuildRewardsDistributor.sol`: [`0xf4c8fBB8Ba3eB841210418bcDf0BD9bE5fBb3485`](https://sepolia.etherscan.io/address/0xf4c8fBB8Ba3eB841210418bcDf0BD9bE5fBb3485)

- `utils/`

  - `PassportUtils.sol`: [`0x68ADa619A2b806A2bEc8e3789FfBA206641c22ff`](https://sepolia.etherscan.io/address/0x68ADa619A2b806A2bEc8e3789FfBA206641c22ff)

- `NationCred.sol`: [`0x3C38FBe04C455eFaF762d00c400e1A6589f7269A`](https://sepolia.etherscan.io/address/0x3C38FBe04C455eFaF762d00c400e1A6589f7269A)

### Mainnet (`v0`)

https://github.com/nation3/foundations/blob/main/deployments/mainnet.json

- `citizens/`

  - `Discord.sol`: [`0x3415f4ffb9f89fba0ab446da4a78223e4cd73bad`](https://sepolia.etherscan.io/address/0x3415f4ffb9f89fba0ab446da4a78223e4cd73bad)
  - `Discourse.sol`: [`0xC396F3536Cc67913bbE1e5E454c10BBA4ae8928F`](https://sepolia.etherscan.io/address/0xC396F3536Cc67913bbE1e5E454c10BBA4ae8928F)
  - `GitHubUsernames.sol`: [`0xB989C0C17a3Bce679D7586d9e55B6Eab11c18687`](https://sepolia.etherscan.io/address/0xB989C0C17a3Bce679D7586d9e55B6Eab11c18687)

- `NationCred.sol`: [`0x7794F0Eb1eA812fBcdaBD559551Fb26A79720925`](https://etherscan.io/address/0x7794F0Eb1eA812fBcdaBD559551Fb26A79720925)

### npm (`v0.6.8`)

https://www.npmjs.com/package/@nation3/nationcred-contracts

```
cd contracts
npm adduser
npm publish --access public
```

After publishing, bump the version in `package.json` and the `VERSION` constant in each smart contract.
