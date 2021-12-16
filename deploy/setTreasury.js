const configs = require("../deployConfig.js");

module.exports = async ({ethers, getNamedAccounts, getChainId}) => {
    const {execute, read} = deployments;
    const {deployer} = await getNamedAccounts();

    const chainId = await getChainId();

    const comptroller = await deployments.get("Comptroller");

    const params = configs[chainId]["Treasury"];

    console.log("setTreasury start");
    if (
        (await read("Treasury", {from: deployer}, "tokenSchedules", comptroller.address)).target ===
        ethers.constants.AddressZero
    ) {
        const dripStart = params.dripStart ? params.dripStart : (await ethers.provider.getBlock("latest")).number;
        tx = await execute(
            "Treasury",
            {from: deployer},
            "addSchedule",
            dripStart,
            params.dripRate,
            comptroller.address,
            params.dripAmount
        );
        console.log("Treasury addSchedule, tx is:", tx.transactionHash);
    }
    console.log("setTreasury end");
};
module.exports.tags = ["TreasurySetting"];
module.exports.dependencies = ["Treasury", "Comptroller"];
