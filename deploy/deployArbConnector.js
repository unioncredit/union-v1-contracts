const configs = require("../deployConfig.js");

module.exports = async ({getNamedAccounts, deployments, getChainId}) => {
    const {deploy, execute} = deployments;
    const {deployer} = await getNamedAccounts();
    const chainId = await getChainId();
    const unionToken = await deployments.get("UnionToken");
    const unionWrapper = await deployments.get("ArbUnionWrapper");

    if (configs[chainId].ArbConnector && configs[chainId].ArbConnector.destinationAddress) {
        await deploy("ArbConnector", {
            from: deployer,
            args: [unionToken.address, unionWrapper.address, configs[chainId].ArbConnector.destinationAddress],
            log: true
        });

        tx = await execute("ArbConnector", {from: deployer}, "approveToken");
        console.log("ArbConnector approve, tx is:", tx.transactionHash);

        const admin = configs[chainId]["Admin"];
        tx = await execute("ArbConnector", {from: deployer}, "transferOwnership", admin);
        console.log("ArbConnector transferOwnership, tx is:", tx.transactionHash);
    }
};
module.exports.tags = ["ArbConnector"];
module.exports.dependencies = ["UnionToken", "UnionWrapper"];
