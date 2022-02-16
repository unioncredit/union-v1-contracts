const configs = require("../deployConfig.js");

module.exports = async ({getNamedAccounts, deployments, network}) => {
    const {deploy} = deployments;
    const {deployer} = await getNamedAccounts();

    const chainId = await getChainId();

    if (network.name !== "arbitrumRinkeby" && network.name !== "arbitrum") {
        await deploy("TimelockController", {
            from: deployer,
            args: [configs[chainId]["TimelockController"]["minDelay"], [deployer], [deployer]],
            log: true
        });
    }
};
module.exports.tags = ["TimelockController"];
