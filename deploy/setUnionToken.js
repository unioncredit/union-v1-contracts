const {deployments} = require("hardhat");
const configs = require("../deployConfig.js");

module.exports = async ({getNamedAccounts, getChainId}) => {
    const {execute, read} = deployments;
    const {deployer} = await getNamedAccounts();

    const chainId = await getChainId();

    const comptroller = await deployments.get("Comptroller");

    const treasuryVester = await deployments.get("TreasuryVester");

    const treasury = await deployments.get("Treasury");

    console.log("setUnionToken start");
    if (!(await read("UnionToken", {from: deployer}, "whitelistEnabled"))) {
        tx = await execute("UnionToken", {from: deployer}, "enableWhitelist");
        console.log("UnionToken enableWhitelist, tx is:", tx.transactionHash);
    }
    if (!(await read("UnionToken", {from: deployer}, "isWhitelisted", comptroller.address))) {
        tx = await execute("UnionToken", {from: deployer}, "whitelist", comptroller.address);
        console.log("UnionToken whitelist comptroller, tx is:", tx.transactionHash);
    }
    if (!(await read("UnionToken", {from: deployer}, "isWhitelisted", treasuryVester.address))) {
        tx = await execute("UnionToken", {from: deployer}, "whitelist", treasuryVester.address);
        console.log("UnionToken whitelist treasuryVester, tx is:", tx.transactionHash);
    }
    if (!(await read("UnionToken", {from: deployer}, "isWhitelisted", treasury.address))) {
        tx = await execute("UnionToken", {from: deployer}, "whitelist", treasury.address);
        console.log("UnionToken whitelist treasury, tx is:", tx.transactionHash);
    }
    if ((await read("UnionToken", {from: deployer}, "balanceOf", comptroller.address)) == "0") {
        tx = await execute(
            "UnionToken",
            {from: deployer},
            "transfer",
            comptroller.address,
            configs[chainId]["UnionToken"]["comptrollerAmount"]
        );
        console.log("UnionToken transfer comptroller, tx is:", tx.transactionHash);
    }

    if ((await read("UnionToken", {from: deployer}, "balanceOf", treasury.address)) == "0") {
        tx = await execute(
            "UnionToken",
            {from: deployer},
            "transfer",
            treasury.address,
            configs[chainId]["UnionToken"]["amountForTreasury"]
        );
        console.log("UnionToken transfer treasury, tx is:", tx.transactionHash);
    }

    if ((await read("UnionToken", {from: deployer}, "balanceOf", treasuryVester.address)) == "0") {
        tx = await execute(
            "UnionToken",
            {from: deployer},
            "transfer",
            treasuryVester.address,
            configs[chainId]["UnionToken"]["amountForTreasuryVester"]
        );
        console.log("UnionToken transfer treasuryVester, tx is:", tx.transactionHash);
    }

    if (network.name === "rinkeby") {
        // can only run this on rinkeby because the deployer doesn't have permissions on mainnet no more
        const arbUnionWrapper = await deployments.get("ArbUnionWrapper");
        if (!(await read("UnionToken", {from: deployer}, "isWhitelisted", arbUnionWrapper.address))) {
            tx = await execute("UnionToken", {from: deployer}, "whitelist", arbUnionWrapper.address);
            console.log("UnionToken whitelist arbUnionWrapper, tx is:", tx.transactionHash);
        }
    }
    console.log("setUnionToken end");
};
module.exports.tags = ["UnionTokenSetting"];
module.exports.dependencies = ["UnionToken", "Comptroller", "TreasuryVester", "UnionWrapper"];
