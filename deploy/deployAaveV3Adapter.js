const configs = require("../deployConfig.js");

module.exports = async ({getNamedAccounts, deployments, getChainId, network}) => {
    const {deploy} = deployments;
    const {deployer} = await getNamedAccounts();
    const chainId = await getChainId();
    if (configs[chainId]["AaveV3Adapter"]) {
        const assetManager = await deployments.get("AssetManager");
        const lendingPool =
            network.name === "hardhat"
                ? (await deployments.get("AaveMock")).address
                : configs[chainId]["AaveV3Adapter"]["lendingPool"];
        const market =
            network.name === "hardhat"
                ? (await deployments.get("AaveMock")).address
                : configs[chainId]["AaveV3Adapter"]["market"];
        await deploy("AaveV3Adapter", {
            from: deployer,
            proxy: {
                proxyContract: "UUPSProxy",
                execute: {
                    methodName: "__AaveAdapter_init",
                    args: [assetManager.address, lendingPool, market]
                }
            },
            log: true
        });
    }
};
module.exports.tags = ["AaveV3Adapter", "Arbitrum"];
module.exports.dependencies = ["AssetManager", "Aave"];
