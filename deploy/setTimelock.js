module.exports = async ({getNamedAccounts, ethers}) => {
    const {execute} = deployments;
    const {deployer} = await getNamedAccounts();

    const governor = await deployments.get("UnionGovernor");

    await execute(
        "TimelockController",
        {from: deployer},
        "grantRole",
        ethers.utils.id("TIMELOCK_ADMIN_ROLE"),
        governor.address
    );

    await execute(
        "TimelockController",
        {from: deployer},
        "grantRole",
        ethers.utils.id("PROPOSER_ROLE"),
        governor.address
    );

    await execute(
        "TimelockController",
        {from: deployer},
        "grantRole",
        ethers.utils.id("EXECUTOR_ROLE"),
        governor.address
    );

    await execute(
        "TimelockController",
        {from: deployer},
        "renounceRole",
        ethers.utils.id("TIMELOCK_ADMIN_ROLE"),
        deployer
    );

    await execute("TimelockController", {from: deployer}, "renounceRole", ethers.utils.id("PROPOSER_ROLE"), deployer);

    await execute("TimelockController", {from: deployer}, "renounceRole", ethers.utils.id("EXECUTOR_ROLE"), deployer);
};
module.exports.tags = ["TimelockControllerSetting"];
module.exports.dependencies = ["TimelockController", "UnionGovernor"];
