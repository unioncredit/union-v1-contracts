const configs = require("../deployConfig.js");

module.exports = async ({getNamedAccounts, getChainId, network}) => {
    const {execute, read} = deployments;
    const {deployer} = await getNamedAccounts();
    const chainId = await getChainId();

    if (configs[chainId]["AaveAdapter"]) {
        const DAI =
            network.name === "hardhat" ? (await deployments.get("FaucetERC20")).address : configs[chainId]["DAI"];

        console.log("setAaveAdapter start");
        if (
            !(
                (await read("AaveAdapter", {from: deployer}, "ceilingMap", DAI)) ===
                configs[chainId]["AaveAdapter"]["aaveTokenCeiling"]
            )
        ) {
            tx = await execute(
                "AaveAdapter",
                {from: deployer},
                "setCeiling",
                DAI,
                configs[chainId]["AaveAdapter"]["aaveTokenCeiling"]
            );
            console.log("AaveAdapter setCeiling, tx is:", tx.transactionHash);
        }
        if (
            !(
                (await read("AaveAdapter", {from: deployer}, "floorMap", DAI)) ===
                configs[chainId]["AaveAdapter"]["aaveTokenFloor"]
            )
        ) {
            tx = await execute(
                "AaveAdapter",
                {from: deployer},
                "setFloor",
                DAI,
                configs[chainId]["AaveAdapter"]["aaveTokenFloor"]
            );
            console.log("AaveAdapter setFloor, tx is:", tx.transactionHash);
        }
        if (!(await read("AaveAdapter", {from: deployer}, "tokenToAToken", DAI))) {
            tx = await execute("AaveAdapter", {from: deployer}, "mapTokenToAToken", DAI);
            console.log("AaveAdapter mapTokenToAToken, tx is:", tx.transactionHash);
        }
        console.log("setAaveAdapter end");
    }
};
module.exports.tags = ["AaveAdapter"];
