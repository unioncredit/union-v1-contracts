const {ethers, deployments, getChainId} = require("hardhat");

async function deployNewGovernor() {
    const configs = {
        initialVotingDelay: "6575", // in blocks, 1 day
        initialVotingPeriod: "19725", // in blocks, 3 days
        initialProposalThreshold: ethers.utils.parseUnits("10000000") // 10M Union
    };

    const chainId = await getChainId();
    console.log({chainId});

    const {deployer} = await getNamedAccounts();
    console.log({deployer});

    const {deploy} = deployments;

    const {timelockAddress, unionTokenAddress} = require(`./addresses.js`)(chainId);

    const deployResult = await deploy("UnionGovernor", {
        from: deployer,
        args: [
            unionTokenAddress,
            timelockAddress,
            configs.initialVotingDelay,
            configs.initialVotingPeriod,
            configs.initialProposalThreshold
        ],
        log: true
    });

    const governor = await ethers.getContractAt("UnionGovernor", deployResult.address);
    unionTokenAddress.should.eq(await governor.token());
    timelockAddress.should.eq(await governor.timelock());
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
