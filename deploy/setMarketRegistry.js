const configs = require("../deployConfig.json");

module.exports = async ({getNamedAccounts, getChainId, network}) => {
    const {execute} = deployments;
    const {deployer} = await getNamedAccounts();
    const chainId = await getChainId();

    const DAI = network.name === "hardhat" ? (await deployments.get("FaucetERC20")).address : configs[chainId]["DAI"];

    const uToken = await deployments.get("UToken");

    const userManager = await deployments.get("UserManager");

    await execute("MarketRegistry", {from: deployer}, "addUToken", DAI, uToken.address);

    await execute("MarketRegistry", {from: deployer}, "addUserManager", DAI, userManager.address);
};
module.exports.tags = ["MarketRegistrySetting"];
module.exports.dependencies = ["MarketRegistry", "UToken", "UserManager"];
