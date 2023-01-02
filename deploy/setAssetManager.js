const configs = require("../deployConfig.js");

module.exports = async ({getNamedAccounts, getChainId, network}) => {
    const {execute, read} = deployments;
    const {deployer} = await getNamedAccounts();
    const chainId = await getChainId();

    const DAI = network.name === "hardhat" ? (await deployments.get("FaucetERC20")).address : configs[chainId]["DAI"];

    console.log("setAssetManager start");

    if (0 == (await read("AssetManager", {from: deployer}, "moneyMarketsCount"))) {
        tx = await execute(
            "AssetManager",
            {from: deployer},
            "addAdapter",
            (
                await deployments.get("PureTokenAdapter")
            ).address
        );
        console.log("AssetManager addAdapter PureTokenAdapter, tx is:", tx.transactionHash);
    }

    if (configs[chainId]["CompoundAdapter"]) {
        tx = await execute(
            "AssetManager",
            {from: deployer},
            "addAdapter",
            (
                await deployments.get("CompoundAdapter")
            ).address
        );
        console.log("AssetManager addAdapter CompoundAdapter, tx is:", tx.transactionHash);
    }

    if (configs[chainId]["AaveAdapter"]) {
        tx = await execute(
            "AssetManager",
            {from: deployer},
            "addAdapter",
            (
                await deployments.get("AaveAdapter")
            ).address
        );
        console.log("AssetManager addAdapter AaveAdapter, tx is:", tx.transactionHash);
    }

    if (!(await read("AssetManager", {from: deployer}, "isMarketSupported", DAI))) {
        console.log(DAI);
        tx = await execute("AssetManager", {from: deployer}, "addToken", DAI);
        console.log("AssetManager addToken, tx is:", tx.transactionHash);
    }

    console.log("setAssetManager end");
};

module.exports.tags = ["AssetManagerSetting", "Arbitrum"];
module.exports.dependencies = ["AaveAdapter", "CompoundAdapter", "PureTokenAdapter"];
