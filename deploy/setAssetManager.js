const configs = require("../deployConfig.json");

module.exports = async ({getNamedAccounts, getChainId, network}) => {
    const {execute} = deployments;
    const {deployer} = await getNamedAccounts();
    const chainId = await getChainId();

    const DAI = network.name === "hardhat" ? (await deployments.get("FaucetERC20")).address : configs[chainId]["DAI"];

    await execute("AssetManager", {from: deployer}, "addAdapter", (await deployments.get("AaveAdapter")).address);

    await execute("AssetManager", {from: deployer}, "addAdapter", (await deployments.get("CompoundAdapter")).address);

    await execute("AssetManager", {from: deployer}, "addAdapter", (await deployments.get("PureTokenAdapter")).address);

    await execute("AssetManager", {from: deployer}, "addToken", DAI);

    await execute(
        "AssetManager",
        {from: deployer},
        "changeWithdrawSequence",
        configs[chainId]["AssetManager"]["newSeq"]
    );
};

module.exports.tags = ["AssetManagerSetting"];
module.exports.dependencies = ["AaveAdapter", "CompoundAdapter", "PureTokenAdapter"];
