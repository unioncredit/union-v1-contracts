# Smart Contracts for Union V1

[![build and test](https://github.com/unioncredit/union-v1-contracts/actions/workflows/ci_push.yml/badge.svg)](https://github.com/unioncredit/union-v1-contracts/actions/workflows/ci_push.yml) [![coverage and slither](https://github.com/unioncredit/union-v1-contracts/actions/workflows/ci_pr.yml/badge.svg)](https://github.com/unioncredit/union-v1-contracts/actions/workflows/ci_pr.yml) [![codecov](https://codecov.io/gh/unioncredit/union-v1-contracts/branch/develop/graph/badge.svg?token=RWHSS7TLO6)](https://codecov.io/gh/unioncredit/union-v1-contracts)

# Networks

Union is an upgradeable system. Each deployed contract is actually a "Proxy" that points to an "Implementation" contract. All addresses can be found in the folder `deployments/${network}`.

## Kovan

| Contract         | Address (proxy)                                                                                                             | Upgradeable |
| ---------------- | --------------------------------------------------------------------------------------------------------------------------- | ----------- |
| UserManager      | [0x77aABF576fe07f06bdde95Ba25625d3a91A6190F](https://kovan.etherscan.io/address/0x77aABF576fe07f06bdde95Ba25625d3a91A6190F) | ✅          |
| MarketRegistry   | [0xB0f8Be21E30ae291e002aD8A28A85e90266Ad099](https://kovan.etherscan.io/address/0xB0f8Be21E30ae291e002aD8A28A85e90266Ad099) | ✅          |
| Comptroller      | [0x4cAc792Cdb49a9036E4f1dE8F60e86f485D0EB98](https://kovan.etherscan.io/address/0x4cAc792Cdb49a9036E4f1dE8F60e86f485D0EB98) | ✅          |
| UToken (uDAI)    | [0xd9bAe3CF2E16E72A5a3896d11e46449E65Aa6F52](https://kovan.etherscan.io/address/0xd9bAe3CF2E16E72A5a3896d11e46449E65Aa6F52) | ✅          |
| AssetManager     | [0x205365B5474D7488fcd862010B1FcA5Bd8c485C9](https://kovan.etherscan.io/address/0x205365B5474D7488fcd862010B1FcA5Bd8c485C9) | ✅          |
| CompoundAdapter  | [0xf90a43Ed2e76f0635c0f2208D17BCf0C380D270C](https://kovan.etherscan.io/address/0xf90a43Ed2e76f0635c0f2208D17BCf0C380D270C) | ✅          |
| AaveAdapter      | [0x205365B5474D7488fcd862010B1FcA5Bd8c485C9](https://kovan.etherscan.io/address/0x205365B5474D7488fcd862010B1FcA5Bd8c485C9) | ✅          |
| PureTokenAdapter | [0x93AC44Eff25e0F055CA2B1d4bcCEF453A8541F96](https://kovan.etherscan.io/address/0x93AC44Eff25e0F055CA2B1d4bcCEF453A8541F96) | ✅          |
| UnionToken       | [0x598C0657385A1a631dD71818485bD704CFa552aE](https://kovan.etherscan.io/address/0x598C0657385A1a631dD71818485bD704CFa552aE) | ❌          |
| Governor         | [0xed1411eaCDaE26ACeAf0240cf4B4077dbB75d06a](https://kovan.etherscan.io/address/0xed1411eaCDaE26ACeAf0240cf4B4077dbB75d06a) | ❌          |
| Timelock         | [0x5aAD7F7239c28Aa38c6BA6b62B3267D3a6Bb7F7a](https://kovan.etherscan.io/address/0x5aAD7F7239c28Aa38c6BA6b62B3267D3a6Bb7F7a) | ❌          |
| Treasury         | [0x14bF0cb2dEb280e8FE68242F06206F970c2ef425](https://kovan.etherscan.io/address/0x14bF0cb2dEb280e8FE68242F06206F970c2ef425) | ❌          |
| Treasury Vester  | [0x15dCc98027dC9a3E655A37bD36ED7F7483aBBEc8](https://kovan.etherscan.io/address/0x15dCc98027dC9a3E655A37bD36ED7F7483aBBEc8) | ❌          |
| Kovan DAI        | [0x4f96fe3b7a6cf9725f59d353f723c1bdb64ca6aa](https://kovan.etherscan.io/address/0x4f96fe3b7a6cf9725f59d353f723c1bdb64ca6aa) | ❌          |
| Kovan cDAI       | [0xf0d0eb522cfa50b716b3b1604c4f0fa6f04376ad](https://kovan.etherscan.io/address/0xf0d0eb522cfa50b716b3b1604c4f0fa6f04376ad) | ❌          |

# Setup

Requirements:

-   Node @14.x
-   Python @3.x (for running Slither)

Clone the repo and then install dependencies:

```
$ yarn install
```

# Testing

To run the entire test suite:

```
$ yarn test
```

To run the unit tests only:

```
$ yarn unitTest
```

To run the deployment script tests:

```
$ yarn deployTest
```

# Coverage

To run tests with coverage:

```
$ yarn coverage
```

# Deployment

To deploy to a supported network:

```
$ yarn deploy {network}
```

Check the deployed params:

```
$ yarn checkDeploy {network}
```
