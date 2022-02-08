const {deployments} = require("hardhat");

module.exports = async ({getNamedAccounts, getChainId}) => {
    const {deployer} = await getNamedAccounts();
    const {execute, read} = deployments;

    const comptroller = await deployments.get("Comptroller");

    if (!(await read("ArbUnion", {from: deployer}, "isWhitelisted", comptroller.address))) {
        tx = await execute("ArbUnion", {from: deployer}, "whitelist", comptroller.address);
        console.log("ArbUnion whitelist comptroller, tx is:", tx.transactionHash);
    }

    if (!(await read("ArbUnion", {from: deployer}, "whitelistEnabled"))) {
        tx = await execute("ArbUnion", {from: deployer}, "enableWhitelist");
        console.log("ArbUnion enableWhitelist, tx is:", tx.transactionHash);
    }
};
module.exports.tags = ["ArbUnionSetting", "Arbitrum"];
module.exports.dependencies = ["ArbUnion"];
