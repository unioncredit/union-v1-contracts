# Smart Contracts for Union V1

[![build and test](https://github.com/unioncredit/union-v1-contracts/actions/workflows/ci_push.yml/badge.svg)](https://github.com/unioncredit/union-v1-contracts/actions/workflows/ci_push.yml) [![coverage and slither](https://github.com/unioncredit/union-v1-contracts/actions/workflows/ci_pr.yml/badge.svg)](https://github.com/unioncredit/union-v1-contracts/actions/workflows/ci_pr.yml) [![codecov](https://codecov.io/gh/unioncredit/union-v1-contracts/branch/master/graph/badge.svg?token=RWHSS7TLO6)](https://codecov.io/gh/unioncredit/union-v1-contracts)

# Networks

Union is an upgradeable system. Each deployed contract is a "Proxy" that points to an "Implementation" contract. All addresses can be found in the folder `deployments/${network}`.

## Ethereum Mainnet

| Contract         | Address                                                                                                               | Upgradeable |
| ---------------- | --------------------------------------------------------------------------------------------------------------------- | ----------- |
| UserManager      | [0x49c910Ba694789B58F53BFF80633f90B8631c195](https://etherscan.io/address/0x49c910Ba694789B58F53BFF80633f90B8631c195) | ✅          |
| MarketRegistry   | [0x1ddB9a1F6Bc0dE1d05eBB0FDA61A7398641ae6BE](https://etherscan.io/address/0x1ddB9a1F6Bc0dE1d05eBB0FDA61A7398641ae6BE) | ✅          |
| Comptroller      | [0x216dE4089dCdD7B95BC34BdCe809669C788a9A5d](https://etherscan.io/address/0x216dE4089dCdD7B95BC34BdCe809669C788a9A5d) | ✅          |
| uDAI             | [0x954F20DF58347b71bbC10c94827bE9EbC8706887](https://etherscan.io/address/0x954F20DF58347b71bbC10c94827bE9EbC8706887) | ✅          |
| AssetManager     | [0xb91a874D9AA8fF7E478bA61286ECc77c1A3E384d](https://etherscan.io/address/0xb91a874D9AA8fF7E478bA61286ECc77c1A3E384d) | ✅          |
| CompoundAdapter  | [0x303CbdADF370F6bBa79651f680498E829cB860D5](https://etherscan.io/address/0x303CbdADF370F6bBa79651f680498E829cB860D5) | ✅          |
| AaveAdapter      | [0xE8c77A541c933Aa1320Aa2f89a61f91130e4012d](https://etherscan.io/address/0xE8c77A541c933Aa1320Aa2f89a61f91130e4012d) | ✅          |
| PureTokenAdapter | [0x62DD06026F5f8e874eEfF362b1280CD9A2057b7d](https://etherscan.io/address/0x62DD06026F5f8e874eEfF362b1280CD9A2057b7d) | ✅          |
| UnionToken       | [0x5Dfe42eEA70a3e6f93EE54eD9C321aF07A85535C](https://etherscan.io/address/0x5Dfe42eEA70a3e6f93EE54eD9C321aF07A85535C) | ❌          |
| Governor         | [0xe1b3F07a9032F0d3deDf3E96c395A4Da74130f6e](https://etherscan.io/address/0xe1b3F07a9032F0d3deDf3E96c395A4Da74130f6e) | ❌          |
| Timelock         | [0xBBD3321f377742c4b3fe458b270c2F271d3294D8](https://etherscan.io/address/0xBBD3321f377742c4b3fe458b270c2F271d3294D8) | ❌          |
| Treasury         | [0x6DBDe0E7e563E34A53B1130D6B779ec8eD34B4B9](https://etherscan.io/address/0x6DBDe0E7e563E34A53B1130D6B779ec8eD34B4B9) | ❌          |
| Treasury Vester  | [0x641DD6258cb3E948121B10ee51594Dc2A8549fe1](https://etherscan.io/address/0x641DD6258cb3E948121B10ee51594Dc2A8549fe1) | ❌          |
| ArbUnion Wrapper | [0x20c375e822b6264E22941B74943F940A1CfE5F25](https://etherscan.io/address/0x20c375e822b6264E22941B74943F940A1CfE5F25) | ❌          |
| Arb Connector    | [0x307ED81138cA91637E432DbaBaC6E3A42699032a](https://etherscan.io/address/0x307ED81138cA91637E432DbaBaC6E3A42699032a) | ❌          |

## Arbitrum One

| Contract         | Address                                                                                                              | Upgradeable |
| ---------------- | -------------------------------------------------------------------------------------------------------------------- | ----------- |
| UserManager      | [0xb71F3D4342AaE0b8D531E14D2CF2F45d6e458A5F](https://arbiscan.io/address/0xb71F3D4342AaE0b8D531E14D2CF2F45d6e458A5F) | ✅          |
| MarketRegistry   | [0x82c7cA392644a6c66fcaF9d4efF89e6d875D58D9](https://arbiscan.io/address/0x82c7cA392644a6c66fcaF9d4efF89e6d875D58D9) | ✅          |
| Comptroller      | [0x641DD6258cb3E948121B10ee51594Dc2A8549fe1](https://arbiscan.io/address/0x641DD6258cb3E948121B10ee51594Dc2A8549fe1) | ✅          |
| uDAI             | [0x954F20DF58347b71bbC10c94827bE9EbC8706887](https://arbiscan.io/address/0x954F20DF58347b71bbC10c94827bE9EbC8706887) | ✅          |
| AssetManager     | [0x7Aecd107Cb022e1DFd42cC43E9BA94C38BC83275](https://arbiscan.io/address/0x7Aecd107Cb022e1DFd42cC43E9BA94C38BC83275) | ✅          |
| PureTokenAdapter | [0xdC3c984f2Ecb7Ee2540bb0B9EfE9540204cdAB57](https://arbiscan.io/address/0xdC3c984f2Ecb7Ee2540bb0B9EfE9540204cdAB57) | ✅          |
| ArbUnion         | [0x6DBDe0E7e563E34A53B1130D6B779ec8eD34B4B9](https://arbiscan.io/address/0x6DBDe0E7e563E34A53B1130D6B779ec8eD34B4B9) | ❌          |

## Goerli

| Contract         | Address                                                                                                                      | Upgradeable |
| ---------------- | ---------------------------------------------------------------------------------------------------------------------------- | ----------- |
| UserManager      | [0xba25eb32f42B1A4c31711B3d4967e4D74561C37B](https://goerli.etherscan.io/address/0xba25eb32f42B1A4c31711B3d4967e4D74561C37B) | ✅          |
| MarketRegistry   | [0xF440eC63091A5cdaff6f8dE19CFcD2b25DE01232](https://goerli.etherscan.io/address/0xF440eC63091A5cdaff6f8dE19CFcD2b25DE01232) | ✅          |
| Comptroller      | [0x216dE4089dCdD7B95BC34BdCe809669C788a9A5d](https://goerli.etherscan.io/address/0x216dE4089dCdD7B95BC34BdCe809669C788a9A5d) | ✅          |
| uDAI             | [0xe3686Dad4E4bd2203051D605C160c9a3f5D3dA04](https://goerli.etherscan.io/address/0xe3686Dad4E4bd2203051D605C160c9a3f5D3dA04) | ✅          |
| AssetManager     | [0xb91a874D9AA8fF7E478bA61286ECc77c1A3E384d](https://goerli.etherscan.io/address/0xb91a874D9AA8fF7E478bA61286ECc77c1A3E384d) | ✅          |
| PureTokenAdapter | [0xFE73569bB837D24076B40a4fd244ddaeE90F0f09](https://goerli.etherscan.io/address/0xFE73569bB837D24076B40a4fd244ddaeE90F0f09) | ✅          |
| AaveV3Adapter    | [0x71c103E1e4fD29f737D36a6bD8149d73EA573d18](https://goerli.etherscan.io/address/0x71c103E1e4fD29f737D36a6bD8149d73EA573d18) | ✅          |
| UnionToken       | [0x23B0483E07196c425d771240E81A9c2f1E113D3A](https://goerli.etherscan.io/address/0x23B0483E07196c425d771240E81A9c2f1E113D3A) | ❌          |
| Governor         | [0x88fBf51538dB90b04809f9853a42c764fdFbE888](https://goerli.etherscan.io/address/0x88fBf51538dB90b04809f9853a42c764fdFbE888) | ❌          |
| Timelock         | [0x90dfc868784f5e684Bb8650Ab218775fc9F28860](https://goerli.etherscan.io/address/0x90dfc868784f5e684Bb8650Ab218775fc9F28860) | ❌          |
| Treasury         | [0xc124047253c87EF90aF9f4EFC12C281b479c4769](https://goerli.etherscan.io/address/0xc124047253c87EF90aF9f4EFC12C281b479c4769) | ❌          |
| Treasury Vester  | [0x0D25131E098DfB65746ecC3C527865A7bBA71886](https://goerli.etherscan.io/address/0x0D25131E098DfB65746ecC3C527865A7bBA71886) | ❌          |
| ArbUnion Wrapper | [0xbf723c4641800a5878654ca9384145D70721f9E8](https://goerli.etherscan.io/address/0xbf723c4641800a5878654ca9384145D70721f9E8) | ❌          |
| Arb Connector    | [0x7F0856E16a01eE0690406fa3fDDB12B972F22073](https://goerli.etherscan.io/address/0x7F0856E16a01eE0690406fa3fDDB12B972F22073) | ❌          |
| DAI (Goerli)     | [0xDF1742fE5b0bFc12331D8EAec6b478DfDbD31464](https://goerli.etherscan.io/address/0xDF1742fE5b0bFc12331D8EAec6b478DfDbD31464) | ❌          |

## Arbitrum Nitro Testnet

| Contract         | Address                                                                                                                                     | Upgradeable |
| ---------------- | ------------------------------------------------------------------------------------------------------------------------------------------- | ----------- |
| UserManagerArb   | [0x066Acb6Fc27bd05AB8e8A9C5bAE4f585B9e82d06](https://goerli-rollup-explorer.arbitrum.io/address/0x066Acb6Fc27bd05AB8e8A9C5bAE4f585B9e82d06) | ✅          |
| MarketRegistry   | [0x7F0856E16a01eE0690406fa3fDDB12B972F22073](https://goerli-rollup-explorer.arbitrum.io/address/0x7F0856E16a01eE0690406fa3fDDB12B972F22073) | ✅          |
| Comptroller      | [0x1fF6c719a652Bb3dF9EE2740fD0E9524dBdd331c](https://goerli-rollup-explorer.arbitrum.io/address/0x1fF6c719a652Bb3dF9EE2740fD0E9524dBdd331c) | ✅          |
| uDAI             | [0x7A3a24B010C53307eD736CB08524bD24378d1b51](https://goerli-rollup-explorer.arbitrum.io/address/0x7A3a24B010C53307eD736CB08524bD24378d1b51) | ✅          |
| AssetManager     | [0x6C4a35A96c1E7CD590292f1a7be578044dAd2837](https://goerli-rollup-explorer.arbitrum.io/address/0x6C4a35A96c1E7CD590292f1a7be578044dAd2837) | ✅          |
| PureTokenAdapter | [0x792ACBbF38Df3A60ABa14851fC518620C7AE386c](https://goerli-rollup-explorer.arbitrum.io/address/0x792ACBbF38Df3A60ABa14851fC518620C7AE386c) | ✅          |
| ArbUnion         | [0x804FB9d2B0f3310bC20D91B958D33F40fA87ee5a](https://goerli-rollup-explorer.arbitrum.io/address/0x804FB9d2B0f3310bC20D91B958D33F40fA87ee5a) | ❌          |

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
$ yarn test:unit
```

To run the deployment script tests:

```
$ yarn test:deploy
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
