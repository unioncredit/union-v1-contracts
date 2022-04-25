const {ethers} = require("hardhat");
const {expect} = require("chai");
require("chai").should();
const {parseEther} = require("ethers").utils;
const {signERC2612Permit} = require("eth-permit");

describe("ArbUnionToken Contract", () => {
    let ADMIN, ALICE, BOB, l1TokenAddress, l2Gateway;
    const name = "Arbitrum UNION";
    let testToken;
    let unionToken;

    before(async () => {
        [ADMIN, ALICE, BOB, GEORGE, COMPTROLLER, l2Gateway, l1TokenAddress] = await ethers.getSigners();

        testToken = await upgrades.deployProxy(
            await ethers.getContractFactory("FaucetERC20"),
            ["Dai Stablecoin", "DAI"], // exact name needed for signature verifaction
            {initializer: "__FaucetERC20_init(string,string)"}
        );

        await testToken.mint(ADMIN.address, parseEther("10000000"));
    });

    const deployUnionToken = async () => {
        const UnionToken = await ethers.getContractFactory("ArbUnion");
        unionToken = await UnionToken.deploy(l2Gateway.address, l1TokenAddress.address);
    };

    describe("Initialization", () => {
        before(deployUnionToken);

        it("Token should have correct name", async () => {
            const name = await unionToken.name();
            name.should.eq("Arbitrum UNION");
        });

        it("Token should have correct symbol", async () => {
            const symbol = await unionToken.symbol();
            symbol.should.eq("arbUNION");
        });

        it("Token should have correct decimals", async () => {
            const decimals = await unionToken.decimals();
            decimals.toString().should.eq("18");
        });

        it("l2Gateway should be whitelisted", async () => {
            const isWhitelisted = await unionToken.isWhitelisted(l2Gateway.address);
            isWhitelisted.should.eq(true);
        });
    });

    describe("Only L2Gateway can mint and burn", () => {
        const TEST_AMOUNT = parseEther("1");
        before(deployUnionToken);

        it("Mint and Burn by bob will revert", async () => {
            await expect(unionToken.connect(BOB).bridgeMint(BOB.address, TEST_AMOUNT)).to.be.revertedWith(
                "NOT_GATEWAY"
            );
            await expect(unionToken.connect(BOB).bridgeBurn(BOB.address, TEST_AMOUNT)).to.be.revertedWith(
                "NOT_GATEWAY"
            );
        });

        it("L2Gateway can mint and burn", async () => {
            await unionToken.connect(l2Gateway).bridgeMint(BOB.address, TEST_AMOUNT);
            let bal = await unionToken.balanceOf(BOB.address);
            bal.toString().should.eq(TEST_AMOUNT);
            await unionToken.connect(l2Gateway).bridgeBurn(BOB.address, TEST_AMOUNT);
            bal = await unionToken.balanceOf(BOB.address);
            bal.toString().should.eq(parseEther("0"));
        });
    });

    describe("Approve tokens using permit signature", () => {
        const TEST_AMOUNT = parseEther("1");
        const deadline = ethers.constants.MaxUint256;
        let nonce;
        let v, r, s;

        before(async () => {
            await deployUnionToken();
            nonce = await unionToken.nonces(BOB.address);
        });

        it("Allowance should be zero", async () => {
            const allowance = await unionToken.allowance(BOB.address, ALICE.address);
            allowance.toString().should.eq("0");
        });

        it("Admin should be able to send tx in which Bob permits Alice to spend tokens", async () => {
            const chainId = await unionToken.getChainId();

            const result = await signERC2612Permit(
                ethers.provider._hardhatProvider,
                {
                    name,
                    chainId: parseInt(chainId),
                    version: "1",
                    verifyingContract: unionToken.address
                },
                BOB.address,
                ALICE.address,
                TEST_AMOUNT.toString()
            );
            await expect(
                await unionToken.permit(BOB.address, ALICE.address, TEST_AMOUNT, deadline, result.v, result.r, result.s)
            )
                .to.emit(unionToken, "Approval")
                .withArgs(BOB.address, ALICE.address, TEST_AMOUNT);
        });

        it("Allowance should be reflected in contract", async () => {
            const allowance = await unionToken.allowance(BOB.address, ALICE.address);
            allowance.toString().should.eq(TEST_AMOUNT.toString());
        });

        it("Nonce should be incremented for Bob", async () => {
            const nonce = await unionToken.nonces(BOB.address);
            nonce.toString().should.eq("1");
        });
    });

    describe("When Whitelist is enabled, only l2Gateway and comptroller can send Union", () => {
        before(deployUnionToken);
        before(async () => {
            await unionToken.enableWhitelist();
            await unionToken.whitelist(COMPTROLLER.address);
            await unionToken.connect(l2Gateway).bridgeMint(l2Gateway.address, parseEther("10"));
        });

        it("Whitelist should be enabled", async () => {
            const whitelistEnabled = await unionToken.whitelistEnabled();
            whitelistEnabled.should.eq(true);
        });

        it("Comptroller should be whitelisted", async () => {
            const isWhitelisted = await unionToken.isWhitelisted(COMPTROLLER.address);
            isWhitelisted.should.eq(true);
        });

        it("Unwhitelist Comptroller", async () => {
            await unionToken.unwhitelist(COMPTROLLER.address);
            const isWhitelisted = await unionToken.isWhitelisted(COMPTROLLER.address);
            isWhitelisted.should.eq(false);

            await unionToken.whitelist(COMPTROLLER.address);
        });

        it("l2Gateway should be whitelisted", async () => {
            const isWhitelisted = await unionToken.isWhitelisted(l2Gateway.address);
            isWhitelisted.should.eq(true);
        });

        it("l2Gateway should be able to transfer tokens to Comptroller", async () => {
            await unionToken.connect(l2Gateway).transfer(COMPTROLLER.address, 10);
        });

        it("Comptroller should be able to transfer tokens to Bob", async () => {
            await unionToken.connect(COMPTROLLER).transfer(BOB.address, 10);
        });

        it("Bob should not be able to transfer tokens to admin", async () => {
            await expect(unionToken.connect(BOB).transfer(ADMIN.address, 1)).to.be.revertedWith(
                "Whitelistable: address not whitelisted"
            );
        });

        it("Bob should not be able to transfer tokens even after approval", async () => {
            try {
                await unionToken.connect(l2Gateway).approve(BOB.address, 1);
            } catch (e) {
                // assert.fail("Approval failed");
            }
            await expect(unionToken.connect(BOB).transferFrom(l2Gateway.address, BOB.address, 1)).to.be.revertedWith(
                "Whitelistable: address not whitelisted"
            );
        });

        it("l2Gateway should be able to transfer Bob's approved tokens", async () => {
            try {
                await unionToken.connect(BOB).approve(l2Gateway.address, 1);
            } catch (e) {
                // assert.fail("Approval failed");
            }
            await unionToken.connect(l2Gateway).transferFrom(BOB.address, l2Gateway.address, 1);
        });

        it("Comptroller should be able to transfer Bob's approved tokens", async () => {
            try {
                await unionToken.connect(BOB).approve(COMPTROLLER.address, 1);
            } catch (e) {
                // assert.fail("Approval failed");
            }
            await unionToken.connect(COMPTROLLER).transferFrom(BOB.address, COMPTROLLER.address, 1);
        });

        it("Disable whitelist", async () => {
            await unionToken.disableWhitelist();
        });

        it("Bob should be able to transfer his tokens", async () => {
            unionToken.connect(BOB).transfer(l2Gateway.address, 1);
        });

        it("Bob should be able to transfer l2Gateway's approved tokens", async () => {
            try {
                await unionToken.connect(BOB).approve(l2Gateway.address, 1);
            } catch (e) {
                // assert.fail("Approval failed");
            }
            unionToken.connect(BOB).transferFrom(l2Gateway.address, BOB.address, 1);
        });
    });
});
