const configs = require("../deployConfig.js");

module.exports = async ({getNamedAccounts, getChainId, deployments}) => {
    const {deploy} = deployments;
    const {deployer} = await getNamedAccounts();
    const chainId = await getChainId();
    if (configs[chainId]["CompoundAdapter"]) {
        const assetManager = await deployments.get("AssetManager");
        const comptroller =
            network.name === "hardhat"
                ? (await deployments.get("CompoundMock")).address
                : configs[chainId]["CompoundAdapter"]["cComptroller"];
        await deploy("CompoundAdapter", {
            from: deployer,
            proxy: {
                proxyContract: "UUPSProxy",
                execute: {
                    methodName: "__CompoundAdapter_init",
                    args: [assetManager.address, comptroller]
                }
            },
            log: true
        });
    }
};
module.exports.tags = ["CompoundAdapter"];
module.exports.dependencies = ["AssetManager", "Compound"];
