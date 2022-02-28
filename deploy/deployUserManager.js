const configs = require("../deployConfig.js");

module.exports = async ({getNamedAccounts, deployments, getChainId, network}) => {
    const {deploy} = deployments;
    const {deployer} = await getNamedAccounts();

    const chainId = await getChainId();

    const DAI = network.name === "hardhat" ? (await deployments.get("FaucetERC20")).address : configs[chainId]["DAI"];

    const unionTokenAddress =
        network.name === "arbitrum" || network.name === "arbitrumRinkeby"
            ? (await deployments.get("ArbUnion")).address
            : (await deployments.get("UnionToken")).address;

    const assetManager = await deployments.get("AssetManager");
    const creditLimitModel = await deployments.get("SumOfTrust");
    const comptroller = await deployments.get("Comptroller");

    const UserManagerContract =
        network.name === "arbitrum" || network.name === "arbitrumRinkeby" ? "UserManagerArb" : "UserManager";
    await deploy(UserManagerContract, {
        from: deployer,
        proxy: {
            proxyContract: "UUPSProxy",
            execute: {
                init: {
                    methodName: "__UserManager_init",
                    args: [
                        assetManager.address,
                        unionTokenAddress,
                        DAI,
                        creditLimitModel.address,
                        comptroller.address,
                        deployer
                    ]
                }
            }
        },
        log: true
    });
};
module.exports.tags = ["UserManager", "Arbitrum"];
module.exports.dependencies = ["AssetManager", "UnionToken", "SumOfTrust", "Comptroller", "ArbUnion"];
