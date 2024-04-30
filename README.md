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

[![codecov](https://codecov.io/gh/nation3/nationcred-contracts/graphs/icicle.svg?token=QTWCMDDWWY)](https://codecov.io/gh/nation3/nationcred-contracts)

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

### Sepolia (`v0.7.0`)

https://github.com/nation3/foundations/blob/main/deployments/sepolia.json

[`deployments/sepolia.json`](./deployments/sepolia.json)

- `citizens/`

  - `DeveloperSkillLevels.sol`
  - `OperatorSkillLevels.sol`
  - `MarketeerSkillLevels.sol`

  - `DiscordUsernames`
  - `DiscourseUsernames`
  - `GitHubUsernames`

- `rewards/`

  - `DevGuildRewardsDistributor.sol`
  - `OpsGuildRewardsDistributor.sol`

- `utils/`

  - `PassportUtils.sol`

- `NationCred.sol`

### Mainnet (`v0.7.0`)

https://github.com/nation3/foundations/blob/main/deployments/mainnet.json

[`deployments/sepolia.json`](./deployments/sepolia.json)

- `citizens/`

  - `DeveloperSkillLevels.sol`
  - `OperatorSkillLevels.sol`

  - `Discord.sol`
  - `Discourse.sol`
  - `GitHubUsernames.sol`

- `utils/`

  - `PassportUtils.sol`

- `NationCred.sol`

### npm (`v0.7.0`)

https://www.npmjs.com/package/@nation3/nationcred-contracts

```
cd contracts
npm adduser
npm publish --access public
```

After publishing, bump the version in `package.json` and the `VERSION` constant in each smart contract.
