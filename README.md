# Smart Contracts for Union V1

![build](https://github.com/unioncredit/union-v1-contracts/workflows/build/badge.svg) [![codecov](https://codecov.io/gh/unioncredit/union-v1-contracts/branch/master/graph/badge.svg?token=RWHSS7TLO6)](https://codecov.io/gh/unioncredit/union-v1-contracts)

# Networks

Union is an upgradeable system. Each deployed contract is actually a "Proxy" that points to an "Implementation" contract. All other addresses can be found in the folder `.openzeppelin/${network}.json`.

## Polygon

| Contract               | Address (proxy)                                                                                                          |
| ---------------------- | ------------------------------------------------------------------------------------------------------------------------ |
| UnionToken             | [0x7c009F092395C35BDD87C74D2a907B0E3115026a](https://polygonscan.com/address/0x7c009F092395C35BDD87C74D2a907B0E3115026a) |
| UserManager            | [0xd99ccdb6E05937e53EFDb099eeAe33D559b20F90](https://polygonscan.com/address/0xd99ccdb6E05937e53EFDb099eeAe33D559b20F90) |
| MarketRegistry         | [0x8090733bBE6004B54c92284142568A32df56d97A](https://polygonscan.com/address/0x8090733bBE6004B54c92284142568A32df56d97A) |
| UToken (DAI)           | [0xA0e739fF8E0F56346EDc0eb99Bb1478173Ee73ad](https://polygonscan.com/address/0xA0e739fF8E0F56346EDc0eb99Bb1478173Ee73ad) |
| AssetManager           | [0x64ADBC200cE099B2B029FDF59a5E86Facb751911](https://polygonscan.com/address/0x64ADBC200cE099B2B029FDF59a5E86Facb751911) |
| AaveAdapter            | [0x601b9399eccf091cD5EC4CdB58A835bfbCe19C4E](https://polygonscan.com/address/0x601b9399eccf091cD5EC4CdB58A835bfbCe19C4E) |
| PureTokenAdapter       | [0x2F4076c06bB4b5933D8c9E45F2298C45e61139EB](https://polygonscan.com/address/0x2F4076c06bB4b5933D8c9E45F2298C45e61139EB) |
| Governor               | [0x7e376e9eccD105CA47f2d7EdE8e106A6F72F4C9B](https://polygonscan.com/address/0x7e376e9eccD105CA47f2d7EdE8e106A6F72F4C9B) |
| Comptroller            | [0x749D7D8bc289805aED3e5B55A7A38292596DE389](https://polygonscan.com/address/0x749D7D8bc289805aED3e5B55A7A38292596DE389) |
| FixedInterestRateModel | [0x75B3B799a80d36EE3E85E0216062313f623D3515](https://polygonscan.com/address/0x75B3B799a80d36EE3E85E0216062313f623D3515) |
| DAI                    | [0x8f3cf7ad23cd3cadbd9735aff958023239c6a063](https://polygonscan.com/address/0x8f3cf7ad23cd3cadbd9735aff958023239c6a063) |

## Rinkeby

| Contract         | Address (proxy)                                                                                                               |
| ---------------- | ----------------------------------------------------------------------------------------------------------------------------- |
| UnionToken       | [0xc16C4B33538261a80fcd2eE74EBD26fd7f4d2D89](https://rinkeby.etherscan.io/address/0xc16C4B33538261a80fcd2eE74EBD26fd7f4d2D89) |
| UserManager      | [0x601d3E70F74744913Ad10Abb81F8118D78B9F901](https://rinkeby.etherscan.io/address/0x601d3E70F74744913Ad10Abb81F8118D78B9F901) |
| MarketRegistry   | [0xf7D7d933e10947Ea17d8439795a5acbCC34afd0e](https://rinkeby.etherscan.io/address/0xf7D7d933e10947Ea17d8439795a5acbCC34afd0e) |
| UToken (DAI)     | [0x286dc33F2fE0D3C4368cc00b2643945249F6555A](https://rinkeby.etherscan.io/address0x286dc33F2fE0D3C4368cc00b2643945249F6555A/) |
| AssetManager     | [0xd0493c674156566f363ff3B6980c1E64742EEde8](https://rinkeby.etherscan.io/address/0xd0493c674156566f363ff3B6980c1E64742EEde8) |
| CompoundAdapter  | [0x754C2AE32731ca47d50323c9A6B60822AbA75f64](https://rinkeby.etherscan.io/address/0x754C2AE32731ca47d50323c9A6B60822AbA75f64) |
| PureTokenAdapter | [0x30f4aC291FA664eFc1d4622827cbD628ff0Ce7C0](https://rinkeby.etherscan.io/address/0x30f4aC291FA664eFc1d4622827cbD628ff0Ce7C0) |
| Governor         | [0x51658ff9283BdFAFF845F99Fe693a1Dc0bDF44a7](https://rinkeby.etherscan.io/address/0x51658ff9283BdFAFF845F99Fe693a1Dc0bDF44a7) |
| Rinkeby DAI      | [0x5592ec0cfb4dbc12d3ab100b257153436a1f0fea](https://rinkeby.etherscan.io/address/0x5592ec0cfb4dbc12d3ab100b257153436a1f0fea) |
| Rinkeby cDAI     | [0x6d7f0754ffeb405d23c51ce938289d4835be3b14](https://rinkeby.etherscan.io/address/0x6d7f0754ffeb405d23c51ce938289d4835be3b14) |
| Treasury 1       | [0x8c6149A463212A9f388D83e61d724c36b8E5dd12](https://rinkeby.etherscan.io/address/0x8c6149A463212A9f388D83e61d724c36b8E5dd12) |
| Treasury 2       | [0xb8396845897588A45E3653e9EFd4098C218EC89D](https://rinkeby.etherscan.io/address/0xb8396845897588A45E3653e9EFd4098C218EC89D) |

## Kovan

| Contract         | Address (proxy)                                                                                                             |
| ---------------- | --------------------------------------------------------------------------------------------------------------------------- |
| UnionToken       | [0x502f559143548ac80BE6c5Df46e1bDA7f2B812ae](https://kovan.etherscan.io/address/0x502f559143548ac80BE6c5Df46e1bDA7f2B812ae) |
| UserManager      | [0xb31718904B5ed1FD2912Fa18957568f38845cC0f](https://kovan.etherscan.io/address/0xb31718904B5ed1FD2912Fa18957568f38845cC0f) |
| MarketRegistry   | [0x4F68CcFE005750F6a39504b71B02076cF8Fc68cC](https://kovan.etherscan.io/address/0x4F68CcFE005750F6a39504b71B02076cF8Fc68cC) |
| Comptroller      | [0xD869611a8A6d468A0113d0D48639D6fE33c56b27](https://kovan.etherscan.io/address/0xD869611a8A6d468A0113d0D48639D6fE33c56b27) |
| UToken (DAI)     | [0x1474DDc49655794A479947aA9b3B3563CeaA2e19](https://kovan.etherscan.io/address/0x1474DDc49655794A479947aA9b3B3563CeaA2e19) |
| AssetManager     | [0x1c73d973dE8FcE3Ae2A072d0d15C9060A2ddbd7B](https://kovan.etherscan.io/address/0x1c73d973dE8FcE3Ae2A072d0d15C9060A2ddbd7B) |
| CompoundAdapter  | [0xaf7bbAc0284a3b5D7472c10dDF37Cc23c4c20EAC](https://kovan.etherscan.io/address/0xaf7bbAc0284a3b5D7472c10dDF37Cc23c4c20EAC) |
| PureTokenAdapter | [0x4aa4B980C67F5A482046E0309333130cA7bFC483](https://kovan.etherscan.io/address/0x4aa4B980C67F5A482046E0309333130cA7bFC483) |
| Governor         | [0x9045476cCAf43457D8246F1821A340D0E333E15B](https://kovan.etherscan.io/address/0x9045476cCAf43457D8246F1821A340D0E333E15B) |
| Timelock         | [0x733Cf6612f2b208344EdA8fbbD7Ede87D01Fd46F](https://kovan.etherscan.io/address/0x733Cf6612f2b208344EdA8fbbD7Ede87D01Fd46F) |
| Kovan DAI        | [0x4f96fe3b7a6cf9725f59d353f723c1bdb64ca6aa](https://kovan.etherscan.io/address/0x4f96fe3b7a6cf9725f59d353f723c1bdb64ca6aa) |
| Kovan cDAI       | [0xf0d0eb522cfa50b716b3b1604c4f0fa6f04376ad](https://kovan.etherscan.io/address/0xf0d0eb522cfa50b716b3b1604c4f0fa6f04376ad) |
| Treasury 1       | [0xe70c89F37598e6a3B9DB48b7706998Fd18aC9Be0](https://kovan.etherscan.io/address/0xe70c89F37598e6a3B9DB48b7706998Fd18aC9Be0) |
| Treasury 2       | [0x421e4F40977F724Ca15d1dD1a3F9f893dB4883De](https://kovan.etherscan.io/address/0x421e4F40977F724Ca15d1dD1a3F9f893dB4883De) |

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
