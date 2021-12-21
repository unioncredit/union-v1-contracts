const {ethers, network} = require("hardhat");
const {parseEther} = require("ethers").utils;
const {expect} = require("chai");

require("chai").should();

describe("Test aave adapter A token addition on forked mainnet", () => {
    const startBlock = 13845130; // UNION mainnet deployment
    const daiAddress = "0x6B175474E89094C44Da98b954EedeAC495271d0F";
    const userAccount = "0x07f0eb0c571B6cFd90d17b5de2cc51112Fb95915"; //An address with eth and dai on the mainnet is used for testing
    const admin = "0xD83b4686e434B402c2Ce92f4794536962b2BE3E8";
    const aAdapterAddress = "0xE8c77A541c933Aa1320Aa2f89a61f91130e4012d";

    let dai, aAdapter;

    const deployAndInitContracts = async () => {
        await network.provider.request({
            method: "hardhat_reset",
            params: [
                {
                    forking: {
                        jsonRpcUrl: "https://eth-mainnet.alchemyapi.io/v2/" + process.env.ALCHEMY_API_KEY,
                        blockNumber: startBlock
                    }
                }
            ]
        });

        dai = await ethers.getContractAt("FaucetERC20", daiAddress);
        aAdapter = await ethers.getContractAt("AaveAdapter", aAdapterAddress);

        // Impersonate admin and user accounts
        await network.provider.request({
            method: "hardhat_impersonateAccount",
            params: [userAccount]
        });

        await network.provider.request({
            method: "hardhat_impersonateAccount",
            params: [admin]
        });
    };

    before(deployAndInitContracts);

    it("setup A token for DAI and deposit to aave adapter", async () => {
        let signer;

        signer = await ethers.provider.getSigner(userAccount);
        const userBalance = await ethers.provider.getBalance(userAccount);
        console.log("User balance:", userBalance.toString());
        const ethToSend = userBalance.mul(300).div(1000);

        // Send ETH to admin
        await signer.sendTransaction({
            to: admin,
            value: ethToSend
        });
        const adminBalance = await ethers.provider.getBalance(admin);
        console.log("Admin Balance:", adminBalance.toString());

        // Send DAI to AaveAdapter
        const depositAmount = parseEther("100");
        await dai.connect(signer).transfer(aAdapter.address, depositAmount);

        // Fail to get supply view as A token is currently not set
        const supplyResp = aAdapter.getSupplyView(daiAddress);
        await expect(supplyResp).to.be.revertedWith("");

        // Fail to deposit as A token is currently not set
        const depositResp = aAdapter.deposit(daiAddress);
        await expect(depositResp).to.be.revertedWith("");

        // Set up A token
        signer = await ethers.provider.getSigner(admin);
        await aAdapter.connect(signer).mapTokenToAToken(daiAddress);
        const bal = await aAdapter.getSupplyView(daiAddress);
        console.log("AaveAdapter Balance:", bal.toString());

        // Deposit into AaveAdapter
        signer = await ethers.provider.getSigner(userAccount);
        await aAdapter.connect(signer).deposit(daiAddress);

        const newBal = await aAdapter.getSupplyView(daiAddress);
        console.log("AaveAdapter new balance:", newBal.toString());
        newBal.toString().should.eq(depositAmount.toString());
    });
});
