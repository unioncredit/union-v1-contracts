module.exports = async ({getNamedAccounts}) => {
    const {execute} = deployments;
    const {deployer} = await getNamedAccounts();

    const uToken = await deployments.get("UToken");

    await execute("UserManager", {from: deployer}, "setUToken", uToken.address);
};
module.exports.tags = ["UserManagerSetting"];
module.exports.dependencies = ["UserManager", "UToken"];
