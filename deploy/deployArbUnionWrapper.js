const configs = require("../deployConfig.js");

module.exports = async () => {
    if (network.name === "rinkeby" || network.name === "goerli" || network.name === "mainnet") {
        const {deploy, execute, read} = deployments;
        const {deployer} = await getNamedAccounts();
        const chainId = await getChainId();

        const union = await deployments.get("UnionToken");

        await deploy("ArbUnionWrapper", {
            from: deployer,
            args: [configs[chainId]["ArbL1Router"], configs[chainId]["ArbL1Gateway"], union.address],
            log: true
        });
        if (!(await read("ArbUnionWrapper", {from: deployer}, "whitelistEnabled"))) {
            const tx = await execute("ArbUnionWrapper", {from: deployer}, "enableWhitelist");
            console.log("ArbUnionWrapper enableWhitelist, tx is:", tx.transactionHash);
        }
    }
};
module.exports.tags = ["UnionWrapper"];
// make sure not to deploy UnionToken again
// module.exports.dependencies = ["UnionToken"];
