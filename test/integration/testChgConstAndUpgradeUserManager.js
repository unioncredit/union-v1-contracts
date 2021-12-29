const {ethers, network} = require("hardhat");
const {parseEther} = require("ethers").utils;
require("chai").should();

describe("Test upgrade usermanager on forked mainnet", () => {
    const startBlock = 13845130; // UNION mainnet deployment
    const userManagerAddress = "0x49c910Ba694789B58F53BFF80633f90B8631c195";
    const adminAddress = "0xD83b4686e434B402c2Ce92f4794536962b2BE3E8";
    const userAccount = "0x07f0eb0c571B6cFd90d17b5de2cc51112Fb95915"; //An address with eth

    let UserManager, admin;
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

        UserManager = await ethers.getContractFactory("UserManager");
        userManager = await ethers.getContractAt("UserManager", userManagerAddress);

        // Impersonate admin and user accounts
        await network.provider.request({
            method: "hardhat_impersonateAccount",
            params: [userAccount]
        });

        await network.provider.request({
            method: "hardhat_impersonateAccount",
            params: [adminAddress]
        });

        admin = await ethers.provider.getSigner(adminAddress);
        signer = await ethers.provider.getSigner(userAccount);
        // Send ETH to admin
        await signer.sendTransaction({
            to: adminAddress,
            value: parseEther("10")
        });
    };

    before(deployAndInitContracts);

    it("upgrade usermanager", async () => {
        const beforeLimit = await userManager.MAX_TRUST_LIMIT();
        beforeLimit.should.eq("100");

        const newImp = await UserManager.deploy();
        await userManager.connect(admin).upgradeTo(newImp.address);

        const afterLimit = await userManager.MAX_TRUST_LIMIT();
        afterLimit.should.eq("25");
    });
});
