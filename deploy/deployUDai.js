const configs = require("../deployConfig.js");

module.exports = async ({getNamedAccounts, deployments, getChainId, network}) => {
    const {deploy} = deployments;
    const {deployer} = await getNamedAccounts();

    const chainId = await getChainId();

    const params = configs[chainId]["UToken"];

    const daiAddress =
        network.name === "hardhat" ? (await deployments.get("FaucetERC20")).address : configs[chainId]["DAI"];

    await deploy("UDai", {
        from: deployer,
        contract: params.contract,
        proxy: {
            proxyContract: "UUPSProxy",
            execute: {
                init: {
                    methodName: "__UToken_init",
                    args: [
                        params["name"],
                        params["symbol"],
                        daiAddress,
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
            }
        },
        log: true
    });
};
module.exports.tags = ["UToken", "Arbitrum"];
