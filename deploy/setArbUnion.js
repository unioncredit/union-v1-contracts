const {deployments} = require("hardhat");

module.exports = async ({getNamedAccounts, network}) => {
    if (network.name === "arbitrum" || network.name === "arbitrumRinkeby") {
        console.log("set ArbUnion start");
        const {deployer} = await getNamedAccounts();
        const {execute, read} = deployments;

        const comptroller = await deployments.get("Comptroller");
        if (!(await read("ArbUnion", {from: deployer}, "isWhitelisted", comptroller.address))) {
            tx = await execute("ArbUnion", {from: deployer}, "whitelist", comptroller.address);
            console.log("ArbUnion whitelist comptroller, tx is:", tx.transactionHash);
        }

        const userManager = await deployments.get("UserManagerArb");
        if (!(await read("ArbUnion", {from: deployer}, "isWhitelisted", userManager.address))) {
            tx = await execute("ArbUnion", {from: deployer}, "whitelist", userManager.address);
            console.log("ArbUnion whitelist UserManager, tx is:", tx.transactionHash);
        }

        if (!(await read("ArbUnion", {from: deployer}, "whitelistEnabled"))) {
            tx = await execute("ArbUnion", {from: deployer}, "enableWhitelist");
            console.log("ArbUnion enableWhitelist, tx is:", tx.transactionHash);
        }
        console.log("set ArbUnion end");
    }
};
module.exports.tags = ["ArbUnionSetting", "Arbitrum"];
module.exports.dependencies = ["ArbUnion"];
