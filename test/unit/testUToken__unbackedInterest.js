const {waitNBlocks} = require("../../utils");
const {ethers, upgrades, waffle} = require("hardhat");
const {expect} = require("chai");

require("chai").should();
const {signDaiPermit, signERC2612Permit} = require("eth-permit");

describe("UToken Contract", async () => {
    let admin, alice, bob, staker1, staker2, staker3;
    let erc20, assetManager, unionToken, fixedInterestRateModel, userManager, comptroller, marketRegistry, uToken;

    const borrowInterestPerBlock = ethers.utils.parseEther("0.000001"); //0.0001%
    const initialExchangeRateMantissa = ethers.utils.parseEther("1");
    const reserveFactorMantissa = ethers.utils.parseEther("0.5");
    const originationFee = ethers.utils.parseEther("0.01"); //1%
    const debtCeiling = ethers.utils.parseEther("1000");
    const maxBorrow = ethers.utils.parseEther("100");
    const minBorrow = ethers.utils.parseEther("1");
    const overdueBlocks = 10;

    before(async () => {
        [admin, alice, bob, staker1, staker2, staker3] = await ethers.getSigners();

        erc20 = await upgrades.deployProxy(
            await ethers.getContractFactory("FaucetERC20"),
            ["Dai Stablecoin", "DAI"], // exact name needed for signature verifaction
            {initializer: "__FaucetERC20_init(string,string)"}
        );

        const UnionToken = await ethers.getContractFactory("UnionTokenMock");
        unionToken = await UnionToken.deploy("Union Token", "Union");

        FixedInterestRateModel = await ethers.getContractFactory("FixedInterestRateModel");
        fixedInterestRateModel = await FixedInterestRateModel.deploy(ethers.utils.parseEther("1"));

        marketRegistry = await upgrades.deployProxy(await ethers.getContractFactory("MarketRegistryMock"), [], {
            initializer: "__MarketRegistryMock_init()"
        });

        comptroller = await upgrades.deployProxy(await ethers.getContractFactory("ComptrollerMock"), [], {
            initializer: "__ComptrollerMock_init()"
        });

        assetManager = await upgrades.deployProxy(await ethers.getContractFactory("AssetManagerMock"), [], {
            initializer: "__AssetManager_init()"
        });

        SumOfTrust = await ethers.getContractFactory("SumOfTrust");
        creditLimitModel = await SumOfTrust.deploy("1");

        userManager = await upgrades.deployProxy(
            await ethers.getContractFactory("UserManager"),
            [
                assetManager.address,
                unionToken.address,
                erc20.address,
                creditLimitModel.address,
                comptroller.address,
                admin.address
            ],
            {
                initializer: "__UserManager_init(address,address,address,address,address,address)"
            }
        );

        await unionToken.transfer(comptroller.address, ethers.utils.parseEther("1000"));
        await comptroller.setRewardsInfo(unionToken.address, 100);

        const amount = ethers.utils.parseEther("1000");
        await erc20.mint(assetManager.address, ethers.utils.parseEther("20"));
        await erc20.mint(alice.address, amount);
        await erc20.mint(bob.address, amount);
        await erc20.mint(staker1.address, amount);
        await erc20.mint(staker2.address, amount);
        await erc20.mint(staker3.address, amount);
    });

    beforeEach(async () => {
        const UToken = await ethers.getContractFactory("UDai");
        uToken = await upgrades.deployProxy(
            UToken,
            [
                "uToken",
                "uToken",
                erc20.address,
                initialExchangeRateMantissa,
                reserveFactorMantissa,
                originationFee,
                debtCeiling,
                maxBorrow,
                minBorrow,
                overdueBlocks,
                admin.address
            ],
            {
                initializer:
                    "__UToken_init(string,string,address,uint256,uint256,uint256,uint256,uint256,uint256,uint256,address)",
                unsafeAllowLinkedLibraries: true
            }
        );

        await marketRegistry.deleteMarket(erc20.address);
        await marketRegistry.addUToken(erc20.address, uToken.address);
        await marketRegistry.addUserManager(erc20.address, userManager.address);
        await uToken.setUserManager(userManager.address);
        await uToken.setAssetManager(assetManager.address);
        await uToken.setInterestRateModel(fixedInterestRateModel.address);
        await userManager.setUToken(uToken.address);
    });

    it("Borrow and calc interest, fee", async () => {
        console.log(await userManager.uToken());
        const amount = ethers.utils.parseEther("100");

        await userManager.addMember(bob.address);
        await userManager.addMember(staker1.address);

        await erc20.connect(staker1).approve(userManager.address, ethers.constants.MaxUint256);
        await userManager.connect(staker1).stake(amount);
        await userManager.connect(staker1).updateTrust(bob.address, amount);

        expect(await userManager.checkIsMember(bob.address)).eq(true);
        expect(await userManager.checkIsMember(staker1.address)).eq(true);

        const creditLimit = await userManager.getCreditLimit(bob.address);

        const fee = await uToken.calculatingFee(creditLimit);
        await uToken.connect(bob).borrow(creditLimit.sub(fee));

        const borrowed = await uToken.getBorrowed(bob.address);
        await waitNBlocks(25);
        await uToken.accrueInterest();
        const borrowedWithInterest = await uToken.borrowBalanceView(bob.address);
        const totalStaked = await userManager.totalStaked();

        console.log("borrowed", ethers.utils.formatEther(borrowed.toString()));
        console.log("borrowed with interest", ethers.utils.formatEther(borrowedWithInterest.toString()));
        console.log("total staked", ethers.utils.formatEther(totalStaked.toString()));
        console.log("unbacked", ethers.utils.formatEther(borrowedWithInterest.sub(totalStaked).toString()));
    });
});
