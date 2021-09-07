module.exports = async ({getNamedAccounts}) => {
    const {execute} = deployments;
    const {deployer} = await getNamedAccounts();

    const timelock = await deployments.get("TimelockController");

    await execute("AaveAdapter", {from: deployer}, "addAdmin", timelock.address);
    await execute("CompoundAdapter", {from: deployer}, "addAdmin", timelock.address);
    await execute("PureTokenAdapter", {from: deployer}, "addAdmin", timelock.address);
    await execute("Comptroller", {from: deployer}, "addAdmin", timelock.address);
    await execute("UnionToken", {from: deployer}, "transferOwnership", timelock.address);
    await execute("AssetManager", {from: deployer}, "addAdmin", timelock.address);
    await execute("MarketRegistry", {from: deployer}, "addAdmin", timelock.address);
    await execute("UserManager", {from: deployer}, "addAdmin", timelock.address);
    await execute("UToken", {from: deployer}, "addAdmin", timelock.address);
};
module.exports.tags = ["ChangeAdmin"];
module.exports.dependencies = [
    "TimelockController",
    "AaveAdapter",
    "CompoundAdapter",
    "PureTokenAdapter",
    "Comptroller",
    "UnionTokenSetting",
    "AssetManager",
    "MarketRegistry",
    "UserManager",
    "UToken"
];
