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

### Sepolia (`v0.6.9`)

https://github.com/nation3/foundations/blob/main/deployments/sepolia.json

- `citizens/`

  - `DeveloperSkillLevels.sol`: [`0x2BD5C377d848923d054E49D518D22b675a439d38`](https://sepolia.etherscan.io/address/0x2BD5C377d848923d054E49D518D22b675a439d38)
  - `OperatorSkillLevels.sol`: [`0x2Ea4ECa64479f9E5dCBEF08E1ea9f5E6ddb40072`](https://sepolia.etherscan.io/address/0x2Ea4ECa64479f9E5dCBEF08E1ea9f5E6ddb40072)
  - `MarketeerSkillLevels.sol`: [`0x927BD07dC44DAF4cb01DA901008c6088fD8Eaa0b`](https://sepolia.etherscan.io/address/0x927BD07dC44DAF4cb01DA901008c6088fD8Eaa0b)

  - `DiscordUsernames`: [`0xD105f567dA9d3F0c25F4c036c19Cf5E521987bD5`](https://sepolia.etherscan.io/address/0xD105f567dA9d3F0c25F4c036c19Cf5E521987bD5)
  - `DiscourseUsernames`: [`0xFF260Bc90f94087FCbd4939BD46d743F02B20B82`](https://sepolia.etherscan.io/address/0xFF260Bc90f94087FCbd4939BD46d743F02B20B82)
  - `GitHubUsernames`: [`0x6C31d70a6b20Ccd3DB454aFE1Bc4FB780C380F47`](https://sepolia.etherscan.io/address/0x6C31d70a6b20Ccd3DB454aFE1Bc4FB780C380F47)

- `rewards/`

  - `DevGuildRewardsDistributor.sol`: [`0xEa075d0B268e0BF5DDEF0E72640E4E7101868C14`](https://sepolia.etherscan.io/address/0xEa075d0B268e0BF5DDEF0E72640E4E7101868C14)
  - `OpsGuildRewardsDistributor.sol`: [`0x01155f6475186a14C227E5Ad727F9838094cFb61`](https://sepolia.etherscan.io/address/0x01155f6475186a14C227E5Ad727F9838094cFb61)

- `utils/`

  - `PassportUtils.sol`: [`0x88Ea3A3618A988783E39C2CadFdd77Dc07895b59`](https://sepolia.etherscan.io/address/0x88Ea3A3618A988783E39C2CadFdd77Dc07895b59)

- `NationCred.sol`: [`0x3C38FBe04C455eFaF762d00c400e1A6589f7269A`](https://sepolia.etherscan.io/address/0x3C38FBe04C455eFaF762d00c400e1A6589f7269A)

### Mainnet (`v0.6.9`)

https://github.com/nation3/foundations/blob/main/deployments/mainnet.json

- `citizens/`

  - `Discord.sol`: [`0x3415f4ffb9f89fba0ab446da4a78223e4cd73bad`](https://etherscan.io/address/0x3415f4ffb9f89fba0ab446da4a78223e4cd73bad)
  - `Discourse.sol`: [`0xC396F3536Cc67913bbE1e5E454c10BBA4ae8928F`](https://etherscan.io/address/0xC396F3536Cc67913bbE1e5E454c10BBA4ae8928F)
  - `GitHubUsernames.sol`: [`0xB989C0C17a3Bce679D7586d9e55B6Eab11c18687`](https://etherscan.io/address/0xB989C0C17a3Bce679D7586d9e55B6Eab11c18687)

- `NationCred.sol`: [`0x7794F0Eb1eA812fBcdaBD559551Fb26A79720925`](https://etherscan.io/address/0x7794F0Eb1eA812fBcdaBD559551Fb26A79720925)

- `utils/`

  - `PassportUtils.sol`: [`0x23Ca3002706b71a440860E3cf8ff64679A00C9d7`](https://etherscan.io/address/0x23Ca3002706b71a440860E3cf8ff64679A00C9d7)

### npm (`v0.6.9`)

https://www.npmjs.com/package/@nation3/nationcred-contracts

```
cd contracts
npm adduser
npm publish --access public
```

After publishing, bump the version in `package.json` and the `VERSION` constant in each smart contract.
