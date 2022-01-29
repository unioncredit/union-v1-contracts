module.exports = async ({getNamedAccounts, deployments, getChainId}) => {
    const {deploy} = deployments;
    const {deployer} = await getNamedAccounts();

    const marketRegistry = await deployments.get("MarketRegistry");

    await deploy("AssetManager", {
        from: deployer,
        proxy: {
            proxyContract: "UUPSProxy",
            execute: {
                methodName: "__AssetManager_init",
                args: [marketRegistry.address]
            }
        },
        log: true
    });
};
module.exports.tags = ["AssetManager", "Arbitrum"];
module.exports.dependencies = ["DAI", "MarketRegistry"]; // this ensure the XX script above is executed first, so `deployments.get('XX')` succeeds
