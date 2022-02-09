const {providers, Wallet} = require("ethers");
const {ethers} = require("hardhat");
const {Bridge} = require("arb-ts");

const ArbUNION = "0x2583713e5373BeF68754544EeF97b550ffe716C5";

const walletPrivateKey = process.env.PRIVATE_KEY;

const l1Provider = new providers.InfuraProvider("rinkeby", process.env.INFURA_ID);
const l2Provider = new providers.InfuraProvider("arbitrum-rinkeby", process.env.INFURA_ID);

const l1Wallet = new Wallet(walletPrivateKey, l1Provider);
const l2Wallet = new Wallet(walletPrivateKey, l2Provider);

console.log({l1Wallet: l1Wallet.address});

const main = async () => {
    const bridge = await Bridge.init(l1Wallet, l2Wallet);

    /**
     * For the gas limit, we'll simply use a hard-coded value (for more precise / dynamic estimates, see the estimateRetryableTicket method in the NodeInterface L2 "precompile")
     */
    const maxGas = 10000000;

    const customBridgeCalldataSize = 1000;
    const routerCalldataSize = 1000;

    const [_submissionPriceWeiForCustomBridge] = await bridge.l2Bridge.getTxnSubmissionPrice(customBridgeCalldataSize);
    const [_submissionPriceWeiForRouter] = await bridge.l2Bridge.getTxnSubmissionPrice(routerCalldataSize);

    console.log(
        `Current retryable base submission prices for custom bridge and raouter are: ${_submissionPriceWeiForCustomBridge.toString()}, ${_submissionPriceWeiForRouter.toString()}`
    );
    /**
     * For the L2 gas price, we simply query it from the L2 provider, as we would when using L1
     */
    const gasPriceBid = await bridge.l2Provider.getGasPrice();
    console.log(`L2 gas price: ${gasPriceBid.toString()}`);

    /**
     * With these three values (base submission price, gas price, gas kinit), we can calculate the total callvalue we'll need our L1 transaction to send to L2
     */
    const valueForGateway = _submissionPriceWeiForCustomBridge.add(gasPriceBid.mul(maxGas));
    const valueForRouter = _submissionPriceWeiForRouter.add(gasPriceBid.mul(maxGas));
    const callValue = valueForGateway.add(valueForRouter);

    const arbUnionWrapper = await ethers.getContract("ArbUnionWrapper");
    console.log({arbUnionWrapper: arbUnionWrapper.address});

    const registerTokenTx = await arbUnionWrapper.registerTokenOnL2(
        ArbUNION,
        _submissionPriceWeiForCustomBridge,
        _submissionPriceWeiForRouter,
        maxGas,
        gasPriceBid,
        {
            value: callValue
        }
    );

    const registerTokenRec = await registerTokenTx.wait();
    console.log(`Registering ArbUNION txn confirmed on L1! 🙌 ${registerTokenRec.transactionHash}`);
};

main()
    .then(() => process.exit(0))
    .catch(error => {
        console.error(error);
        process.exit(1);
    });
