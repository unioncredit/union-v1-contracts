const {ethers} = require("hardhat");
const parseUnits = ethers.utils.parseUnits;

var configs = {
    1: {
        Guardian: "0x48ea9B2d86744E19321361Fa3C0D7bBE1F8D5a8E",
        Admin: "0xD83b4686e434B402c2Ce92f4794536962b2BE3E8",
        DAI: "0x6b175474e89094c44da98b954eedeac495271d0f",
        ArbL1Router: "0x72Ce9c846789fdB6fC1f34aC4AD25Dd9ef7031ef",
        ArbL1Gateway: "0xcEe284F754E854890e311e3280b767F80797180d",
        ArbComptroller: "", //l2 comptroller
        ArbUnion: "", // l2 union token
        AssetManager: {
            newSeq: [0, 1, 2]
        },
        PureTokenAdapter: {
            floor: parseUnits("50000"),
            ceiling: parseUnits("1000000000")
        },
        CompoundAdapter: {
            floor: parseUnits("25000"),
            ceiling: parseUnits("100000"),
            cComptroller: "0x3d9819210a31b4961b30ef54be2aed79b9c9cd3b",
            cDAI: "0x5d3a536e4d6dbd6114cc1ead35777bab948e3643"
        },
        AaveAdapter: {
            floor: parseUnits("25000"),
            ceiling: parseUnits("100000"),
            market: "0xd784927Ff2f95ba542BfC824c8a8a98F3495f6b5",
            lendingPool: "0x7d2768dE32b0b80b7a3454c06BdAc94A69DDc7A9",
            aDAI: "0x028171bCA77440897B824Ca71D1c56caC55b68A3"
        },
        FixedInterestRateModel: {
            interestRatePerBlock: "41668836919" // 10% APR, 41668836919 x 6575 (blocks per day) x 365,
        },
        UDai: {
            name: "uDAI",
            symbol: "uDAI",
            initialExchangeRateMantissa: parseUnits("1"), // 100%,
            reserveFactorMantissa: parseUnits("1"), // 100%
            originationFee: parseUnits("0.005"), // 0.5%
            debtCeiling: parseUnits("250000"),
            maxBorrow: parseUnits("25000"),
            minBorrow: parseUnits("100"), // 100 dai
            overdueBlocks: "197250" // in blocks, 30 days
        },
        SumOfTrust: {
            effectiveNumber: "3"
        },
        UnionToken: {
            name: "Union Token",
            symbol: "UNION",
            mintingAllowedAfter: "1766361600", // 2025/12/22 00:00:00 GMT+0000
            comptrollerAmount: parseUnits("9000000"), //9m
            amountForTreasuryVester: parseUnits("150000000"), //150m
            amountForTreasury: parseUnits("40000000") //40m
        },
        TreasuryVester: {
            vestingAmount: parseUnits("150000000"), //150m
            vestingBegin: "1671667200", // 2022/12/22 00:00:00 GMT+0000
            vestingCliff: "1671667200", // 2022/12/22 00:00:00 GMT+0000
            vestingEnd: "1766361600" // 2025/12/22 00:00:00 GMT+0000
        },
        Treasury: {
            dripStart: "", // in blocks, leave empty to use the current block number
            dripRate: parseUnits("1"),
            dripAmount: parseUnits("20000000") //20m
        },
        TimelockController: {
            minDelay: "86400" // in seconds, 1 day
        },
        UserManager: {
            maxStakeAmount: parseUnits("5000"),
            newMemberFee: parseUnits("1")
        },
        UnionGovernor: {
            initialVotingDelay: "6575",
            initialVotingPeriod: "19725",
            initialProposalThreshold: parseUnits("10000000")
        }
    },
    31337: {
        Guardian: "",
        Admin: "",
        DAI: "",
        AssetManager: {
            newSeq: [0]
        },
        PureTokenAdapter: {
            ceiling: "1000000000000000000000000",
            floor: "10000000000000000000000"
        },
        CompoundAdapter: {
            ceiling: "1000000000000000000000000",
            floor: "10000000000000000000000",
            cDAI: "",
            cComptroller: ""
        },
        AaveAdapter: {
            ceiling: "1000000000000000000000000",
            floor: "10000000000000000000000"
        },
        FixedInterestRateModel: {
            interestRatePerBlock: "95129375951"
        },
        UDai: {
            name: "uDAI",
            symbol: "uDAI",
            initialExchangeRateMantissa: "1000000000000000000",
            reserveFactorMantissa: "500000000000000000",
            originationFee: "10000000000000000",
            debtCeiling: "1000000000000000000000000",
            maxBorrow: "10000000000000000000000",
            minBorrow: "1000000000000000000",
            overdueBlocks: "57000"
        },
        SumOfTrust: {
            effectiveNumber: "3"
        },
        UnionToken: {
            name: "Union Token",
            symbol: "UNION",
            mintingAllowedAfter: "1766361600", // 2025/12/22 00:00:00 GMT+0000
            comptrollerAmount: parseUnits("9000000"), //9m
            amountForTreasuryVester: parseUnits("150000000"), //150m
            amountForTreasury: parseUnits("40000000") //40m
        },
        TreasuryVester: {
            vestingAmount: parseUnits("150000000"), //150m
            vestingBegin: "1671667200", // 2022/12/22 00:00:00 GMT+0000
            vestingCliff: "1671667200", // 2022/12/22 00:00:00 GMT+0000
            vestingEnd: "1766361600" // 2025/12/22 00:00:00 GMT+0000
        },
        Treasury: {
            dripStart: "", // in blocks, leave empty to use the current block number
            dripRate: parseUnits("1"),
            dripAmount: parseUnits("20000000") //20m
        },
        TimelockController: {
            minDelay: "86400" // 1 day
        },
        UserManager: {
            maxStakeAmount: parseUnits("5000"),
            newMemberFee: parseUnits("1")
        },
        UnionGovernor: {
            initialVotingDelay: "6575",
            initialVotingPeriod: "19725",
            initialProposalThreshold: parseUnits("10000000")
        }
    },
    42: {
        // kovan
        Guardian: "0x55C296592acDb317050c84C5eBF4eecCa85a0D8f",
        Admin: "0x012eE3D0f6A28636734c2B3BA6027Fb2a672c539",
        DAI: "0x4f96fe3b7a6cf9725f59d353f723c1bdb64ca6aa",
        AssetManager: {
            newSeq: [0, 1]
        },
        PureTokenAdapter: {
            floor: parseUnits("50000"),
            ceiling: parseUnits("1000000000")
        },
        CompoundAdapter: {
            floor: parseUnits("25000"),
            ceiling: parseUnits("100000"),
            cDAI: "0xf0d0eb522cfa50b716b3b1604c4f0fa6f04376ad",
            cComptroller: "0x5eae89dc1c671724a672ff0630122ee834098657"
        },
        // AaveAdapter: {
        //     ceiling: "100000000000000000000000",
        //     floor: "25000000000000000000000",
        //     market: "",
        //     lendingPool: "0xE0fBa4Fc209b4948668006B2bE61711b7f465bAe"
        // },
        FixedInterestRateModel: {
            interestRatePerBlock: "41668836919" // 10% APR, 41668836919 x 6575 (blocks per day) x 365,
        },
        UDai: {
            name: "uDAI",
            symbol: "uDAI",
            initialExchangeRateMantissa: parseUnits("1"), // 100%,
            reserveFactorMantissa: parseUnits("1"), // 100%
            originationFee: parseUnits("0.005"), // 0.5%
            debtCeiling: parseUnits("250000"),
            maxBorrow: parseUnits("25000"),
            minBorrow: parseUnits("100"), // 100 dai
            overdueBlocks: "197250" // in blocks, 30 days
        },
        SumOfTrust: {
            effectiveNumber: "3"
        },
        UnionToken: {
            name: "Union Token",
            symbol: "UNION",
            mintingAllowedAfter: "1639582200", // 2021/12/15 15:30:00 GMT+0000
            comptrollerAmount: parseUnits("9000000"), //9m
            amountForTreasuryVester: parseUnits("150000000"), //150m
            amountForTreasury: parseUnits("40000000") //40m
        },
        TreasuryVester: {
            vestingAmount: parseUnits("150000000"), //150m
            vestingBegin: "1639582200", // 2021/12/15 15:30:00 GMT+0000
            vestingCliff: "1639582200", // 2021/12/15 15:30:00 GMT+0000
            vestingEnd: "1639668600" // 2021/12/16 15:30:00 GMT+0000
        },
        Treasury: {
            dripStart: "", // in blocks, leave empty to use the current block number
            dripRate: parseUnits("1"),
            dripAmount: parseUnits("20000000") //20m
        },
        TimelockController: {
            minDelay: "60" // in seconds, 1 min
        },
        UserManager: {
            maxStakeAmount: parseUnits("5000"),
            newMemberFee: parseUnits("1")
        },
        UnionGovernor: {
            initialVotingDelay: "5", // 1 min
            initialVotingPeriod: "274", // 1 hr
            initialProposalThreshold: parseUnits("10000000")
        }
    },
    4: {
        // rinkeby
        Guardian: "0x7a0C61EdD8b5c0c5C1437AEb571d7DDbF8022Be4",
        Admin: "0x7a0C61EdD8b5c0c5C1437AEb571d7DDbF8022Be4",
        DAI: "0x5592EC0cfb4dbc12D3aB100b257153436a1f0FEa",
        ArbL1Router: "0x70C143928eCfFaf9F5b406f7f4fC28Dc43d68380",
        ArbL1Gateway: "0x917dc9a69F65dC3082D518192cd3725E1Fa96cA2",
        ArbComptroller: "0x792E4526F15432849879db96e03e9212eBD7775C", //l2 comptroller
        ArbUnion: "0x9e21ca9e50823F90eC1604477884cab5491eF0AB", // L2 union token
        AssetManager: {
            newSeq: [0, 1]
        },
        PureTokenAdapter: {
            floor: parseUnits("50000"),
            ceiling: parseUnits("1000000000")
        },
        CompoundAdapter: {
            floor: parseUnits("25000"),
            ceiling: parseUnits("100000"),
            cComptroller: "0x2eaa9d77ae4d8f9cdd9faacd44016e746485bddb",
            cDAI: "0x6d7f0754ffeb405d23c51ce938289d4835be3b14"
        },
        FixedInterestRateModel: {
            interestRatePerBlock: "41668836919" // 10% APR, 41668836919 x 6575 (blocks per day) x 365,
        },
        UDai: {
            name: "uDAI",
            symbol: "uDAI",
            initialExchangeRateMantissa: parseUnits("1"), // 100%,
            reserveFactorMantissa: parseUnits("1"), // 100%
            originationFee: parseUnits("0.005"), // 0.5%
            debtCeiling: parseUnits("250000"),
            maxBorrow: parseUnits("25000"),
            minBorrow: parseUnits("100"), // 100 dai
            overdueBlocks: "197250" // in blocks, 30 days
        },
        SumOfTrust: {
            effectiveNumber: "3"
        },
        UnionToken: {
            name: "Union Token",
            symbol: "UNION",
            mintingAllowedAfter: "1766361600", // 2025/12/22 00:00:00 GMT+0000
            comptrollerAmount: parseUnits("9000000"), //9m
            amountForTreasuryVester: parseUnits("150000000"), //150m
            amountForTreasury: parseUnits("40000000") //40m
        },
        TreasuryVester: {
            vestingAmount: parseUnits("150000000"), //150m
            vestingBegin: "1671667200", // 2022/12/22 00:00:00 GMT+0000
            vestingCliff: "1671667200", // 2022/12/22 00:00:00 GMT+0000
            vestingEnd: "1766361600" // 2025/12/22 00:00:00 GMT+0000
        },
        Treasury: {
            dripStart: "", // in blocks, leave empty to use the current block number
            dripRate: parseUnits("1"),
            dripAmount: parseUnits("20000000") //20m
        },
        TimelockController: {
            minDelay: "300" // in seconds, 1 day
        },
        UserManager: {
            maxStakeAmount: parseUnits("5000"),
            newMemberFee: parseUnits("1")
        },
        UnionGovernor: {
            initialVotingDelay: "10",
            initialVotingPeriod: "20",
            initialProposalThreshold: parseUnits("10000000")
        }
    },
    42161: {
        // arbitrum one
        Guardian: "0x123e6014ae4e4409213f412052072b8A20c320f8",
        Admin: "0xd3f60bE7B55EFEb9Bc5df4606C103814C4F4ead7",
        DAI: "0xDA10009cBd5D07dd0CeCc66161FC93D7c9000da1",
        Timelock: "0xCce4321F377742C4B3FE458B270c2f271d32A5e9", // L2 address of the L1 timelock
        ArbUnionWrapper: "", // L1 ArbUnionWrapper
        ArbL2Gateway: "0x096760F208390250649E3e8763348E783AEF5562",
        AssetManager: {
            newSeq: [0]
        },
        PureTokenAdapter: {
            floor: parseUnits("50000"),
            ceiling: parseUnits("1000000000")
        },
        FixedInterestRateModel: {
            interestRatePerBlock: "41668836919" // 10% APR, 41668836919 x 6575 (blocks per day) x 365,
        },
        UDai: {
            name: "uDAI",
            symbol: "uDAI",
            initialExchangeRateMantissa: parseUnits("1"), // 100%,
            reserveFactorMantissa: parseUnits("1"), // 100%
            originationFee: parseUnits("0.005"), // 0.5%
            debtCeiling: parseUnits("250000"),
            maxBorrow: parseUnits("25000"),
            minBorrow: parseUnits("100"), // 100 dai
            overdueBlocks: "197250" // in blocks, 30 days
        },
        SumOfTrust: {
            effectiveNumber: "3"
        },
        UserManager: {
            maxStakeAmount: parseUnits("5000"),
            newMemberFee: parseUnits("1")
        }
    },
    421611: {
        // arbitrum rinkeby
        Guardian: "0x80e220f2799345E8d99C41f104cA052B99b43398",
        Admin: "0x80e220f2799345E8d99C41f104cA052B99b43398",
        DAI: "0x5364Dc963c402aAF150700f38a8ef52C1D7D7F14",
        Timelock: "0x6D498eFD55D13775Ac99ccBA1395eF1ef17383C3", // L1 timelock on L2 address
        ArbUnionWrapper: "0x2A35533E70aeB0b3e8309716227fA56aF9bD95C1", // L1 ArbUnionWrapper
        ArbL2Gateway: "0x9b014455AcC2Fe90c52803849d0002aeEC184a06",
        AssetManager: {
            newSeq: [0]
        },
        PureTokenAdapter: {
            floor: parseUnits("50000"),
            ceiling: parseUnits("1000000000")
        },
        FixedInterestRateModel: {
            interestRatePerBlock: "41668836919" // 10% APR, 41668836919 x 6575 (blocks per day) x 365,
        },
        UDai: {
            name: "uDAI",
            symbol: "uDAI",
            initialExchangeRateMantissa: parseUnits("1"), // 100%,
            reserveFactorMantissa: parseUnits("1"), // 100%
            originationFee: parseUnits("0.005"), // 0.5%
            debtCeiling: parseUnits("250000"),
            maxBorrow: parseUnits("25000"),
            minBorrow: parseUnits("100"), // 100 dai
            overdueBlocks: "197250" // in blocks, 30 days
        },
        SumOfTrust: {
            effectiveNumber: "3"
        },
        UserManager: {
            maxStakeAmount: parseUnits("5000"),
            newMemberFee: parseUnits("1")
        }
    }
};

module.exports = configs;
