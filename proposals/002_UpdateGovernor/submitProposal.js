const {ethers, getChainId, getNamedAccounts} = require("hardhat");

(async () => {
    const {deployer} = await getNamedAccounts();
    const {getProposalParams} = require(`./proposal.js`);
    const chainId = await getChainId();
    const {governorAddress, newGovernorAddress, timelockAddress} = require(`./addresses.js`)(chainId);
    console.log({governorAddress, newGovernorAddress, timelockAddress});
    timelock = await ethers.getContractAt("TimelockController", timelockAddress);

    const governor = await ethers.getContractAt("UnionGovernor", governorAddress);
    console.log({governor: governor.address});

    const latestProposalId = await governor.latestProposalIds(deployer);
    if (latestProposalId != 0) {
        const proposersLatestProposalState = await governor.state(latestProposalId);
        if (proposersLatestProposalState == 1) {
            throw new Error("found an already active proposal");
        } else if (proposersLatestProposalState == 0) {
            throw new Error("found an already pending proposal");
        }
    }

    const {targets, values, calldatas, msg} = await getProposalParams({
        newGovernorAddress,
        timelockAddress,
        governorAddress
    });

    const keccak256 = ethers.utils.keccak256;
    let myBuffer = [];
    let buffer = new Buffer.from(msg);

    for (let i = 0; i < buffer.length; i++) {
        myBuffer.push(buffer[i]);
    }

    const proposalId = await governor["hashProposal(address[],uint256[],bytes[],bytes32)"](
        targets,
        values,
        calldatas,
        keccak256(myBuffer)
    );
    const deadline = await governor.proposalSnapshot(proposalId);
    if (deadline > 0) {
        throw new Error("proposal already exists");
    }

    await governor["propose(address[],uint256[],bytes[],string)"](targets, values, calldatas, msg);
})();
