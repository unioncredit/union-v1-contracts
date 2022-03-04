const configs = require("../deployConfig.js");

module.exports = async ({getNamedAccounts, getChainId, network}) => {
    const {execute, read} = deployments;
    const {deployer} = await getNamedAccounts();
    const chainId = await getChainId();

    const DAI = network.name === "hardhat" ? (await deployments.get("FaucetERC20")).address : configs[chainId]["DAI"];

    console.log("setPureTokenAdapter start");
    if (
        !(
            (await read("PureTokenAdapter", {from: deployer}, "ceilingMap", DAI)).toString() ===
            configs[chainId]["PureTokenAdapter"]["ceiling"].toString()
        )
    ) {
        tx = await execute(
            "PureTokenAdapter",
            {from: deployer},
            "setCeiling",
            DAI,
            configs[chainId]["PureTokenAdapter"]["ceiling"]
        );
        console.log("PureTokenAdapter setCeiling, tx is:", tx.transactionHash);
    }
    if (
        !(
            (await read("PureTokenAdapter", {from: deployer}, "floorMap", DAI)).toString() ===
            configs[chainId]["PureTokenAdapter"]["floor"].toString()
        )
    ) {
        tx = await execute(
            "PureTokenAdapter",
            {from: deployer},
            "setFloor",
            DAI,
            configs[chainId]["PureTokenAdapter"]["floor"]
        );
        console.log("PureTokenAdapter setFloor, tx is:", tx.transactionHash);
    }
    console.log("setPureTokenAdapter end");
};
module.exports.tags = ["PureTokenAdapter", "Arbitrum"];
