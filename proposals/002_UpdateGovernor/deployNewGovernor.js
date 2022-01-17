const {ethers, deployments, getChainId} = require("hardhat");

async function deployNewGovernor() {
    const configs = {
        initialVotingDelay: "6575",
        initialVotingPeriod: "19725",
        initialProposalThreshold: ethers.utils.parseUnits("10000000")
    };

    const chainId = await getChainId();
    console.log({chainId});

    const {deployer} = await getNamedAccounts();
    console.log({deployer});

    const {deploy} = deployments;

    const unionToken = await deployments.get("UnionToken");
    const timelock = await deployments.get("TimelockController");

    const deployResult = await deploy("UnionGovernor", {
        from: deployer,
        args: [
            unionToken.address,
            timelock.address,
            configs.initialVotingDelay,
            configs.initialVotingPeriod,
            configs.initialProposalThreshold
        ],
        log: true
    });

    const governor = await ethers.getContractAt("UnionGovernor", deployResult.address);
    unionToken.address.should.eq(await governor.token());
    timelock.address.should.eq(await governor.timelock());
    configs.initialVotingDelay.should.eq(await governor.votingDelay());
    configs.initialVotingPeriod.should.eq(await governor.votingPeriod());
    configs.initialProposalThreshold.eq(await governor.proposalThreshold());

    return deployResult.address;
}

if (require.main === module) {
    deployNewGovernor()
        .then(() => process.exit(0))
        .catch(error => {
            console.error(error);
            process.exit(1);
        });
}
module.exports = deployNewGovernor;
