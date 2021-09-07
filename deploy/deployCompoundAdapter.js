module.exports = async ({getNamedAccounts, deployments}) => {
    const {deploy} = deployments;
    const {deployer} = await getNamedAccounts();
    const assetManager = await deployments.get("AssetManager");
    await deploy("CompoundAdapter", {
        from: deployer,
        proxy: {
            proxyContract: "UUPSProxy",
            execute: {
                methodName: "__CompoundAdapter_init",
                args: [assetManager.address]
            }
        },
        log: true
    });
};
module.exports.tags = ["CompoundAdapter"];
module.exports.dependencies = ["AssetManager"];
