module.exports = async ({getNamedAccounts}) => {
    const {execute} = deployments;
    const {deployer} = await getNamedAccounts();

    const assetManager = await deployments.get("AssetManager");

    const fixedInterestRateModel = await deployments.get("FixedInterestRateModel");

    const userManager = await deployments.get("UserManager");

    await execute("UToken", {from: deployer}, "setAssetManager", assetManager.address);

    await execute("UToken", {from: deployer}, "setUserManager", userManager.address);

    await execute("UToken", {from: deployer}, "setInterestRateModel", fixedInterestRateModel.address);
};
module.exports.tags = ["UTokenSetting"];
module.exports.dependencies = ["AssetManager", "FixedInterestRateModel", "UserManager"];
