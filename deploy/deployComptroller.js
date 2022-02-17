const {getChainId} = require("eth-permit/dist/rpc");
const configs = require("../deployConfig.js");

module.exports = async ({getNamedAccounts, deployments, network, getChainId}) => {
    const {deploy} = deployments;
    const {deployer} = await getNamedAccounts();

    const chainId = await getChainId();

    const unionTokenAddress =
        network.name === "arbitrum" || network.name === "arbitrumRinkeby"
            ? (await deployments.get("ArbUnion")).address
            : (await deployments.get("UnionToken")).address;
    const marketRegistry = await deployments.get("MarketRegistry");

    await deploy("Comptroller", {
        from: deployer,
        proxy: {
            proxyContract: "UUPSProxy",
            execute: {
                init: {
                    methodName: "__Comptroller_init",
                    args: [unionTokenAddress, marketRegistry.address]
                }
            }
        },
        log: true
    });
};
module.exports.tags = ["Comptroller", "Arbitrum"];
module.exports.dependencies = ["UnionToken", "MarketRegistry", "ArbUnion"];
