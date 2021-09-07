const configs = require("../deployConfig.json");

module.exports = async ({getNamedAccounts, getChainId}) => {
    const {execute} = deployments;
    const {deployer} = await getNamedAccounts();

    const chainId = await getChainId();

    const comptroller = await deployments.get("Comptroller");

    const params = configs[chainId]["Treasury"];

    await execute(
        "Treasury",
        {from: deployer},
        "addSchedule",
        params.dripStart,
        params.dripRate,
        comptroller.address,
        params.dripAmount
    );
};
module.exports.tags = ["TreasurySetting"];
module.exports.dependencies = ["Treasury", "Comptroller"];
