const configs = require("../deployConfig.js");

module.exports = async () => {
    if (network.name === "rinkeby" || network.name === "mainnet") {
        const {deploy} = deployments;
        const {deployer} = await getNamedAccounts();
        const chainId = await getChainId();

        const union = await deployments.get("UnionToken");

        await deploy("ArbUnionWrapper", {
            from: deployer,
            args: [configs[chainId]["ArbL1Router"], configs[chainId]["ArbL1Gateway"], union.address],
            log: true
        });
    }
};
module.exports.tags = ["UnionWrapper"];
module.exports.dependencies = ["UnionToken"];
