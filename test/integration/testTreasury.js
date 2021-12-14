const {ethers} = require("hardhat");
const {parseEther} = ethers.utils;
const {expect} = require("chai");
const {waitNBlocks, increaseTime} = require("../../utils");
const configs = require("../../deployConfig.js");

require("chai").should();

const {deployFullSuite} = require("../../utils/deployer");

describe("Treasury Contract", async () => {
    let unionTokenProxy;
    before(async () => {
        await network.provider.request({
            method: "hardhat_reset",
            params: [
                {
                    forking: {
                        jsonRpcUrl: "https://eth-mainnet.alchemyapi.io/v2/" + process.env.ALCHEMY_API_KEY,
                        blockNumber: 12542012
                    }
                }
            ]
        });
        [ADMIN, COMP] = await ethers.getSigners();

        const {unionToken} = await deployFullSuite();
        unionTokenProxy = unionToken;

        params = configs[1]["TreasuryVester"];
        const Treasury = await ethers.getContractFactory("Treasury");
        treasury = await Treasury.deploy(unionToken.address);
        const TreasuryVester = await ethers.getContractFactory("TreasuryVester");
        treasuryVester = await TreasuryVester.deploy(
            unionToken.address,
            treasury.address,
            params.vestingAmount,
            params.vestingBegin,
            params.vestingCliff,
            params.vestingEnd
        );

        await unionToken.transfer(treasuryVester.address, params.vestingAmount);
    });

    it("TreasuryVester claim", async () => {
        const block = await ethers.provider.getBlock(12542012);
        await expect(treasuryVester.claim()).to.be.revertedWith("not time yet");

        await increaseTime(params.vestingCliff - block.timestamp);
        let balance = await unionTokenProxy.balanceOf(treasury.address);
        balance.should.eq("0");
        await treasuryVester.claim();
        balance = await unionTokenProxy.balanceOf(treasury.address);
        balance.should.be.above("0");

        await increaseTime(params.vestingEnd - params.vestingBegin);
        await treasuryVester.claim();
        balance = await unionTokenProxy.balanceOf(treasury.address);
        balance.should.eq(params.vestingAmount);
    });

    it("Treasury drip", async () => {
        const paramsTreasury = configs[1]["Treasury"];
        await treasury.addSchedule(
            "12542100", //paramsTreasury.dripStart, There are too many blocks to test, so use a smaller value
            paramsTreasury.dripAmount.div(ethers.BigNumber.from(10)), //paramsTreasury.dripRate, Set a larger value to send the token
            COMP.address,
            paramsTreasury.dripAmount
        );
        balance = await unionTokenProxy.balanceOf(COMP.address);
        balance.should.eq("0");

        await expect(treasury.drip(COMP.address)).to.be.revertedWith("not yet started");

        await waitNBlocks(12542100 - 12542012);
        await treasury.drip(COMP.address);

        balance = await unionTokenProxy.balanceOf(COMP.address);
        balance.should.eq(paramsTreasury.dripAmount);
    });
});
