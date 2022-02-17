const configs = require("../deployConfig.js");

module.exports = async ({getNamedAccounts, deployments, getChainId, network}) => {
    const {deploy} = deployments;
    const {deployer} = await getNamedAccounts();

    const chainId = await getChainId();

    const params = configs[chainId]["UToken"];

    const UToken =
        network.name === "hardhat" ? (await deployments.get("FaucetERC20")).address : configs[chainId]["DAI"];

    await deploy(params.type, {
        from: deployer,
        proxy: {
            proxyContract: "UUPSProxy",
            execute: {
                methodName: "__UToken_init",
                args: [
                    params["name"],
                    params["symbol"],
                    UToken,
                    params.initialExchangeRateMantissa,
                    params.reserveFactorMantissa,
                    params.originationFee,
                    params.debtCeiling,
                    params.maxBorrow,
                    params.minBorrow,
                    params.overdueBlocks,
                    deployer
                ]
            }
        },
        log: true
    });
};
module.exports.tags = ["UToken", "Arbitrum"];
