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
npx hardhat run scripts/deploy-<contract>.ts --network sepolia
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
npx hardhat run scripts/deploy-<contract>.ts --network mainnet
```

```
npx hardhat verify --network mainnet <address> <parameters>
```

## Deployments

### Goerli

- utils/PassportUtils.sol: `0xad42FC3fE04add6B4D177188E3B41677f03703a7`
- GitHubUsernames.sol: `0x1bDa420e57059FB7C97B13DE7F7Dd719371E0291`
- Discord.sol: `0x4BD52941D5C14035F49C93ab6EB3878DDa063119`

### Sepolia

- utils/PassportUtils.sol: `0x90EC93e8B5948b1F7759692fB3082ACd3abDa3F8`
- NationCred.sol: `0xff5F7A95D6dd29a0543f661a148ba1B9ac554763`

### Mainnet

- GitHub.sol: `0xB989C0C17a3Bce679D7586d9e55B6Eab11c18687`
- Discord.sol: `0x3415f4ffb9f89fba0ab446da4a78223e4cd73bad`
- Discourse.sol: `0xC396F3536Cc67913bbE1e5E454c10BBA4ae8928F`
- NationCred.sol: `0x7794F0Eb1eA812fBcdaBD559551Fb26A79720925`
