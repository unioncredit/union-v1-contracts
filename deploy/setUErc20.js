module.exports = async ({getNamedAccounts}) => {
    const {execute} = deployments;
    const {deployer} = await getNamedAccounts();

    const uToken = await deployments.get("UToken");

    await execute("UErc20", {from: deployer}, "transferOwnership", uToken.address);
};
module.exports.tags = ["UErc20Setting"];
module.exports.dependencies = ["UErc20", "UToken"];
