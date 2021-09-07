# Smart Contracts for Union V1

[![build and test](https://github.com/unioncredit/union-v1-contracts/actions/workflows/ci_push.yml/badge.svg)](https://github.com/unioncredit/union-v1-contracts/actions/workflows/ci_push.yml) [![coverage and slither](https://github.com/unioncredit/union-v1-contracts/actions/workflows/ci_pr.yml/badge.svg)](https://github.com/unioncredit/union-v1-contracts/actions/workflows/ci_pr.yml) [![codecov](https://codecov.io/gh/unioncredit/union-v1-contracts/branch/master/graph/badge.svg?token=RWHSS7TLO6)](https://codecov.io/gh/unioncredit/union-v1-contracts)

# Networks

Union is an upgradeable system. Each deployed contract is actually a "Proxy" that points to an "Implementation" contract. All addresses can be found in the folder `deployments/${network}`.

## Kovan

| Contract         | Address (proxy)                                                                                                             | Upgradeable |
| ---------------- | --------------------------------------------------------------------------------------------------------------------------- | ----------- |
| UserManager      | [0xAB4F10D1d4F69910CA78c8F6541Fb13e6f1F5827](https://kovan.etherscan.io/address/0xAB4F10D1d4F69910CA78c8F6541Fb13e6f1F5827) | ✅          |
| MarketRegistry   | [0xF167De7457e4cfc86868EE54edada2071E45Cb1c](https://kovan.etherscan.io/address/0xF167De7457e4cfc86868EE54edada2071E45Cb1c) | ✅          |
| Comptroller      | [0xC1C4f71F23D41D76E6154B81f72215F778f12Fd1](https://kovan.etherscan.io/address/0xC1C4f71F23D41D76E6154B81f72215F778f12Fd1) | ✅          |
| UToken (uDAI)    | [0x47876400B82e57090C2CAe9f779F37e8c59430e9](https://kovan.etherscan.io/address/0x47876400B82e57090C2CAe9f779F37e8c59430e9) | ✅          |
| AssetManager     | [0x92f6aF8f339062A04BF749B6582da4513aF54A5f](https://kovan.etherscan.io/address/0x92f6aF8f339062A04BF749B6582da4513aF54A5f) | ✅          |
| CompoundAdapter  | [0x3aC736940B29e488fbFadeD45E3FF3FB2678BEe6](https://kovan.etherscan.io/address/0x3aC736940B29e488fbFadeD45E3FF3FB2678BEe6) | ✅          |
| AaveAdapter      | [0x06D0cB250ADb246269e15f88B9fcD68A6e0f0900](https://kovan.etherscan.io/address/0x06D0cB250ADb246269e15f88B9fcD68A6e0f0900) | ✅          |
| PureTokenAdapter | [0x2Ed947346420BA5A69934080e00292626fC99c09](https://kovan.etherscan.io/address/0x2Ed947346420BA5A69934080e00292626fC99c09) | ✅          |
| UnionToken       | [0x8a3Cf336D8a027C5109166403f2226Ce610C2631](https://kovan.etherscan.io/address/0x8a3Cf336D8a027C5109166403f2226Ce610C2631) | ❌          |
| Governor         | [0xB83d4274A5755702f535644BB22432B60ddB2f41](https://kovan.etherscan.io/address/0xB83d4274A5755702f535644BB22432B60ddB2f41) | ❌          |
| Timelock         | [0xD5a9E38B3AEe371CFB1482dbCf622B6e3097366B](https://kovan.etherscan.io/address/0xD5a9E38B3AEe371CFB1482dbCf622B6e3097366B) | ❌          |
| Treasury         | [0xD377755F8Ce2D022c88e15C40D5b7d649e2260F4](https://kovan.etherscan.io/address/0xD377755F8Ce2D022c88e15C40D5b7d649e2260F4) | ❌          |
| Treasury Vester  | [0x0ABB912BFd6101C8325b89f5C61d27C931CCd516](https://kovan.etherscan.io/address/0x0ABB912BFd6101C8325b89f5C61d27C931CCd516) | ❌          |
| Kovan DAI        | [0x4f96fe3b7a6cf9725f59d353f723c1bdb64ca6aa](https://kovan.etherscan.io/address/0x4f96fe3b7a6cf9725f59d353f723c1bdb64ca6aa) | ❌          |
| Kovan cDAI       | [0xf0d0eb522cfa50b716b3b1604c4f0fa6f04376ad](https://kovan.etherscan.io/address/0xf0d0eb522cfa50b716b3b1604c4f0fa6f04376ad) | ❌          |

# Setup

Requirements:

-   Node @12.x
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

# Coverage

To run tests with coverage:

```
$ yarn coverage
```
