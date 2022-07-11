const {ethers} = require("hardhat");
const {expect} = require("chai");
require("chai").should();
const {parseEther} = require("ethers").utils;
const {AddressZero} = require("ethers").constants;

describe("ArbConnector Contract", () => {
    let ADMIN, router, gateway, arbUnionWrapper, arbConnector;
    let testToken;

    before(async () => {
        [ADMIN, target] = await ethers.getSigners();

        testToken = await upgrades.deployProxy(
            await ethers.getContractFactory("FaucetERC20"),
            ["Dai Stablecoin", "DAI"],
            {initializer: "__FaucetERC20_init(string,string)"}
        );
        await testToken.mint(ADMIN.address, parseEther("10000000"));

        const GatewayMock = await ethers.getContractFactory("GatewayMock");
        gateway = await GatewayMock.deploy();

        const RouterMock = await ethers.getContractFactory("RouterMock");
        router = await RouterMock.deploy();

        const ArbUnionWrapper = await ethers.getContractFactory("ArbUnionWrapper");
        arbUnionWrapper = await ArbUnionWrapper.deploy(router.address, gateway.address, testToken.address);

        const ArbConnector = await ethers.getContractFactory("ArbConnector");
        arbConnector = await ArbConnector.deploy(testToken.address, arbUnionWrapper.address, target.address);
    });

    it("Approve token", async () => {
        let allowance = await testToken.allowance(arbConnector.address, arbUnionWrapper.address);
        allowance.should.eq("0");
        await arbConnector.approveToken();
        allowance = await testToken.allowance(arbConnector.address, arbUnionWrapper.address);
        allowance.should.eq(ethers.constants.MaxUint256);
    });

    it("Bridge and Claim tokens", async () => {
        const amount = parseEther("1");
        await testToken.mint(arbConnector.address, amount);
        await arbConnector.bridge(0, 0, 0);
        let bal = await arbUnionWrapper.balanceOf(arbConnector.address);
        bal.toString().should.eq(amount);
        await expect(arbConnector.claimTokens(AddressZero)).to.be.revertedWith("recipient cant be 0");
        await arbConnector.claimTokens(ADMIN.address);
        bal = await arbUnionWrapper.balanceOf(arbConnector.address);
        bal.toString().should.eq("0");
    });
});
