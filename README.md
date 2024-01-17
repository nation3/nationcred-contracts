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

### Goerli (Version `0.6.3`)

https://github.com/nation3/foundations/blob/main/deployments/goerli.json

- utils/PassportUtils.sol: [`0xdBBCE0e796d10C95D23b4AAfCD19DEf268502A5b`](https://goerli.etherscan.io/address/0xdBBCE0e796d10C95D23b4AAfCD19DEf268502A5b#code)
- citizens/DeveloperSkillLevels.sol: [`0xd99884fE5d9aCE5ECa73Dd5D4c0fe123F1560B7B`](https://goerli.etherscan.io/address/0xd99884fE5d9aCE5ECa73Dd5D4c0fe123F1560B7B#code)
- citizens/OperatorSkillLevels.sol: [`0xfB9deD3Aa0B4A3A53c16D959aaEAbacD37c23eF7`](https://goerli.etherscan.io/address/0xfB9deD3Aa0B4A3A53c16D959aaEAbacD37c23eF7#code)
- citizens/MarketeerSkillLevels.sol: [`0xdf691B0948AdaA27F44B390055E162B1466d6cc8`](https://goerli.etherscan.io/address/0xdf691B0948AdaA27F44B390055E162B1466d6cc8#code)

- GitHubUsernames.sol: `0x1bDa420e57059FB7C97B13DE7F7Dd719371E0291`
- Discord.sol: `0x4BD52941D5C14035F49C93ab6EB3878DDa063119`
- NationCred.sol: [`0x12ee4FE795CD3C42422CC7CE8b9446c27BdA531f`](https://goerli.etherscan.io/address/0x12ee4FE795CD3C42422CC7CE8b9446c27BdA531f)

### Sepolia (Version `0.6.4`)

https://github.com/nation3/foundations/blob/main/deployments/sepolia.json

- `utils/PassportUtils.sol`: [`0x4Db31016fe58292B7654C9EDF8Ad106761BB7a90`](https://sepolia.etherscan.io/address/0x4Db31016fe58292B7654C9EDF8Ad106761BB7a90)
  - > `⚠️ Not yet functional`
- `citizens/DeveloperSkillLevels.sol`: [`0xcD441F74016bB50ff25959805F6466AdB49950D2`](https://sepolia.etherscan.io/address/0xcD441F74016bB50ff25959805F6466AdB49950D2)
- `citizens/OperatorSkillLevels.sol`: [`0xb2731b1DB731Bc653ef3286264373BF1306B3e4B`](https://sepolia.etherscan.io/address/0xb2731b1DB731Bc653ef3286264373BF1306B3e4B)
- `citizens/MarketeerSkillLevels.sol`: [`0x02FF5feb29dF1c03bD6fDd60C03Ac1375045Bd60`](https://sepolia.etherscan.io/address/0x02FF5feb29dF1c03bD6fDd60C03Ac1375045Bd60)
- NationCred.sol: `0x...`

#### Ethereum Attestation Service (EAS)

EAS schema for `DeveloperSkillLevels.sol`, `OperatorSkillLevels.sol`, `MarketeerSkillLevels.sol`:
https://sepolia.easscan.org/schema/view/0x8233d9319f24851e27b79cd7c3afe2e22a125b722435733d8b428b85d6e2ab8b

### Mainnet

https://github.com/nation3/foundations/blob/main/deployments/mainnet.json

- GitHub.sol: `0xB989C0C17a3Bce679D7586d9e55B6Eab11c18687`
- Discord.sol: `0x3415f4ffb9f89fba0ab446da4a78223e4cd73bad`
- Discourse.sol: `0xC396F3536Cc67913bbE1e5E454c10BBA4ae8928F`
- NationCred.sol: `0x7794F0Eb1eA812fBcdaBD559551Fb26A79720925`

## npm

https://docs.npmjs.com/creating-and-publishing-scoped-public-packages

```
cd contracts
npm adduser
npm publish --access public
```

After publishing, bump the version in `package.json` and the `VERSION` constant in each smart contract.
