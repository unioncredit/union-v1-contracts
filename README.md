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
| ArbUnion Wrapper | [0x1fed524867348eCeA0A4D9AEaE989794DbF8F631](https://etherscan.io/address/0x1fed524867348eCeA0A4D9AEaE989794DbF8F631) | ❌          |
| Arb Connector    | [0xd8cA7C410B5780BdA6425D43869e5beC19233850](https://etherscan.io/address/0xd8cA7C410B5780BdA6425D43869e5beC19233850) | ❌          |

## Arbitrum One

| Contract         | Address                                                                                                              | Upgradeable |
| ---------------- | -------------------------------------------------------------------------------------------------------------------- | ----------- |
| UserManagerArb   | [0xb07Bb7D95c8c57D0ac284957D56B62751a7e98B4](https://arbiscan.io/address/0xb07Bb7D95c8c57D0ac284957D56B62751a7e98B4) | ✅          |
| MarketRegistry   | [0x82c7cA392644a6c66fcaF9d4efF89e6d875D58D9](https://arbiscan.io/address/0x82c7cA392644a6c66fcaF9d4efF89e6d875D58D9) | ✅          |
| Comptroller      | [0x9610d516779F5Ce55e9faCbA703B9Fd84d7d59ce](https://arbiscan.io/address/0x9610d516779F5Ce55e9faCbA703B9Fd84d7d59ce) | ✅          |
| uDAI             | [0x109b00A3473366f24C0D0103498d8d75d1AE40ae](https://arbiscan.io/address/0x109b00A3473366f24C0D0103498d8d75d1AE40ae) | ✅          |
| AssetManager     | [0x7Aecd107Cb022e1DFd42cC43E9BA94C38BC83275](https://arbiscan.io/address/0x7Aecd107Cb022e1DFd42cC43E9BA94C38BC83275) | ✅          |
| PureTokenAdapter | [0xdC3c984f2Ecb7Ee2540bb0B9EfE9540204cdAB57](https://arbiscan.io/address/0xdC3c984f2Ecb7Ee2540bb0B9EfE9540204cdAB57) | ✅          |
| ArbUnion         | [0x125E905185198edB3eeb6C8A5bAf5B64adc4ABc4](https://arbiscan.io/address/0x125E905185198edB3eeb6C8A5bAf5B64adc4ABc4) | ❌          |

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

## Rinkeby

| Contract         | Address                                                                                                                       | Upgradeable |
| ---------------- | ----------------------------------------------------------------------------------------------------------------------------- | ----------- |
| UserManager      | [0xaD2209F2c21756c548724E7F19eD522F48Fe64F0](https://rinkeby.etherscan.io/address/0xaD2209F2c21756c548724E7F19eD522F48Fe64F0) | ✅          |
| MarketRegistry   | [0x2a9AABCD709Dd5e57DD5D2d06BEF7878698aCBeB](https://rinkeby.etherscan.io/address/0x2a9AABCD709Dd5e57DD5D2d06BEF7878698aCBeB) | ✅          |
| Comptroller      | [0x491337330Fd30cAfFC93015F0f9C83419d96B413](https://rinkeby.etherscan.io/address/0x491337330Fd30cAfFC93015F0f9C83419d96B413) | ✅          |
| uDAI             | [0x5F17893aFabbcC7E63b486807660CB727BE5E557](https://rinkeby.etherscan.io/address/0x5F17893aFabbcC7E63b486807660CB727BE5E557) | ✅          |
| AssetManager     | [0x6aB155b8947b0067b88C1371C674559A502dDE32](https://rinkeby.etherscan.io/address/0x6aB155b8947b0067b88C1371C674559A502dDE32) | ✅          |
| CompoundAdapter  | [0xa7f64787603eb4fcaE868AF13146BC900F09541F](https://rinkeby.etherscan.io/address/0xa7f64787603eb4fcaE868AF13146BC900F09541F) | ✅          |
| PureTokenAdapter | [0x97E92f00144D3C5B5d365147e0A44962d9E57f15](https://rinkeby.etherscan.io/address/0x97E92f00144D3C5B5d365147e0A44962d9E57f15) | ✅          |
| UnionToken       | [0xBd3a3c823A7442193BE5Ca8005D98F0599Cc8bD5](https://rinkeby.etherscan.io/address/0xBd3a3c823A7442193BE5Ca8005D98F0599Cc8bD5) | ❌          |
| ArbUnionWrapper  | [0xf5FAaC2191f0a17162Fd1E672c89556038b7dabc](https://rinkeby.etherscan.io/address/0xf5FAaC2191f0a17162Fd1E672c89556038b7dabc) | ❌          |
| Governor         | [0x0f991cD13a3D4e384fc303355e4f09913eEd3023](https://rinkeby.etherscan.io/address/0x0f991cD13a3D4e384fc303355e4f09913eEd3023) | ❌          |
| Timelock         | [0xd1B972Af3eeF8620f2cE33a467c99eB41E90b52F](https://rinkeby.etherscan.io/address/0xd1B972Af3eeF8620f2cE33a467c99eB41E90b52F) | ❌          |
| Treasury         | [0x7103C2Ef543De2258F1e6a0a5637331d2C5C29b9](https://rinkeby.etherscan.io/address/0x7103C2Ef543De2258F1e6a0a5637331d2C5C29b9) | ❌          |
| Treasury Vester  | [0x76a00ca4B0a5e44D4745CE9C3C229b395a57ccc0](https://rinkeby.etherscan.io/address/0x76a00ca4B0a5e44D4745CE9C3C229b395a57ccc0) | ❌          |
| ArbUnion Wrapper | [0x4616b36Fb1c70a4aB05afb53eDA6E9d09efd1dC9](https://rinkeby.etherscan.io/address/0x4616b36Fb1c70a4aB05afb53eDA6E9d09efd1dC9) | ❌          |
| Arb Connector    | [0x63B3f4cb352f10879c784C0898c1253e5B454722](https://rinkeby.etherscan.io/address/0x63B3f4cb352f10879c784C0898c1253e5B454722) | ❌          |
| DAI (Rinkeby)    | [0x5592EC0cfb4dbc12D3aB100b257153436a1f0FEa](https://rinkeby.etherscan.io/address/0x5592EC0cfb4dbc12D3aB100b257153436a1f0FEa) | ❌          |
| cDAI (Kovan)     | [0x6d7f0754ffeb405d23c51ce938289d4835be3b14](https://rinkeby.etherscan.io/address/0x6d7f0754ffeb405d23c51ce938289d4835be3b14) | ❌          |

## Arbitrum Rinkeby Testnet

| Contract         | Address                                                                                                                      | Upgradeable |
| ---------------- | ---------------------------------------------------------------------------------------------------------------------------- | ----------- |
| UserManagerArb   | [0x8Cf2D155D1b789C72403BAdB33E85664cEF84e6B](https://testnet.arbiscan.io/address/0x8Cf2D155D1b789C72403BAdB33E85664cEF84e6B) | ✅          |
| MarketRegistry   | [0x29882381C17c50B2f2bf8a377B59358b01f7A026](https://testnet.arbiscan.io/address/0x29882381C17c50B2f2bf8a377B59358b01f7A026) | ✅          |
| Comptroller      | [0xB9A7e04e6c75C718904F0De0F5Cc6a2728a3F50C](https://testnet.arbiscan.io/address/0xB9A7e04e6c75C718904F0De0F5Cc6a2728a3F50C) | ✅          |
| uDAI             | [0xb48AB81bA53Cf3cCa3960BeA09bAB7EB1BFB5c57](https://testnet.arbiscan.io/address/0xb48AB81bA53Cf3cCa3960BeA09bAB7EB1BFB5c57) | ✅          |
| AssetManager     | [0x2B2f7A61489A0Aa8638790125DE0DDAD9CB5D12e](https://testnet.arbiscan.io/address/0x2B2f7A61489A0Aa8638790125DE0DDAD9CB5D12e) | ✅          |
| PureTokenAdapter | [0xCce053B5e30310cc58020AcF922b836F67C5eD8E](https://testnet.arbiscan.io/address/0xCce053B5e30310cc58020AcF922b836F67C5eD8E) | ✅          |
| ArbUnion         | [0xb371fe920071F73ca81b4D57C72639480F3886a7](https://testnet.arbiscan.io/address/0xb371fe920071F73ca81b4D57C72639480F3886a7) | ❌          |
| DAI (Arbitrum)   | [0x5364Dc963c402aAF150700f38a8ef52C1D7D7F14](https://testnet.arbiscan.io/address/0x5364Dc963c402aAF150700f38a8ef52C1D7D7F14) | ❌          |

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
