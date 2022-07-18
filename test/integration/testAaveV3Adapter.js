const {ethers, upgrades, network} = require("hardhat");
const {parseEther} = require("ethers").utils;
require("chai").should();
const axios = require("axios");
const {tenderlyWaitNBlocks} = require("../../utils");

describe("Test aave3 adapter on forking arbitrum", () => {
    const startBlock = 13839640;
    const {TENDERLY_USER, TENDERLY_PROJECT, TENDERLY_ACCESS_KEY} = process.env;
    const lendingPool = "0x794a61358D6845594F94dc1DB02A252b5b4814aD"; //aave lendingPool contract on arbitrum
    const marketAddress = "0x929EC64c34a17401F460460D4B9390518E5B473e"; //aave liquidity Mining
    const daiAddress = "0xda10009cbd5d07dd0cecc66161fc93d7c9000da1";
    const account = "0x4a2328a2c7ffc1ea1a6ba4623dfc28029aa2b3ce"; //An address with eth and dai on the arbitrum is used for testing
    let oldProvider;
    const deployAndInitContracts = async () => {
        axios.create({
            baseURL: "https://api.tenderly.co/api/v1",
            headers: {
                "X-Access-Key": TENDERLY_ACCESS_KEY || "",
                "Content-Type": "application/json"
            }
        });

        opts = {
            headers: {
                "X-Access-Key": TENDERLY_ACCESS_KEY
            }
        };

        const TENDERLY_FORK_API = `https://api.tenderly.co/api/v1/account/${TENDERLY_USER}/project/${TENDERLY_PROJECT}/fork`;
        const body = {
            network_id: "42161",
            block_number: startBlock
        };

        const res = await axios.post(TENDERLY_FORK_API, body, opts);
        forkId = res.data.simulation_fork.id;
        console.log(`forkId: ${forkId}`);
        forkRPC = `https://rpc.tenderly.co/fork/${forkId}`;
        provider = new ethers.providers.JsonRpcProvider(forkRPC);
        oldProvider = ethers.provider;
        ethers.provider = provider;

        signer = await ethers.provider.getSigner(account);

        dai = await ethers.getContractAt("FaucetERC20", daiAddress);
        market = await ethers.getContractAt("AMarket", marketAddress);
        const AaveV3Adapter = await ethers.getContractFactory("AaveV3Adapter");
        const UUPSProxy = await ethers.getContractFactory("UUPSProxy");
        console.log("create adapter impl");
        const impl = await AaveV3Adapter.deploy();
        const data = AaveV3Adapter.interface.encodeFunctionData("__AaveAdapter_init(address,address,address)", [
            account,
            lendingPool,
            marketAddress
        ]);
        console.log("create adapter proxy");
        const proxy = await UUPSProxy.deploy(impl.address, ethers.constants.AddressZero, data);
        aAdapter = await ethers.getContractAt("AaveV3Adapter", proxy.address);
        console.log("adapter: ", aAdapter.address);
        await aAdapter.mapTokenToAToken(daiAddress);
        const aTokenAddress = await aAdapter.tokenToAToken(daiAddress);
        console.log("aTokenAddress:", aTokenAddress);
    };

    before(deployAndInitContracts);

    it("deposit to aave and generate interest", async () => {
        const depositAmount = parseEther("0.1");
        console.log("transfer dai");
        await dai.connect(signer).transfer(aAdapter.address, depositAmount);
        console.log("deposit");
        await aAdapter.connect(signer).deposit(daiAddress);
        console.log("getSupplyView");
        let bal = await aAdapter.getSupplyView(daiAddress);
        console.log("start balance:", bal.toString());
        bal.should.be.above(depositAmount);

        await tenderlyWaitNBlocks(10);

        bal = await aAdapter.getSupplyView(daiAddress);
        console.log("after 10 blocks:", bal.toString());
        bal.should.be.above(depositAmount);

        console.log("withdrawAll");
        await aAdapter.connect(signer).withdrawAll(daiAddress, account);
        bal = await aAdapter.getSupplyView(daiAddress);
        console.log("after withdraw all:", bal.toString());
        bal.should.eq("0");
    });

    it("claim rewards", async () => {
        await aAdapter.claimRewards(daiAddress);
    });

    it("delete fork", async function () {
        ethers.provider = oldProvider;
        const TENDERLY_FORK_ACCESS_URL = `https://api.tenderly.co/api/v1/account/${process.env.TENDERLY_USER}/project/${process.env.TENDERLY_PROJECT}/fork/${forkId}`;
        await axios.delete(TENDERLY_FORK_ACCESS_URL, opts);
    });
});
