const {deployments} = require("hardhat");
const configs = require("../deployConfig.js");

module.exports = async ({getNamedAccounts, getChainId}) => {
    const {execute, read} = deployments;
    const {deployer} = await getNamedAccounts();
    const chainId = await getChainId();

    const assetManager = await deployments.get("AssetManager");

    const fixedInterestRateModel = await deployments.get("FixedInterestRateModel");

    const userManager =
        network.name === "arbitrum" || network.name === "arbitrumRinkeby"
            ? await deployments.get("UserManagerArb")
            : await deployments.get("UserManager");

    console.log({userManager: userManager.address});

    const uTokenType = configs[chainId]["UToken"]["type"];
    console.log("setUToken start");
    if (!((await read(uTokenType, {from: deployer}, "assetManager")) === assetManager.address)) {
        tx = await execute(uTokenType, {from: deployer}, "setAssetManager", assetManager.address);
        console.log("setAssetManager tx is:", tx.transactionHash);
    }
    if (!((await read(uTokenType, {from: deployer}, "userManager")) === userManager.address)) {
        tx = await execute(uTokenType, {from: deployer}, "setUserManager", userManager.address);
        console.log("setUserManager tx is:", tx.transactionHash);
    }
    if (!((await read(uTokenType, {from: deployer}, "interestRateModel")) === fixedInterestRateModel.address)) {
        tx = await execute(uTokenType, {from: deployer}, "setInterestRateModel", fixedInterestRateModel.address);
        console.log("setInterestRateModel tx is:", tx.transactionHash);
    }
    console.log("setUToken end");
};
module.exports.tags = ["UTokenSetting", "Arbitrum"];
module.exports.dependencies = ["AssetManager", "FixedInterestRateModel", "UserManager"];
