var configs = {
    31337: {
        Guardian: "",
        Admin: "",
        DAI: "",
        cDAI: "",
        AssetManager: {
            newSeq: [0]
        },
        PureTokenAdapter: {
            pureTokenCeiling: "1000000000000000000000000",
            pureTokenFloor: "10000000000000000000000"
        },
        AaveAdapter: {
            aaveTokenCeiling: "1000000000000000000000000",
            aaveTokenFloor: "10000000000000000000000"
        },
        CompoundAdapter: {
            compoundTokenCeiling: "1000000000000000000000000",
            compoundTokenFloor: "10000000000000000000000"
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
            mintingAllowedAfter: "1640942403", // a timestamp after the deployment
            comptrollerAmount: "1000000000000000000000000",
            amountForTreasuryVester: "14000000000000000000000000"
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
            maxStakeAmount: "100000000000000000000000"
        }
    },
    4: {
        Guardian: "",
        Admin: "",
        DAI: "0x5592ec0cfb4dbc12d3ab100b257153436a1f0fea",
        cDAI: "0x6d7f0754ffeb405d23c51ce938289d4835be3b14",
        AssetManager: {
            newSeq: [0]
        },
        PureTokenAdapter: {
            pureTokenCeiling: "1000000000000000000000000",
            pureTokenFloor: "10000000000000000000000"
        },
        AaveAdapter: {
            aaveTokenCeiling: "1000000000000000000000000",
            aaveTokenFloor: "10000000000000000000000",
            lendingPool: "0x1cbaf7ef4f34c6be06ed5860ceeecac5e3042c47"
        },
        CompoundAdapter: {
            compoundTokenCeiling: "1000000000000000000000000",
            compoundTokenFloor: "10000000000000000000000"
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
            comptrollerAmount: "1000000000000000000000000",
            amountForTreasuryVester: "14000000000000000000000000"
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
            maxStakeAmount: "100000000000000000000000"
        }
    },
    42: {
        Guardian: "0x55C296592acDb317050c84C5eBF4eecCa85a0D8f",
        Admin: "0x012eE3D0f6A28636734c2B3BA6027Fb2a672c539",
        DAI: "0x4f96fe3b7a6cf9725f59d353f723c1bdb64ca6aa",
        cDAI: "0xf0d0eb522cfa50b716b3b1604c4f0fa6f04376ad",
        AssetManager: {
            newSeq: [0]
        },
        PureTokenAdapter: {
            pureTokenCeiling: "1000000000000000000000000",
            pureTokenFloor: "10000000000000000000000"
        },
        CompoundAdapter: {
            compoundTokenCeiling: "1000000000000000000000000",
            compoundTokenFloor: "10000000000000000000000"
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
            comptrollerAmount: "1000000000000000000000000",
            amountForTreasuryVester: "14000000000000000000000000"
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
            maxStakeAmount: "100000000000000000000000"
        }
    }
};

module.exports = configs;
