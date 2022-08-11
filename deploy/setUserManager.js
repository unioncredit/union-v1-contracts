const configs = require("../deployConfig.js");

module.exports = async ({getNamedAccounts, getChainId, network}) => {
    const {execute, read} = deployments;
    const {deployer} = await getNamedAccounts();
    const chainId = await getChainId();

    const uTokenContract = await deployments.get("UDai");

    const UserManagerContract =
        network.name === "arbitrum" || network.name === "arbitrumRinkeby" || network.name === "arbitrumNitroDevnet"
            ? "UserManagerArb"
            : "UserManager";

    console.log("setUserManager start");
    if (!((await read(UserManagerContract, {from: deployer}, "uToken")) === uTokenContract.address)) {
        tx = await execute(UserManagerContract, {from: deployer}, "setUToken", uTokenContract.address);
        console.log("setUToken tx is:", tx.transactionHash);
    }
    console.log("setUserManager end");
};
module.exports.tags = ["UserManagerSetting", "Arbitrum"];
module.exports.dependencies = ["UserManager", "UToken"];
