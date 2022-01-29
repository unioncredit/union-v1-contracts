const getAddresses = chainId => {
    switch (chainId) {
        case "1":
            return {
                unionTokenAddress: "0x5Dfe42eEA70a3e6f93EE54eD9C321aF07A85535C",
                timelockAddress: "0xBBD3321f377742c4b3fe458b270c2F271d3294D8",
                governorAddress: "0x011e5846975c6463a8c6337EECF3cbF64e328884",
                newGovernorAddress: "0xe1b3F07a9032F0d3deDf3E96c395A4Da74130f6e"
            };
        case "42":
            return {
                unionTokenAddress: "0x08AF898e65493D8212c8981FAdF60Ff023A91150",
                timelockAddress: "0x107e3811900A93940cE8694fF9C6217Be900faAF",
                governorAddress: "0x7C1c7330EcC771C24f5De5b0Ce925Fde3A631c45",
                newGovernorAddress: "0x2aB13c159c2A2c001910239698Da970f56A4D1Aa",
                userManagerAddress: "0x391fDb669462FBAA5a7e228f3857281BeCf235EE"
            };
        case "31337": // Use mainnet addresses for the simulation
            return {
                unionTokenAddress: "0x5Dfe42eEA70a3e6f93EE54eD9C321aF07A85535C",
                timelockAddress: "0xBBD3321f377742c4b3fe458b270c2F271d3294D8",
                governorAddress: "0x011e5846975c6463a8c6337EECF3cbF64e328884",
                userManagerAddress: "0x49c910Ba694789B58F53BFF80633f90B8631c195"
            };
        default:
            throw new Error("Unsupported network");
    }
};
module.exports = getAddresses;
