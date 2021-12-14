const {ethers} = require("hardhat");
const parseUnits = ethers.utils.parseUnits;

var configs = {
    1: {
        Guardian: "0x48ea9B2d86744E19321361Fa3C0D7bBE1F8D5a8E",
        Admin: "0xD83b4686e434B402c2Ce92f4794536962b2BE3E8",
        DAI: "0x6b175474e89094c44da98b954eedeac495271d0f",
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
            lendingPool: "0x7d2768dE32b0b80b7a3454c06BdAc94A69DDc7A9"
        },
        FixedInterestRateModel: {
            interestRatePerBlock: "41668836919" // 10% APR, 41668836919 x 6575 (blocks per day) x 365,
        },
        UDai: {
            name: "uDAI",
            symbol: "uDAI",
            initialExchangeRateMantissa: parseUnits("1"), // 100%,
            reserveFactorMantissa: parseUnits("1"), // 100%
            originationFee: parseUnits("0.5"), // 0.5%
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
            dripStart: "1640131200", // 2021/12/22 00:00:00 GMT+0000
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
            initialProposalThreshold: parseUnits("1000000")
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
            aaveTokenCeiling: "1000000000000000000000000",
            aaveTokenFloor: "10000000000000000000000"
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
            dripStart: "1640131200", // 2021/12/22 00:00:00 GMT+0000
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
            initialProposalThreshold: parseUnits("1000000")
        }
    },
    4: {
        Guardian: "",
        Admin: "",
        DAI: "0x5592ec0cfb4dbc12d3ab100b257153436a1f0fea",
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
            cDAI: "0x6d7f0754ffeb405d23c51ce938289d4835be3b14",
            cComptroller: "0x2eaa9d77ae4d8f9cdd9faacd44016e746485bddb"
        },
        AaveAdapter: {
            aaveTokenCeiling: "1000000000000000000000000",
            aaveTokenFloor: "10000000000000000000000",
            lendingPool: "0x1cbaf7ef4f34c6be06ed5860ceeecac5e3042c47"
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
            overdueBlocks: "17280"
        },
        SumOfTrust: {
            effectiveNumber: "3"
        },
        UnionToken: {
            name: "Union Token",
            symbol: "UNION",
            mintingAllowedAfter: "1633061850",
            comptrollerAmount: "10000000000000000000000000", //10m
            amountForTreasuryVester: "150000000000000000000000000", //150m,
            amountForTreasury: "40000000000000000000000000" //40m
        },
        TreasuryVester: {
            vestingAmount: "20000000000000000000000000",
            vestingBegin: "1630478173718",
            vestingCliff: "1630478173718",
            vestingEnd: "1630488714518"
        },
        Treasury: {
            dripStart: "1630478703907",
            dripRate: "1000000000000000000",
            dripAmount: "20000000000000000000000000"
        },
        TimelockController: {
            minDelay: "0"
        },
        UserManager: {
            maxStakeAmount: parseUnits("5000"),
            newMemberFee: parseUnits("1")
        },
        UnionGovernor: {
            initialVotingDelay: "6575",
            initialVotingPeriod: "19725",
            initialProposalThreshold: parseUnits("1000000")
        }
    },
    42: {
        Guardian: "",
        Admin: "",
        DAI: "0x4f96fe3b7a6cf9725f59d353f723c1bdb64ca6aa",
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
            cDAI: "0xf0d0eb522cfa50b716b3b1604c4f0fa6f04376ad",
            cComptroller: "0x5eae89dc1c671724a672ff0630122ee834098657"
        },
        AaveAdapter: {
            ceiling: "100000000000000000000000",
            floor: "25000000000000000000000",
            market: "",
            lendingPool: "0xE0fBa4Fc209b4948668006B2bE61711b7f465bAe"
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
            mintingAllowedAfter: "1638921600", // 2021/12/08 00:00:00 UTC+0
            comptrollerAmount: "10000000000000000000000000", //10m
            amountForTreasuryVester: "150000000000000000000000000", //150m,
            amountForTreasury: "40000000000000000000000000" //40m
        },
        TreasuryVester: {
            vestingAmount: "20000000000000000000000000",
            vestingBegin: "1630478173718",
            vestingCliff: "1630478173718",
            vestingEnd: "1630488714518"
        },
        Treasury: {
            dripStart: "1630478703907",
            dripRate: "1000000000000000000",
            dripAmount: "20000000000000000000000000"
        },
        TimelockController: {
            minDelay: "0"
        },
        UserManager: {
            maxStakeAmount: parseUnits("5000"),
            newMemberFee: parseUnits("1")
        },
        UnionGovernor: {
            initialVotingDelay: "6575",
            initialVotingPeriod: "19725",
            initialProposalThreshold: parseUnits("1000000")
        }
    }
};

module.exports = configs;
