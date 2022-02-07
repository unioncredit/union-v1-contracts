module.exports = async ({getNamedAccounts}) => {
    const {execute, read} = deployments;
    const {deployer} = await getNamedAccounts();

    const uToken = await deployments.get("UDai");

    const UserManagerContract = network.name === "arbitrumRinkeby" ? "UserManagerArbi" : "UserManager";

    console.log("setUserManager start");
    if (!((await read(UserManagerContract, {from: deployer}, "uToken")) === uToken.address)) {
        tx = await execute(UserManagerContract, {from: deployer}, "setUToken", uToken.address);
        console.log("setUToken tx is:", tx.transactionHash);
    }
    console.log("setUserManager end");
};
module.exports.tags = ["UserManagerSetting", "Arbitrum"];
module.exports.dependencies = ["UserManager", "UDai"];
