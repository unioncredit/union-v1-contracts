const configs = require("../deployConfig.js");

module.exports = async ({getNamedAccounts, getChainId, network}) => {
    const {execute, read} = deployments;
    const {deployer} = await getNamedAccounts();
    const chainId = await getChainId();

    const daiAddress =
        network.name === "hardhat" ? (await deployments.get("FaucetERC20")).address : configs[chainId]["DAI"];

    const uDai = await deployments.get("UDai");

    const userManager =
        network.name === "arbitrum" || network.name === "arbitrumRinkeby"
            ? await deployments.get("UserManagerArb")
            : await deployments.get("UserManager");

    console.log("setMarketRegistry start");

    const uTokens = await read("MarketRegistry", {from: deployer}, "getUTokens");
    let uTokenIsExist;
    for (let i = 0; i < uTokens.length; i++) {
        if (uTokens[i] === uDai.address) {
            uTokenIsExist = true;
            break;
        }
    }
    if (!uTokenIsExist) {
        tx = await execute("MarketRegistry", {from: deployer}, "addUToken", daiAddress, uDai.address);
        console.log("MarketRegistry addUToken, tx is:", tx.transactionHash);
    }

    const userManagerList = await read("MarketRegistry", {from: deployer}, "getUserManagers");
    let userManagerIsExist;
    for (let i = 0; i < userManagerList.length; i++) {
        if (userManagerList[i] === userManager.address) {
            userManagerIsExist = true;
            break;
        }
    }
    if (!userManagerIsExist) {
        tx = await execute("MarketRegistry", {from: deployer}, "addUserManager", daiAddress, userManager.address);
        console.log("MarketRegistry addUserManager, tx is:", tx.transactionHash);
    }
    console.log("setMarketRegistry end");
};
module.exports.tags = ["MarketRegistrySetting", "Arbitrum"];
module.exports.dependencies = ["MarketRegistry", "UToken", "UserManager"];
