const configs = require("../deployConfig.json");

module.exports = async ({getNamedAccounts, getChainId, network}) => {
    const {execute} = deployments;
    const {deployer} = await getNamedAccounts();
    const chainId = await getChainId();

    const DAI = network.name === "hardhat" ? (await deployments.get("FaucetERC20")).address : configs[chainId]["DAI"];

    const cDAI = network.name === "hardhat" ? (await deployments.get("FaucetERC20")).address : configs[chainId]["cDAI"];

    await execute(
        "CompoundAdapter",
        {from: deployer},
        "setCeiling",
        DAI,
        configs[chainId]["CompoundAdapter"]["compoundTokenCeiling"]
    );

    await execute(
        "CompoundAdapter",
        {from: deployer},
        "setFloor",
        DAI,
        configs[chainId]["CompoundAdapter"]["compoundTokenFloor"]
    );

    await execute("CompoundAdapter", {from: deployer}, "mapTokenToCToken", DAI, cDAI);
};
module.exports.tags = ["CompoundAdapter"];
module.exports.runAtTheEnd = true;
