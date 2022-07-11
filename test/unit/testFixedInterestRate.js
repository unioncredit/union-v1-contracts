const {ethers} = require("hardhat");
const {expect} = require("chai");
const {parseEther} = require("ethers").utils;

require("chai").should();

describe("InterestRatemodel Contract", () => {
    let interestRateModel;

    before(async function () {
        const FixedInterestRateModel = await ethers.getContractFactory("FixedInterestRateModel");
        interestRateModel = await FixedInterestRateModel.deploy(0);
    });

    it("Is interest rate model", async () => {
        const isInterestRateModel = await interestRateModel.isInterestRateModel();
        isInterestRateModel.should.eq(true);
    });

    it("Test borrow rate", async () => {
        const maxRate = await interestRateModel.BORROW_RATE_MAX_MANTISSA();
        await expect(interestRateModel.setInterestRate(maxRate.add(1))).to.be.revertedWith(
            "borrow rate is absurdly high"
        );
        await interestRateModel.setInterestRate(maxRate);
        const rate = await interestRateModel.getBorrowRate();
        rate.toString().should.eq(maxRate);
    });

    it("Get supply rate", async () => {
        const reserveFactorMantissa = parseEther("0.5");
        await expect(interestRateModel.getSupplyRate(parseEther("2"))).to.be.revertedWith(
            "reserveFactorMantissa error"
        );
        const rate = await interestRateModel.getBorrowRate();
        const expectSupplyRate = rate.mul(parseEther("1").sub(reserveFactorMantissa)).div(parseEther("1"));

        const res = await interestRateModel.getSupplyRate(reserveFactorMantissa);
        res.toString().should.eq(expectSupplyRate);
    });
});
