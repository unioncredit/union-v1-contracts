const {ethers} = require("hardhat");
const {parseEther} = ethers.utils;
const {waitNBlocks, increaseTime} = require("../../utils");
const getProposeParams = require("../../proposes/mainnet/SetMemberFee.js");

require("chai").should();

const ethUser = "0x07f0eb0c571B6cFd90d17b5de2cc51112Fb95915"; //An address with eth
const unionUser = "0x0fb99055fcdd69b711f6076be07b386aa2718bc6"; //An address with union
const unionTokenAddress = "0x5Dfe42eEA70a3e6f93EE54eD9C321aF07A85535C";
const governorAddress = "0x011e5846975c6463a8c6337EECF3cbF64e328884";
const userManagerAddress = "0x49c910Ba694789B58F53BFF80633f90B8631c195";

let governanceProxy, unionToken;
describe("Proposal SetMemberFee", async () => {
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
            value: parseEther("10")
        });
        await ethSigner.sendTransaction({
            to: unionUser,
            value: parseEther("10")
        });

        governanceProxy = await ethers.getContractAt("UnionGovernor", governorAddress);

        unionToken = await ethers.getContractAt("UnionToken", unionTokenAddress);

        await unionToken.connect(unionSigner).delegate(defaultAccount.address);
    });

    it("Propose", async () => {
        const {targets, values, sigs, calldatas, msg} = await getProposeParams();
        console.log({targets, values, sigs, calldatas, msg});

        await governanceProxy["propose(address[],uint256[],string[],bytes[],string)"](
            targets,
            values,
            sigs,
            calldatas,
            msg
        );
    });

    it("Cast vote", async () => {
        let res;
        const proposalId = await governanceProxy.latestProposalIds(defaultAccount.address);

        const votingDelay = await governanceProxy.votingDelay();
        await waitNBlocks(parseInt(votingDelay) + 10);

        res = await governanceProxy.state(proposalId);
        res.toString().should.eq("1");

        await governanceProxy.castVote(proposalId, 1);
        const votingPeriod = await governanceProxy.votingPeriod();
        await waitNBlocks(parseInt(votingPeriod));

        res = await governanceProxy.state(proposalId);
        res.toString().should.eq("4");

        await governanceProxy["queue(uint256)"](proposalId);

        await increaseTime(7 * 24 * 60 * 60);

        res = await governanceProxy.getActions(proposalId);
        console.log(res.toString());

        await governanceProxy["execute(uint256)"](proposalId);

        const userManager = await ethers.getContractAt("UserManager", userManagerAddress);

        const fee = await userManager.newMemberFee();
        console.log({fee: fee.toString()});
    });
});
