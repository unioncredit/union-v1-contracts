const {ethers} = require("hardhat");
const parseUnits = ethers.utils.parseUnits;

var configs = {
    1: {
        Guardian: "0x48ea9B2d86744E19321361Fa3C0D7bBE1F8D5a8E",
        Admin: "0xD83b4686e434B402c2Ce92f4794536962b2BE3E8",
        DAI: "0x6b175474e89094c44da98b954eedeac495271d0f",
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
        ArbConnectorTarget: "0x195754d1027C9802cD6817F9116F49b98801Ff25", //l2 comptroller
        Guardian: "0x7a0C61EdD8b5c0c5C1437AEb571d7DDbF8022Be4",
        Admin: "0x7a0C61EdD8b5c0c5C1437AEb571d7DDbF8022Be4",
        DAI: "0x5592EC0cfb4dbc12D3aB100b257153436a1f0FEa",
        ArbL1Router: "0x70C143928eCfFaf9F5b406f7f4fC28Dc43d68380",
        ArbL1Gateway: "0x917dc9a69F65dC3082D518192cd3725E1Fa96cA2",
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
    421611: {
        // arbitrum rinkeby
        Guardian: "0x497C20fEd24D61C7506EF2500065e4fd662f3779",
        Admin: "0x497C20fEd24D61C7506EF2500065e4fd662f3779",
        DAI: "0x5364Dc963c402aAF150700f38a8ef52C1D7D7F14",
        Timelock: "0xE2Ca72AF3eEF8620F2cE33A467c99eB41e90C640", // L2 address for rinkeby timelock 0xd1B972Af3eeF8620f2cE33a467c99eB41E90b52F
        ArbUnion: "0x2583713e5373BeF68754544EeF97b550ffe716C5",
        ArbUnionWrapper: "0xf5FAaC2191f0a17162Fd1E672c89556038b7dabc",
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
