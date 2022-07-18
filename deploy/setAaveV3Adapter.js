const configs = require("../deployConfig.js");

module.exports = async ({getNamedAccounts, getChainId, network}) => {
    const {execute, read} = deployments;
    const {deployer} = await getNamedAccounts();
    const chainId = await getChainId();
    if (configs[chainId]["AaveV3Adapter"]) {
        const DAI =
            network.name === "hardhat" ? (await deployments.get("FaucetERC20")).address : configs[chainId]["DAI"];
        console.log("set AaveV3 Adapter start");
        if (
            (await read("AaveV3Adapter", {from: deployer}, "ceilingMap", DAI)) !=
            configs[chainId]["AaveV3Adapter"]["ceiling"]
        ) {
            tx = await execute(
                "AaveV3Adapter",
                {from: deployer},
                "setCeiling",
                DAI,
                configs[chainId]["AaveV3Adapter"]["ceiling"]
            );
            console.log("AaveAdapter setCeiling, tx is:", tx.transactionHash);
        }
        if (
            (await read("AaveV3Adapter", {from: deployer}, "floorMap", DAI)) !=
            configs[chainId]["AaveV3Adapter"]["floor"]
        ) {
            tx = await execute(
                "AaveV3Adapter",
                {from: deployer},
                "setFloor",
                DAI,
                configs[chainId]["AaveV3Adapter"]["floor"]
            );
            console.log("AaveAdapter setFloor, tx is:", tx.transactionHash);
        }
        const mappedToken = await read("AaveV3Adapter", {from: deployer}, "tokenToAToken", DAI);
        if (!mappedToken || mappedToken == ethers.constants.AddressZero) {
            tx = await execute("AaveV3Adapter", {from: deployer}, "mapTokenToAToken", DAI);
            console.log("AaveAdapter mapTokenToAToken, tx is:", tx.transactionHash);
        }
        console.log("set AaveV3 Adapter end");
    }
};
module.exports.tags = ["AaveV3Adapter"];
