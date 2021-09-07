const configs = require("../deployConfig.json");

module.exports = async ({getNamedAccounts, getChainId}) => {
    const {execute} = deployments;
    const {deployer} = await getNamedAccounts();

    const chainId = await getChainId();

    const comptroller = await deployments.get("Comptroller");

    const treasuryVester = await deployments.get("TreasuryVester");

    await execute("UnionToken", {from: deployer}, "enableWhitelist");

    await execute("UnionToken", {from: deployer}, "whitelist", comptroller.address);

    await execute(
        "UnionToken",
        {from: deployer},
        "transfer",
        comptroller.address,
        configs[chainId]["UnionToken"]["comptrollerAmount"]
    );

    await execute(
        "UnionToken",
        {from: deployer},
        "transfer",
        treasuryVester.address,
        configs[chainId]["UnionToken"]["amountForTreasuryVester"]
    );
};
module.exports.tags = ["UnionTokenSetting"];
module.exports.dependencies = ["UnionToken", "Comptroller", "TreasuryVester"];
