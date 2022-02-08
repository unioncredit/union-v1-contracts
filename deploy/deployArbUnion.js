const configs = require("../deployConfig.js");

module.exports = async ({getNamedAccounts, deployments}) => {
    const {deploy} = deployments;
    const {deployer} = await getNamedAccounts();
    const chainId = await getChainId();

    await deploy("ArbUnion", {
        from: deployer,
        args: [configs[chainId]["ArbL2Gateway"], configs[chainId]["ArbUnionWrapper"]],
        log: true
    });
};
module.exports.tags = ["ArbUnion", "Arbitrum"];
