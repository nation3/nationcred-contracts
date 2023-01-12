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
export REPORT_GAS=true
```

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
npx istanbul check-coverage --lines 80
```

## Linters

Run ESLint:

```
npx eslint '**/*.{js,ts}' --fix
```

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
npx hardhat run scripts/deploy-<contract>.ts --network goerli
```

```
npx hardhat verify --network goerli <address>
```

## Deploy to Main Network

Set the `MAINNET_URL` in `.env`.

```
npx hardhat run scripts/deploy-<contract>.ts --network mainnet
```

```
npx hardhat verify --network mainnet <address>
```

## Deployments

### Goerli

- GitHub.sol: `0x7a0e37e6e64d4fc59207c163e0176e22a4072503`
- Discord.sol: `0xa8048ED1F7123018E3f149E99a3Ef83e0Ec4A744`

### Mainnet

- GitHub.sol: `0xB989C0C17a3Bce679D7586d9e55B6Eab11c18687`
