//Raise the AAVE adapter ceiling to 500k
//Raise the Compound Adapter Ceiling to 500k
//Raise the Pure Adapter floor to 100k
//Set the Half_Decay_Point to 1,000,000 (One Million)

const {ethers} = require("hardhat");
const {parseEther} = ethers.utils;
const {waitNBlocks, increaseTime} = require("../../utils");
const getProposeParams = require("../../proposes/mainnet/UIP001.js");

require("chai").should();

const ethUser = "0x07f0eb0c571B6cFd90d17b5de2cc51112Fb95915"; //An address with eth
const unionUser = "0x0fb99055fcdd69b711f6076be07b386aa2718bc6"; //An address with union
const unionTokenAddress = "0x5Dfe42eEA70a3e6f93EE54eD9C321aF07A85535C";
const daiAddress = "0x6b175474e89094c44da98b954eedeac495271d0f";
const governorAddress = "0x011e5846975c6463a8c6337EECF3cbF64e328884";
const aaveAdapterAddress = "0xE8c77A541c933Aa1320Aa2f89a61f91130e4012d";
const compoundAdapterAddress = "0x303CbdADF370F6bBa79651f680498E829cB860D5";
const pureAdapterAddress = "0x62DD06026F5f8e874eEfF362b1280CD9A2057b7d";
const comptrollerAddress = "0x216dE4089dCdD7B95BC34BdCe809669C788a9A5d";
const aaveCeil = parseEther("500000");
const compoundCeil = parseEther("500000");
const pureFloor = parseEther("100000");
const halfDecayPoint = 1000000;

let governanceProxy, unionToken, aaveAdapter, compoundAdapter, pureAdapter, comptroller;
describe("Proposal UIP001", async () => {
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
        aaveAdapter = await ethers.getContractAt("AaveAdapter", aaveAdapterAddress);
        compoundAdapter = await ethers.getContractAt("CompoundAdapter", compoundAdapterAddress);
        pureAdapter = await ethers.getContractAt("PureTokenAdapter", pureAdapterAddress);
        comptroller = await ethers.getContractAt("Comptroller", comptrollerAddress);
        unionToken = await ethers.getContractAt("UnionToken", unionTokenAddress);

        await unionToken.connect(unionSigner).delegate(defaultAccount.address);
    });

    it("Propose", async () => {
        const {targets, values, calldatas, msg} = await getProposeParams();

        await governanceProxy["propose(address[],uint256[],bytes[],string)"](targets, values, calldatas, msg);
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

        const aaveCeilRes = await aaveAdapter.ceilingMap(daiAddress);
        aaveCeilRes.should.eq(aaveCeil);

        const compoundCeilRes = await compoundAdapter.ceilingMap(daiAddress);
        compoundCeilRes.should.eq(compoundCeil);

        const pureFloorRes = await pureAdapter.floorMap(daiAddress);
        pureFloorRes.should.eq(pureFloor);

        const halfDecayPointRes = await comptroller.halfDecayPoint();
        halfDecayPointRes.should.eq(halfDecayPoint);
    });
});
