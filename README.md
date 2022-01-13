# Smart Contracts for Union V1

[![build and test](https://github.com/unioncredit/union-v1-contracts/actions/workflows/ci_push.yml/badge.svg)](https://github.com/unioncredit/union-v1-contracts/actions/workflows/ci_push.yml) [![coverage and slither](https://github.com/unioncredit/union-v1-contracts/actions/workflows/ci_pr.yml/badge.svg)](https://github.com/unioncredit/union-v1-contracts/actions/workflows/ci_pr.yml) [![codecov](https://codecov.io/gh/unioncredit/union-v1-contracts/branch/develop/graph/badge.svg?token=RWHSS7TLO6)](https://codecov.io/gh/unioncredit/union-v1-contracts)

# Networks

Union is an upgradeable system. Each deployed contract is actually a "Proxy" that points to an "Implementation" contract. All addresses can be found in the folder `deployments/${network}`.

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
| Governor         | [0x011e5846975c6463a8c6337EECF3cbF64e328884](https://etherscan.io/address/0x011e5846975c6463a8c6337EECF3cbF64e328884) | ❌          |
| Timelock         | [0xBBD3321f377742c4b3fe458b270c2F271d3294D8](https://etherscan.io/address/0xBBD3321f377742c4b3fe458b270c2F271d3294D8) | ❌          |
| Treasury         | [0x6DBDe0E7e563E34A53B1130D6B779ec8eD34B4B9](https://etherscan.io/address/0x6DBDe0E7e563E34A53B1130D6B779ec8eD34B4B9) | ❌          |
| Treasury Vester  | [0x641DD6258cb3E948121B10ee51594Dc2A8549fe1](https://etherscan.io/address/0x641DD6258cb3E948121B10ee51594Dc2A8549fe1) | ❌          |

## Kovan

| Contract         | Address                                                                                                                     | Upgradeable |
| ---------------- | --------------------------------------------------------------------------------------------------------------------------- | ----------- |
| UserManager      | [0x391fDb669462FBAA5a7e228f3857281BeCf235EE](https://kovan.etherscan.io/address/0x391fDb669462FBAA5a7e228f3857281BeCf235EE) | ✅          |
| MarketRegistry   | [0x15B12b8dB6665B31E15Da26275fD54590f2E989c](https://kovan.etherscan.io/address/0x15B12b8dB6665B31E15Da26275fD54590f2E989c) | ✅          |
| Comptroller      | [0x85FD0fA5Cc2f0B3A12C146C5B5A37d9e269b3Ba8](https://kovan.etherscan.io/address/0x85FD0fA5Cc2f0B3A12C146C5B5A37d9e269b3Ba8) | ✅          |
| uDAI             | [0x1bAa7FC92A86768D5F0Dd6Ff3AD7155eCD8cB293](https://kovan.etherscan.io/address/0x1bAa7FC92A86768D5F0Dd6Ff3AD7155eCD8cB293) | ✅          |
| AssetManager     | [0xB944F1f7B603Aca87B73592ce9267E0BA375f4c9](https://kovan.etherscan.io/address/0xB944F1f7B603Aca87B73592ce9267E0BA375f4c9) | ✅          |
| CompoundAdapter  | [0xD3FfB854C11096e0d5EFD6Ba6d3c1BeF4B89add9](https://kovan.etherscan.io/address/0xD3FfB854C11096e0d5EFD6Ba6d3c1BeF4B89add9) | ✅          |
| PureTokenAdapter | [0x48941f5Ad4E6b313cC691e088c7E241617C5a9B2](https://kovan.etherscan.io/address/0x48941f5Ad4E6b313cC691e088c7E241617C5a9B2) | ✅          |
| UnionToken       | [0x08AF898e65493D8212c8981FAdF60Ff023A91150](https://kovan.etherscan.io/address/0x08AF898e65493D8212c8981FAdF60Ff023A91150) | ❌          |
| Governor         | [0x7C1c7330EcC771C24f5De5b0Ce925Fde3A631c45](https://kovan.etherscan.io/address/0x7C1c7330EcC771C24f5De5b0Ce925Fde3A631c45) | ❌          |
| Timelock         | [0x107e3811900A93940cE8694fF9C6217Be900faAF](https://kovan.etherscan.io/address/0x107e3811900A93940cE8694fF9C6217Be900faAF) | ❌          |
| Treasury         | [0x28d1999FDC8a5396b11E86F8fd247a85d4d4D7F9](https://kovan.etherscan.io/address/0x28d1999FDC8a5396b11E86F8fd247a85d4d4D7F9) | ❌          |
| Treasury Vester  | [0x137698a81E9384175Ab5A7D715E5df62DF5E6c16](https://kovan.etherscan.io/address/0x137698a81E9384175Ab5A7D715E5df62DF5E6c16) | ❌          |
| DAI (Kovan)      | [0x4f96fe3b7a6cf9725f59d353f723c1bdb64ca6aa](https://kovan.etherscan.io/address/0x4f96fe3b7a6cf9725f59d353f723c1bdb64ca6aa) | ❌          |
| cDAI (Kovan)     | [0xf0d0eb522cfa50b716b3b1604c4f0fa6f04376ad](https://kovan.etherscan.io/address/0xf0d0eb522cfa50b716b3b1604c4f0fa6f04376ad) | ❌          |

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
