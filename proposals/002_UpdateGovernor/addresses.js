const getAddresses = chainId => {
    switch (chainId) {
        case "1":
            return {
                timelockAddress: "0xBBD3321f377742c4b3fe458b270c2F271d3294D8",
                governorAddress: "0x011e5846975c6463a8c6337EECF3cbF64e328884",
                newGovernorAddress: ""
            };
        case "42":
            return {
                timelockAddress: "0x107e3811900A93940cE8694fF9C6217Be900faAF",
                governorAddress: "0x7C1c7330EcC771C24f5De5b0Ce925Fde3A631c45",
                newGovernorAddress: "0x2aB13c159c2A2c001910239698Da970f56A4D1Aa"
            };
        case "31337":
            return {
                unionTokenAddress: "0x5Dfe42eEA70a3e6f93EE54eD9C321aF07A85535C",
                timelockAddress: "0xBBD3321f377742c4b3fe458b270c2F271d3294D8",
                governorAddress: "0x011e5846975c6463a8c6337EECF3cbF64e328884"
            };
        default:
            throw new Error("Unsupported network");
    }
};
module.exports = getAddresses;
