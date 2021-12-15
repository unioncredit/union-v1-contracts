const configs = require("../deployConfig.js");

module.exports = async ({getNamedAccounts, getChainId, deployments}) => {
    const {deploy} = deployments;
    const {deployer} = await getNamedAccounts();

    const chainId = await getChainId();

    const unionToken = await deployments.get("UnionToken");

    const timelockController = await deployments.get("TimelockController");

    const params = configs[chainId]["UnionGovernor"];

    await deploy("UnionGovernor", {
        from: deployer,
        args: [
            unionToken.address,
            timelockController.address,
            params.initialVotingDelay,
            params.initialVotingPeriod,
            params.initialProposalThreshold
        ],
        log: true
    });
};
module.exports.tags = ["UnionGovernor"];
module.exports.dependencies = ["UnionToken", "TimelockController"];
