const {ethers, upgrades} = require("hardhat");
const {parseEther} = require("ethers").utils;

require("chai").should();

function printProgress(progress) {
    process.stdout.clearLine();
    process.stdout.cursorTo(0);
    process.stdout.write(progress);
}

describe("User Manager Contract", () => {
    let ADMIN, members, assetManager, SumOfTrust, UserManager, erc20, unionToken, creditLimitModel, comptroller, uToken;

    const borrowInterestPerBlock = ethers.utils.parseEther("0.000001"); //0.0001%
    const initialExchangeRateMantissa = ethers.utils.parseEther("1");
    const reserveFactorMantissa = ethers.utils.parseEther("0.5");
    const originationFee = ethers.utils.parseEther("0.01"); //1%
    const debtCeiling = ethers.utils.parseEther("1000");
    const maxBorrow = ethers.utils.parseEther("100");
    const minBorrow = ethers.utils.parseEther("1");
    const overdueBlocks = 10;

    before(async function () {
        [ADMIN, ...members] = await ethers.getSigners();

        const AssetManager = await ethers.getContractFactory("AssetManagerMock");
        const Comptroller = await ethers.getContractFactory("ComptrollerMock");
        const ERC20 = await ethers.getContractFactory("FaucetERC20");
        SumOfTrust = await ethers.getContractFactory("SumOfTrust");
        const UnionToken = await ethers.getContractFactory("UnionTokenMock");
        UserManager = await ethers.getContractFactory("UserManager");

        assetManager = await upgrades.deployProxy(AssetManager, [], {
            initializer: "__AssetManager_init()"
        });

        const FixedInterestRateModel = await ethers.getContractFactory("FixedInterestRateModelMock");
        fixedInterestRateModel = await FixedInterestRateModel.deploy(borrowInterestPerBlock);
        //name must be Dai Stablecoin, otherwise call signDaiPermit will error
        erc20 = await upgrades.deployProxy(ERC20, ["Dai Stablecoin", "DAI"], {
            initializer: "__FaucetERC20_init(string,string)"
        });
        unionToken = await UnionToken.deploy("Union Token", "unionToken");
        creditLimitModel = await SumOfTrust.deploy(3);
        comptroller = await Comptroller.deploy();
        comptroller = await upgrades.deployProxy(Comptroller, [], {
            initializer: "__ComptrollerMock_init()"
        });
        //mock transfer reward
        await comptroller.setRewardsInfo(unionToken.address, 0);

        const amount = parseEther("100");
        await erc20.mint(assetManager.address, amount);
        await erc20.mint(ADMIN.address, amount);

        for (const member of members) {
            await erc20.mint(member.address, amount);
        }
    });

    beforeEach(async () => {
        userManager = await upgrades.deployProxy(
            UserManager,
            [
                assetManager.address,
                unionToken.address,
                erc20.address,
                creditLimitModel.address,
                comptroller.address,
                ADMIN.address
            ],
            {
                initializer: "__UserManager_init(address,address,address,address,address,address)"
            }
        );

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
                ADMIN.address
            ],
            {
                initializer:
                    "__UToken_init(string,string,address,uint256,uint256,uint256,uint256,uint256,uint256,uint256,address)",
                unsafeAllowLinkedLibraries: true
            }
        );

        await uToken.setUserManager(userManager.address);
        await uToken.setAssetManager(assetManager.address);
        await uToken.setInterestRateModel(fixedInterestRateModel.address);

        await userManager.setUToken(uToken.address);

        const amount = parseEther("100");

        for (const member of members) {
            await userManager.addMember(member.address);
            await erc20.mint(member.address, amount);
        }
    });

    async function testBorrow(limit) {
        const _members = members.slice(0, limit);
        console.log("number of accounts:", _members.length);

        // stake and update trust
        for (let i = 0; i < _members.length; i++) {
            const selfMember = _members[i];
            const balance = await erc20.balanceOf(selfMember.address);
            await erc20.connect(selfMember).approve(userManager.address, balance);
            const tx = await userManager.connect(selfMember).stake(balance);
            await tx.wait();
            // vouch for everybody accept themselves
            for (const member of _members) {
                if (member.address !== selfMember.address) {
                    await userManager.connect(selfMember).updateTrust(member.address, balance);
                }
            }
        }

        // borrow DAI
        const member = _members[0];
        const amountToBorrow = parseEther("1");
        try {
            const tx = await uToken.connect(member).borrow(amountToBorrow);
            const resp = await tx.wait();
            console.log(`[0] borrow :: member: ${member.address}, gasUsed: ${resp.gasUsed.toString()}`);
        } catch (error) {
            console.log(`[0] borrow :: member: ${member.address}, gasUsed: FAILED`);
        }
    }

    [5, 10, 15, 20, 25, 30, 35, 40, 45, 50].forEach(limit => {
        it("test vouch limit", async () => {
            await testBorrow(limit);
        });
    });
});
