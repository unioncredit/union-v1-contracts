const configs = require("../deployConfig.json");

module.exports = async ({getNamedAccounts, getChainId, network}) => {
    const {execute} = deployments;
    const {deployer} = await getNamedAccounts();
    const chainId = await getChainId();

    const DAI = network.name === "hardhat" ? (await deployments.get("FaucetERC20")).address : configs[chainId]["DAI"];

    await execute(
        "PureTokenAdapter",
        {from: deployer},
        "setCeiling",
        DAI,
        configs[chainId]["PureTokenAdapter"]["pureTokenCeiling"]
    );

    await execute(
        "PureTokenAdapter",
        {from: deployer},
        "setFloor",
        DAI,
        configs[chainId]["PureTokenAdapter"]["pureTokenFloor"]
    );
};
module.exports.tags = ["PureTokenAdapter"];
module.exports.runAtTheEnd = true;
