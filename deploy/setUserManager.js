const configs = require("../deployConfig.js");

module.exports = async ({getNamedAccounts, getChainId}) => {
    const {execute, read} = deployments;
    const {deployer} = await getNamedAccounts();
    const chainId = await getChainId();

    const uToken = await deployments.get(configs[chainId]["UToken"]["type"]);

    const UserManagerContract =
        network.name === "arbitrum" || network.name === "arbitrumRinkeby" ? "UserManagerArb" : "UserManager";

    console.log("setUserManager start");
    if (!((await read(UserManagerContract, {from: deployer}, "uToken")) === uToken.address)) {
        tx = await execute(UserManagerContract, {from: deployer}, "setUToken", uToken.address);
        console.log("setUToken tx is:", tx.transactionHash);
    }
    console.log("setUserManager end");
};
module.exports.tags = ["UserManagerSetting", "Arbitrum"];
module.exports.dependencies = ["UserManager", "UToken"];
