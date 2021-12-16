const configs = require("../deployConfig.js");

module.exports = async ({getNamedAccounts, deployments, getChainId}) => {
    const {deploy} = deployments;
    const {deployer} = await getNamedAccounts();
    const chainId = await getChainId();

    const timelockController = await deployments.get("TimelockController");

    await deploy("UnionToken", {
        from: deployer,
        args: [
            configs[chainId]["UnionToken"]["name"],
            configs[chainId]["UnionToken"]["symbol"],
            timelockController.address,
            configs[chainId]["UnionToken"]["mintingAllowedAfter"]
        ],
        log: true
    });
};
module.exports.tags = ["UnionToken"];
module.exports.dependencies = ["TimelockController"];
