const configs = require("../deployConfig.js");

module.exports = async ({getNamedAccounts, deployments}) => {
    const {deploy} = deployments;
    const {deployer} = await getNamedAccounts();

    const chainId = await getChainId();

    await deploy("TimelockController", {
        from: deployer,
        args: [configs[chainId]["TimelockController"]["minDelay"], [deployer], [deployer]],
        log: true
    });
};
module.exports.tags = ["TimelockController"];
