const hre = require("hardhat");
const {ethers, getChainId, getNamedAccounts} = hre;

const propose_id = "UIP001";

const networks = {
    1: "mainnet",
    42: "kovan",
    31337: "hardhat"
};

const checkFileExist = path => {
    try {
        return require(path);
    } catch (error) {
        throw new Error("file not found");
    }
};

(async () => {
    const chainId = await getChainId();
    const {deployer} = await getNamedAccounts();
    const getProposeParams = checkFileExist(`../proposes/${networks[chainId]}/${propose_id}.js`);

    const governorPath = `../deployments/${networks[chainId]}/UnionGovernor.json`;
    const governorParams = checkFileExist(governorPath);
    const governance = await ethers.getContractAt("UnionGovernor", governorParams.address);

    const latestProposalId = await governance.latestProposalIds(deployer);
    if (latestProposalId != 0) {
        const proposersLatestProposalState = await governance.state(latestProposalId);
        if (proposersLatestProposalState == 1) {
            throw new Error("found an already active proposal");
        } else if (proposersLatestProposalState == 0) {
            throw new Error("found an already pending proposal");
        }
    }

    const {targets, values, calldatas, msg} = await getProposeParams();

    const keccak256 = ethers.utils.keccak256;
    let myBuffer = [];
    let buffer = new Buffer.from(msg);

    for (let i = 0; i < buffer.length; i++) {
        myBuffer.push(buffer[i]);
    }

    const proposalId = await governance["hashProposal(address[],uint256[],bytes[],bytes32)"](
        targets,
        values,
        calldatas,
        keccak256(myBuffer)
    );
    const deadline = await governance.proposalSnapshot(proposalId);
    if (deadline > 0) {
        throw new Error("proposal already exists");
    }

    await governance["propose(address[],uint256[],bytes[],string)"](targets, values, calldatas, msg);
})();
