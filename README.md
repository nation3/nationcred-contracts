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

### Sepolia (`v0.6.6`)

https://github.com/nation3/foundations/blob/main/deployments/sepolia.json

- `citizens/DeveloperSkillLevels.sol`: [`0xF7639A56A63a3373E235062273C463eF6203101D`](https://sepolia.etherscan.io/address/0xF7639A56A63a3373E235062273C463eF6203101D)
- `citizens/OperatorSkillLevels.sol`: [`0xd5199a4bc8E9159A9f5F739034071a5F3ddB71b9`](https://sepolia.etherscan.io/address/0xd5199a4bc8E9159A9f5F739034071a5F3ddB71b9)
- `citizens/MarketeerSkillLevels.sol`: [`0x0360Fb7f6C37Dc68046124ba029CAeee8Fd124D9`](https://sepolia.etherscan.io/address/0x0360Fb7f6C37Dc68046124ba029CAeee8Fd124D9)

- `citizens/DiscordUsernames`: [`0xb3104BB77eEba2Ee3B271212fE022B1C32C83226`](https://sepolia.etherscan.io/address/0xb3104BB77eEba2Ee3B271212fE022B1C32C83226)
- `citizens/DiscourseUsernames`: [`0xc8Ac7573466c157564fEf5a1393f878aB72fc58B`](https://sepolia.etherscan.io/address/0xc8Ac7573466c157564fEf5a1393f878aB72fc58B)
- `citizens/GitHubUsernames`: [`0xAbf34EDabdbA328dAcD7975E7d505812129784d6`](https://sepolia.etherscan.io/address/0xAbf34EDabdbA328dAcD7975E7d505812129784d6)

- `rewards/DevGuildRewardsDistributor.sol`: [`0xD86272F30AF4f9221D2d28547F125B061eB8Ef05`](https://sepolia.etherscan.io/address/0xD86272F30AF4f9221D2d28547F125B061eB8Ef05)
- `rewards/OpsGuildRewardsDistributor.sol`: [`0xf4c8fBB8Ba3eB841210418bcDf0BD9bE5fBb3485`](https://sepolia.etherscan.io/address/0xf4c8fBB8Ba3eB841210418bcDf0BD9bE5fBb3485)

- `utils/PassportUtils.sol`: [`0x4C72e8f37a2652BA6eEE956Ab30Ff21C3514cb5a`](https://sepolia.etherscan.io/address/0x4C72e8f37a2652BA6eEE956Ab30Ff21C3514cb5a)

- `NationCred.sol`: [`0x0EF98EaE3021B91Cc84E0dd59BAA35cB59981E42`](https://sepolia.etherscan.io/address/0x0EF98EaE3021B91Cc84E0dd59BAA35cB59981E42)

#### Ethereum Attestation Service (EAS)

EAS schema for `citizens/DeveloperSkillLevels.sol`, `citizens/OperatorSkillLevels.sol`, `citizens/MarketeerSkillLevels.sol`:
https://sepolia.easscan.org/schema/view/0x8233d9319f24851e27b79cd7c3afe2e22a125b722435733d8b428b85d6e2ab8b

### Mainnet

https://github.com/nation3/foundations/blob/main/deployments/mainnet.json

- `citizens/GitHubUsernames.sol`: [`0xB989C0C17a3Bce679D7586d9e55B6Eab11c18687`](https://sepolia.etherscan.io/address/0xB989C0C17a3Bce679D7586d9e55B6Eab11c18687)
- `citizens/Discord.sol`: [`0x3415f4ffb9f89fba0ab446da4a78223e4cd73bad`](https://sepolia.etherscan.io/address/0x3415f4ffb9f89fba0ab446da4a78223e4cd73bad)
- `citizens/Discourse.sol`: [`0xC396F3536Cc67913bbE1e5E454c10BBA4ae8928F`](https://sepolia.etherscan.io/address/0xC396F3536Cc67913bbE1e5E454c10BBA4ae8928F)

- NationCred.sol: `0x7794F0Eb1eA812fBcdaBD559551Fb26A79720925`

## npm

https://www.npmjs.com/package/@nation3/nationcred-contracts

```
cd contracts
npm adduser
npm publish --access public
```

After publishing, bump the version in `package.json` and the `VERSION` constant in each smart contract.
