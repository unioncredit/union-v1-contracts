const configs = require("../deployConfig.js");

module.exports = async ({getNamedAccounts, deployments, getChainId}) => {
    const {deploy} = deployments;
    const {deployer} = await getNamedAccounts();
    const chainId = await getChainId();
    const unionToken = await deployments.get("UnionToken");

    if (
        configs[chainId].ArbConnector &&
        configs[chainId].ArbConnector.l1GatewayRouter &&
        configs[chainId].ArbConnector.destinationAddress
    ) {
        await deploy("ArbConnector", {
            from: deployer,
            args: [
                unionToken.address,
                configs[chainId].ArbConnector.l1GatewayRouter,
                configs[chainId].ArbConnector.destinationAddress
            ],
            log: true
        });

        const arbConnector = await deployments.get("ArbConnector");
        await arbConnector.approveToken();
    }
};
module.exports.tags = ["ArbConnector"];
module.exports.dependencies = ["UnionToken"];
