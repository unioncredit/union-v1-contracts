const configs = require("../deployConfig.js");

module.exports = async ({getNamedAccounts, deployments, getChainId, network}) => {
    const {deploy} = deployments;
    const {deployer} = await getNamedAccounts();
    const chainId = await getChainId();
    if (configs[chainId]["AaveAdapter"]) {
        const assetManager = await deployments.get("AssetManager");
        const lendingPool =
            network.name === "hardhat"
                ? (await deployments.get("AaveMock")).address
                : configs[chainId]["AaveAdapter"]["lendingPool"];
        await deploy("AaveAdapter", {
            from: deployer,
            proxy: {
                proxyContract: "UUPSProxy",
                execute: {
                    methodName: "__AaveAdapter_init",
                    args: [assetManager.address, lendingPool]
                }
            },
            log: true
        });
    }
};
module.exports.tags = ["AaveAdapter"];
module.exports.dependencies = ["AssetManager", "Aave"];
