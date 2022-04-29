const {ethers} = require("hardhat");
const {expect} = require("chai");
require("chai").should();
const {parseEther} = require("ethers").utils;
const {AddressZero} = require("ethers").constants;

describe("ArbUnionWrapper Contract", () => {
    let ADMIN, router, gateway, arbUnionWrapper;
    let testToken;

    before(async () => {
        [ADMIN] = await ethers.getSigners();

        testToken = await upgrades.deployProxy(
            await ethers.getContractFactory("FaucetERC20"),
            ["Dai Stablecoin", "DAI"],
            {initializer: "__FaucetERC20_init(string,string)"}
        );
        await testToken.mint(ADMIN.address, parseEther("1000"));

        const GatewayMock = await ethers.getContractFactory("GatewayMock");
        gateway = await GatewayMock.deploy();

        const RouterMock = await ethers.getContractFactory("RouterMock");
        router = await RouterMock.deploy();

        const ArbUnionWrapper = await ethers.getContractFactory("ArbUnionWrapper");
        arbUnionWrapper = await ArbUnionWrapper.deploy(router.address, gateway.address, testToken.address);
    });

    it("Wrapper and unwrap test token", async () => {
        const amount = parseEther("1");
        await testToken.approve(arbUnionWrapper.address, amount);
        await expect(arbUnionWrapper.wrap(parseEther("100000"))).to.be.revertedWith("Insufficient balance");
        await arbUnionWrapper.wrap(amount);
        let bal = await arbUnionWrapper.balanceOf(ADMIN.address);
        bal.toString().should.eq(amount);
        await expect(arbUnionWrapper.unwrap(parseEther("100000"))).to.be.revertedWith("Insufficient balance");
        await arbUnionWrapper.unwrap(amount);
        bal = await arbUnionWrapper.balanceOf(ADMIN.address);
        bal.toString().should.eq("0");
    });

    it("Emergency withdraw", async () => {
        const amount = parseEther("1");
        let bal = await testToken.balanceOf(arbUnionWrapper.address);
        bal.toString().should.eq("0");
        await testToken.transfer(arbUnionWrapper.address, amount);
        bal = await testToken.balanceOf(arbUnionWrapper.address);
        bal.toString().should.eq(amount);
        await arbUnionWrapper.emergencyWithdraw();
        bal = await testToken.balanceOf(arbUnionWrapper.address);
        bal.toString().should.eq("0");
    });

    it("Register token on L2", async () => {
        await expect(arbUnionWrapper.isArbitrumEnabled()).to.be.revertedWith("NOT_EXPECTED_CALL");
        await arbUnionWrapper.registerTokenOnL2(AddressZero, 0, 0, 0, 0);
    });

    it("getChainId", async () => {
        const chainId = await arbUnionWrapper.getChainId();
        chainId.toString().should.eq("31337");
    });
});
