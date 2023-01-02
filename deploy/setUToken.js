const {deployments} = require("hardhat");
const configs = require("../deployConfig.js");

module.exports = async ({getNamedAccounts, getChainId, network}) => {
    const {execute, read} = deployments;
    const {deployer} = await getNamedAccounts();
    const chainId = await getChainId();

    const assetManager = await deployments.get("AssetManager");

    const fixedInterestRateModel = await deployments.get("FixedInterestRateModel");
    const userManager =
        network.name === "arbitrum" || network.name === "arbitrumRinkeby" || network.name === "arbitrumNitroDevnet"
            ? await deployments.get("UserManagerArb")
            : await deployments.get("UserManager");

    const uTokenContract = "UDai";
    console.log("setUToken start");
    if (!((await read(uTokenContract, {from: deployer}, "assetManager")) === assetManager.address)) {
        tx = await execute(uTokenContract, {from: deployer}, "setAssetManager", assetManager.address);
        console.log("setAssetManager tx is:", tx.transactionHash);
    }
    if (!((await read(uTokenContract, {from: deployer}, "userManager")) === userManager.address)) {
        tx = await execute(uTokenContract, {from: deployer}, "setUserManager", userManager.address);
        console.log("setUserManager tx is:", tx.transactionHash);
    }
    if (!((await read(uTokenContract, {from: deployer}, "interestRateModel")) === fixedInterestRateModel.address)) {
        tx = await execute(uTokenContract, {from: deployer}, "setInterestRateModel", fixedInterestRateModel.address);
        console.log("setInterestRateModel tx is:", tx.transactionHash);
    }
    console.log("setUToken end");
};
module.exports.tags = ["UTokenSetting", "Arbitrum"];
module.exports.dependencies = ["AssetManager", "FixedInterestRateModel", "UserManager"];
