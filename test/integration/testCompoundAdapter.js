const {ethers, upgrades, network} = require("hardhat");
const {parseEther} = require("ethers").utils;
require("chai").should();

const {waitNBlocks} = require("../../utils");

describe("Test compound adapter on forking mainnet", () => {
    const cDaiAddress = "0x5d3a536E4D6DbD6114cc1Ead35777bAB948E3643"; //cDAI on mainnet
    const daiAddress = "0x6B175474E89094C44Da98b954EedeAC495271d0F";
    const account = "0x07f0eb0c571B6cFd90d17b5de2cc51112Fb95915"; //An address with eth and dai on the mainnet is used for testing
    const comptroller = "0x3d9819210a31b4961b30ef54be2aed79b9c9cd3b";
    const compAddress = "0xc00e94cb662c3520282e6f5717214004a7f26888";
    const deployAndInitContracts = async () => {
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
        await network.provider.request({
            method: "hardhat_impersonateAccount",
            params: [account]
        });
        signer = await ethers.provider.getSigner(account);
        [ADMIN] = await ethers.getSigners();

        dai = await ethers.getContractAt("FaucetERC20", daiAddress);

        cAdapter = await upgrades.deployProxy(
            await ethers.getContractFactory("CompoundAdapter"),
            [account, comptroller],
            {
                initializer: "__CompoundAdapter_init(address, address)"
            }
        );

        await cAdapter.mapTokenToCToken(daiAddress, cDaiAddress);
    };

    before(deployAndInitContracts);

    it("deposit to compound and generate interest", async () => {
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

    it("claim rewards", async () => {
        const comp = await ethers.getContractAt("FaucetERC20", compAddress);
        let balance = await comp.balanceOf(ADMIN.address);
        balance.should.eq("0");
        await cAdapter.claimRewards(daiAddress);
        balance = await comp.balanceOf(ADMIN.address);
        console.log("comp balance: ", balance.toString());
        balance.should.be.above("0");
    });
});
