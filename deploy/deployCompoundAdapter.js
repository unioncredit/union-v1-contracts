const configs = require("../deployConfig.js");

module.exports = async ({getNamedAccounts, getChainId, deployments}) => {
    const {deploy} = deployments;
    const {deployer} = await getNamedAccounts();
    const chainId = await getChainId();
    const assetManager = await deployments.get("AssetManager");
    if (configs[chainId]["CompoundAdapter"] && configs[chainId]["cComptroller"]) {
        await deploy("CompoundAdapter", {
            from: deployer,
            proxy: {
                proxyContract: "UUPSProxy",
                execute: {
                    methodName: "__CompoundAdapter_init",
                    args: [assetManager.address, configs[chainId]["cComptroller"]]
                }
            },
            log: true
        });
    }
};
module.exports.tags = ["CompoundAdapter"];
module.exports.dependencies = ["AssetManager"];
