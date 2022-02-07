const {ethers, upgrades} = require("hardhat");

const {expect} = require("chai");
require("chai").should();
const {signERC2612Permit} = require("eth-permit");

const {parseEther} = require("ethers").utils;

describe("User Manager Arbi Contract", () => {
    before(async function () {
        [ADMIN, ALICE, BOB, TOM, MEMBER1, MEMBER2, MEMBER3, MEMBER4, APP, PROXY_ADMIN] = await ethers.getSigners();

        const AssetManager = await ethers.getContractFactory("AssetManagerMock");
        const Comptroller = await ethers.getContractFactory("ComptrollerMock");
        const ERC20 = await ethers.getContractFactory("FaucetERC20");
        SumOfTrust = await ethers.getContractFactory("SumOfTrust");
        const UnionToken = await ethers.getContractFactory("UnionTokenMock");
        UserManager = await ethers.getContractFactory("UserManagerArbiMock");
        UToken = await ethers.getContractFactory("UTokenMock");

        assetManager = await upgrades.deployProxy(AssetManager, [], {
            initializer: "__AssetManager_init()"
        });
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
        uToken = await upgrades.deployProxy(UToken, [], {
            initializer: "__UToken_init()"
        });

        const amount = parseEther("1000000");
        await erc20.mint(assetManager.address, amount);
        await erc20.mint(ADMIN.address, amount);
        await erc20.mint(MEMBER1.address, amount);
        await erc20.mint(MEMBER2.address, amount);
        await erc20.mint(MEMBER3.address, amount);
        await erc20.mint(MEMBER4.address, amount);
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

        await userManager.setUToken(uToken.address);
        await userManager.addMember(MEMBER1.address);
        await userManager.addMember(MEMBER2.address);
        await userManager.addMember(MEMBER3.address);
        await userManager.addMember(MEMBER4.address);
    });

    it("Cannot vouch more than max trust", async () => {
        const memberFee = parseEther("0.1");
        await userManager.setNewMemberFee(memberFee);

        const stakeAmount = parseEther("1000");
        const trustAmount = parseEther("500");

        await unionToken.transfer(BOB.address, memberFee);

        await erc20.connect(MEMBER1).approve(userManager.address, stakeAmount);
        await userManager.connect(MEMBER1).stake(stakeAmount);
        await erc20.connect(MEMBER2).approve(userManager.address, stakeAmount);
        await userManager.connect(MEMBER2).stake(stakeAmount);
        await erc20.connect(MEMBER3).approve(userManager.address, stakeAmount);
        await userManager.connect(MEMBER3).stake(stakeAmount);
        await erc20.connect(MEMBER4).approve(userManager.address, stakeAmount);
        await userManager.connect(MEMBER4).stake(stakeAmount);

        await userManager.connect(MEMBER1).updateTrust(BOB.address, trustAmount);
        await userManager.connect(MEMBER2).updateTrust(BOB.address, trustAmount);
        await userManager.connect(MEMBER3).updateTrust(BOB.address, trustAmount);
        await expect(userManager.connect(MEMBER4).updateTrust(BOB.address, trustAmount)).to.revertedWith(
            "MaxTrustLimitReached()"
        );
    });

    it("Add trust and apply for new member", async () => {
        //set member fee
        const memberFee = parseEther("0.1");
        await userManager.setNewMemberFee(memberFee);
        const fee = await userManager.newMemberFee();
        fee.toString().should.eq(memberFee.toString());
        const stakeAmount = parseEther("1000");
        const trustAmount = parseEther("500");
        let isMember = await userManager.connect(BOB).checkIsMember(BOB.address);
        isMember.should.eq(false);
        await unionToken.transfer(BOB.address, memberFee);
        await unionToken.connect(BOB).approve(userManager.address, memberFee);
        //Set up three guarantors
        await erc20.connect(MEMBER1).approve(userManager.address, stakeAmount);
        await userManager.connect(MEMBER1).stake(stakeAmount);

        await erc20.connect(MEMBER2).approve(userManager.address, stakeAmount);
        await userManager.connect(MEMBER2).stake(stakeAmount);

        await erc20.connect(MEMBER3).approve(userManager.address, stakeAmount);
        await userManager.connect(MEMBER3).stake(stakeAmount);

        //not enough effective stakers
        await userManager.connect(MEMBER1).updateTrust(BOB.address, trustAmount);
        await userManager.connect(MEMBER2).updateTrust(BOB.address, trustAmount);
        await expect(userManager.connect(BOB).registerMember(BOB.address)).to.be.revertedWith("NotEnoughStakers()");
        //balance not enough
        await userManager.connect(MEMBER3).updateTrust(BOB.address, trustAmount);
        await userManager.setNewMemberFee(parseEther("1000000000000"));
        await expect(userManager.connect(BOB).registerMember(BOB.address)).to.be.revertedWith(
            "ERC20: transfer amount exceeds balance"
        );

        //register member
        await userManager.setNewMemberFee(memberFee);
        await expect(userManager.connect(BOB).registerMember(BOB.address))
            .to.emit(unionToken, "Transfer")
            .withArgs(BOB.address, comptroller.address, memberFee);
        isMember = await userManager.checkIsMember(BOB.address);
        isMember.should.eq(true);

        //Cannot register twice
        await expect(userManager.connect(BOB).registerMember(BOB.address)).to.be.revertedWith("NoExistingMember()");
    });

    it("Add trust and apply for new member with permit", async () => {
        const memberFee = parseEther("0.1");
        await userManager.setNewMemberFee(memberFee);

        const stakeAmount = parseEther("1000");
        const trustAmount = parseEther("500");

        await unionToken.transfer(BOB.address, memberFee);

        await erc20.connect(MEMBER1).approve(userManager.address, stakeAmount);
        await userManager.connect(MEMBER1).stake(stakeAmount);
        await erc20.connect(MEMBER2).approve(userManager.address, stakeAmount);
        await userManager.connect(MEMBER2).stake(stakeAmount);
        await erc20.connect(MEMBER3).approve(userManager.address, stakeAmount);
        await userManager.connect(MEMBER3).stake(stakeAmount);

        await userManager.connect(MEMBER1).updateTrust(BOB.address, trustAmount);
        await userManager.connect(MEMBER2).updateTrust(BOB.address, trustAmount);
        await userManager.connect(MEMBER3).updateTrust(BOB.address, trustAmount);

        const result = await signERC2612Permit(
            waffle.provider._hardhatNetwork.provider,
            {
                name: "Union Token",
                chainId: "31337",
                version: "1",
                verifyingContract: unionToken.address
            },
            BOB.address,
            userManager.address,
            memberFee.toString()
        );

        await expect(
            userManager
                .connect(BOB)
                .registerMemberWithPermit(BOB.address, memberFee, result.deadline, result.v, result.r, result.s)
        )
            .to.emit(unionToken, "Transfer")
            .withArgs(BOB.address, comptroller.address, memberFee);

        isMember = await userManager.checkIsMember(BOB.address);
        isMember.should.eq(true);
    });
});
