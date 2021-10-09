const {ethers, upgrades, network} = require("hardhat");
const {parseEther} = require("ethers").utils;
require("chai").should();

const {waitNBlocks} = require("../../utils");

describe("Test compound adapter on forking mainnet", () => {
    const cDaiAddress = "0x5d3a536E4D6DbD6114cc1Ead35777bAB948E3643"; //cDAI on mainnet
    const daiAddress = "0x6B175474E89094C44Da98b954EedeAC495271d0F";
    const account = "0x07f0eb0c571B6cFd90d17b5de2cc51112Fb95915"; //An address with eth and dai on the mainnet is used for testing

    const deployAndInitContracts = async () => {
        await network.provider.request({
            method: "hardhat_impersonateAccount",
            params: [account]
        });
        signer = await ethers.provider.getSigner(account);

        dai = await ethers.getContractAt("FaucetERC20", daiAddress);

        cAdapter = await upgrades.deployProxy(await ethers.getContractFactory("CompoundAdapter"), [account], {
            initializer: "__CompoundAdapter_init(address)"
        });

        await cAdapter.mapTokenToCToken(daiAddress, cDaiAddress);
    };

    before(deployAndInitContracts);

    it("deposit to aave and generate interest", async () => {
        const depositAmount = parseEther("100");
        await dai.connect(signer).transfer(cAdapter.address, depositAmount);
        await cAdapter.connect(signer).deposit(daiAddress);

        //Call getSupply to update the status of cDai, otherwise the exchangeRate will not change
        await cAdapter.getSupply(daiAddress);
        const balBefore = await cAdapter.getSupplyView(daiAddress);
        console.log("start balance:", balBefore.toString());
        //Interest has already been generated at this time, so it should be greater than the deposited amount
        balBefore.should.be.above(depositAmount);

        await waitNBlocks(10);

        await cAdapter.getSupply(daiAddress);
        const balAfter = await cAdapter.getSupplyView(daiAddress);
        console.log("after 10 blocks:", balAfter.toString());
        balAfter.should.be.above(balBefore);

        await cAdapter.connect(signer).withdrawAll(daiAddress, account);
        const bal = await cAdapter.getSupplyView(daiAddress);
        console.log("after withdraw all:", bal.toString());
        bal.should.eq("0");
    });
});
