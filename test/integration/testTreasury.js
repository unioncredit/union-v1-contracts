const {ethers} = require("hardhat");
const {expect} = require("chai");
const {waitNBlocks, increaseTime} = require("../../utils");
const configs = require("../../deployConfig.js");

require("chai").should();

const {deployAndInitUnionToken, deployAndInitTimelock} = require("../../utils/deployer");

describe("Treasury Contract", async () => {
    let unionTokenProxy;
    const treasuryVesterParams = configs[1]["TreasuryVester"];
    const treasuryParams = configs[1]["Treasury"];
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
        const timelock = await deployAndInitTimelock();
        unionTokenProxy = await deployAndInitUnionToken({timelock});
        const Treasury = await ethers.getContractFactory("Treasury");
        treasury = await Treasury.deploy(unionTokenProxy.address);
        const TreasuryVester = await ethers.getContractFactory("TreasuryVester");
        treasuryVester = await TreasuryVester.deploy(
            unionTokenProxy.address,
            treasury.address,
            treasuryVesterParams.vestingAmount,
            treasuryVesterParams.vestingBegin,
            treasuryVesterParams.vestingCliff,
            treasuryVesterParams.vestingEnd
        );

        await unionTokenProxy.transfer(treasuryVester.address, treasuryVesterParams.vestingAmount);
    });

    it("TreasuryVester claim", async () => {
        const block = await ethers.provider.getBlock(12542012);
        await expect(treasuryVester.claim()).to.be.revertedWith("not time yet");

        await increaseTime(treasuryVesterParams.vestingCliff - block.timestamp);
        const balanceBefore = await unionTokenProxy.balanceOf(treasury.address);
        balanceBefore.should.eq("0");

        await treasuryVester.claim();
        const balanceMiddle = await unionTokenProxy.balanceOf(treasury.address);
        const currBlockNum = await ethers.provider.getBlockNumber();
        const curBlock = await ethers.provider.getBlock(currBlockNum);
        const expectAmount =
            (treasuryVesterParams.vestingAmount * (curBlock.timestamp - treasuryVesterParams.vestingBegin)) /
            (treasuryVesterParams.vestingEnd - treasuryVesterParams.vestingBegin);

        console.log("expect balance: ", expectAmount.toString());
        console.log("actual balance: ", balanceMiddle.toString());
        //Because of the calculation accuracy problem, discard the last few digits and compare the sizes
        parseInt(balanceMiddle / 100000).should.eq(parseInt(expectAmount / 100000));

        await increaseTime(treasuryVesterParams.vestingEnd - treasuryVesterParams.vestingBegin);
        await treasuryVester.claim();
        const balanceAfter = await unionTokenProxy.balanceOf(treasury.address);
        balanceAfter.should.eq(treasuryVesterParams.vestingAmount);
    });

    it("Treasury drip", async () => {
        await treasury.addSchedule(
            "12542100", //treasuryParams.dripStart, There are too many blocks to test, so use a smaller value
            treasuryParams.dripAmount.div(ethers.BigNumber.from(10)), //treasuryParams.dripRate, Set a larger value to send the token
            COMP.address,
            treasuryParams.dripAmount
        );
        const balanceBefore = await unionTokenProxy.balanceOf(COMP.address);
        balanceBefore.should.eq("0");

        await expect(treasury.drip(COMP.address)).to.be.revertedWith("not yet started");

        await waitNBlocks(12542100 - 12542012);
        await treasury.drip(COMP.address);

        const balanceAfter = await unionTokenProxy.balanceOf(COMP.address);
        balanceAfter.should.eq(treasuryParams.dripAmount);
    });
});
