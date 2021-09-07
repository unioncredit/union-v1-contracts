const configs = require("../deployConfig.json");

module.exports = async ({getNamedAccounts, getChainId, network}) => {
    const {execute} = deployments;
    const {deployer} = await getNamedAccounts();
    const chainId = await getChainId();

    const DAI = network.name === "hardhat" ? (await deployments.get("FaucetERC20")).address : configs[chainId]["DAI"];

    await execute(
        "AaveAdapter",
        {from: deployer},
        "setCeiling",
        DAI,
        configs[chainId]["AaveAdapter"]["aaveTokenCeiling"]
    );

    await execute("AaveAdapter", {from: deployer}, "setFloor", DAI, configs[chainId]["AaveAdapter"]["aaveTokenFloor"]);
};
module.exports.tags = ["AaveAdapter"];
module.exports.runAtTheEnd = true;
