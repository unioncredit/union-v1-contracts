const configs = require("../deployConfig.js");

module.exports = async ({getNamedAccounts, getChainId, network}) => {
    const {execute, read} = deployments;
    const {deployer} = await getNamedAccounts();
    const chainId = await getChainId();

    if (configs[chainId]["CompoundAdapter"]) {
        const DAI =
            network.name === "hardhat" ? (await deployments.get("FaucetERC20")).address : configs[chainId]["DAI"];

        const cDAI =
            network.name === "hardhat"
                ? (await deployments.get("FaucetERC20")).address
                : configs[chainId]["CompoundAdapter"]["cDAI"];

        console.log("setCompoundAdapter start");
        if (
            !(
                (await read("CompoundAdapter", {from: deployer}, "ceilingMap", DAI)).toString() ===
                configs[chainId]["CompoundAdapter"]["ceiling"].toString()
            )
        ) {
            tx = await execute(
                "CompoundAdapter",
                {from: deployer},
                "setCeiling",
                DAI,
                configs[chainId]["CompoundAdapter"]["ceiling"]
            );
            console.log("CompoundAdapter setCeiling, tx is:", tx.transactionHash);
        }
        if (
            !(
                (await read("CompoundAdapter", {from: deployer}, "floorMap", DAI)).toString() ===
                configs[chainId]["CompoundAdapter"]["floor"].toString()
            )
        ) {
            tx = await execute(
                "CompoundAdapter",
                {from: deployer},
                "setFloor",
                DAI,
                configs[chainId]["CompoundAdapter"]["floor"]
            );
            console.log("CompoundAdapter setFloor, tx is:", tx.transactionHash);
        }
        if (
            !(
                (await read("CompoundAdapter", {from: deployer}, "tokenToCToken", DAI)).toLowerCase() ===
                cDAI.toLowerCase()
            )
        ) {
            tx = await execute("CompoundAdapter", {from: deployer}, "mapTokenToCToken", DAI, cDAI);
            console.log("CompoundAdapter mapTokenToCToken, tx is:", tx.transactionHash);
        }
        console.log("setCompoundAdapter end");
    }
};
module.exports.tags = ["CompoundAdapter"];
