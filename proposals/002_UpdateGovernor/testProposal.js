const {ethers, deployments, getChainId} = require("hardhat");
const {parseUnits} = ethers.utils;
const {waitNBlocks, increaseTime} = require("../../utils");
const {
    getProposalParams,
    getNewGovernorProposalParams,
    ADMIN_ROLE,
    PROPOSER_ROLE,
    EXECUTOR_ROLE
} = require("./proposal.js");
const deployNewGovernor = require("./deployNewGovernor.js");
require("chai").should();

const ethUser = "0x07f0eb0c571B6cFd90d17b5de2cc51112Fb95915"; //An address with eth
const unionUser = "0x0fb99055fcdd69b711f6076be07b386aa2718bc6"; //An address with union

let governorProxy, newGovernorAddress, _userManagerAddress, timelock, unionToken;
describe("Test Swap Governor", async () => {
    before(async () => {
        await network.provider.request({
            method: "hardhat_reset",
            params: [
                {
                    forking: {
                        jsonRpcUrl: "https://eth-mainnet.alchemyapi.io/v2/" + process.env.ALCHEMY_API_KEY,
                        blockNumber: 13910900
                    }
                }
            ]
        });
        [defaultAccount] = await ethers.getSigners();
        ethSigner = await ethers.provider.getSigner(ethUser);
        unionSigner = await ethers.provider.getSigner(unionUser);
        await network.provider.request({
            method: "hardhat_impersonateAccount",
            params: [ethUser]
        });
        await network.provider.request({
            method: "hardhat_impersonateAccount",
            params: [unionUser]
        });

        // Send ETH to account
        await ethSigner.sendTransaction({
            to: defaultAccount.address,
            value: parseUnits("10")
        });
        await ethSigner.sendTransaction({
            to: unionUser,
            value: parseUnits("10")
        });

        const chainId = await getChainId();
        const {governorAddress, timelockAddress, unionTokenAddress, userManagerAddress} =
            require(`./addresses.js`)(chainId);
        console.log({governorAddress, timelockAddress, unionTokenAddress, userManagerAddress});
        governorProxy = await ethers.getContractAt("UnionGovernor", governorAddress);
        timelock = await ethers.getContractAt("TimelockController", timelockAddress);
        unionToken = await ethers.getContractAt("UnionToken", unionTokenAddress);
        await unionToken.connect(unionSigner).delegate(defaultAccount.address);
        _userManagerAddress = userManagerAddress;
        // deploy new governor
        newGovernorAddress = await deployNewGovernor();
        console.log({newGovernorAddress});
    });

    it("Propose", async () => {
        const {targets, values, calldatas, msg} = await getProposalParams({
            newGovernorAddress,
            timelockAddress: timelock.address,
            governorAddress: governorProxy.address
        });

        await governorProxy["propose(address[],uint256[],bytes[],string)"](targets, values, calldatas, msg);
    });

    it("Cast vote", async () => {
        let res;
        const proposalId = await governorProxy.latestProposalIds(defaultAccount.address);

        const votingDelay = await governorProxy.votingDelay();
        await waitNBlocks(parseInt(votingDelay) + 10);

        res = await governorProxy.state(proposalId);
        res.toString().should.eq("1");

        await governorProxy.castVote(proposalId, 1);
        const votingPeriod = await governorProxy.votingPeriod();
        await waitNBlocks(parseInt(votingPeriod));

        res = await governorProxy.state(proposalId);
        res.toString().should.eq("4");

        console.log(`Queueing proposal Id: ${proposalId}`);

        await governorProxy["queue(uint256)"](proposalId);

        await increaseTime(7 * 24 * 60 * 60);

        res = await governorProxy.getActions(proposalId);
        // console.log(res.toString());

        console.log(`Executing proposal Id: ${proposalId}`);

        await governorProxy["execute(uint256)"](proposalId);
    });

    it("Validate results", async () => {
        (await timelock.hasRole(ADMIN_ROLE, newGovernorAddress)).should.eq(true);
        (await timelock.hasRole(PROPOSER_ROLE, newGovernorAddress)).should.eq(true);
        (await timelock.hasRole(EXECUTOR_ROLE, newGovernorAddress)).should.eq(true);
        (await timelock.hasRole(ADMIN_ROLE, governorProxy.address)).should.eq(false);
        (await timelock.hasRole(PROPOSER_ROLE, governorProxy.address)).should.eq(false);
        (await timelock.hasRole(EXECUTOR_ROLE, governorProxy.address)).should.eq(false);
    });

    it("Vote with new govnernor", async () => {
        const {targets, values, sigs, calldatas, msg} = await getNewGovernorProposalParams({
            userManagerAddress: _userManagerAddress
        });

        const newGovernor = await ethers.getContractAt("UnionGovernor", newGovernorAddress);

        console.log({newGovernor: newGovernor.address});
        // Test Compound compatible propose() function
        await newGovernor["propose(address[],uint256[],string[],bytes[],string)"](
            targets,
            values,
            sigs,
            calldatas,
            msg
        );
    });
});
