const {providers, Wallet} = require("ethers");
const hre = require("hardhat");
const {ethers, getChainId} = hre;
const {Bridge} = require("arb-ts");
const {hexDataLength} = require("@ethersproject/bytes");

const configs = require("../deployConfig.js");

const walletPrivateKey = process.env.PRIVATE_KEY;

const encodeParameters = (types, values) => {
    const abi = new ethers.utils.AbiCoder();
    return abi.encode(types, values);
};

const main = async () => {
    const chainId = await getChainId();
    let l1Provider, l2Provider, ArbUnion;
    if (chainId == 1) {
        ArbUnion = configs[chainId]["ArbUnion"];
        l1Provider = new providers.JsonRpcProvider("https://mainnet.infura.io/v3/" + process.env.INFURA_ID);
        l2Provider = new providers.JsonRpcProvider("https://arb1.arbitrum.io/rpc");
    } else if (chainId == 4) {
        ArbUnion = configs[chainId]["ArbUnion"];
        l1Provider = new providers.JsonRpcProvider("https://rinkeby.infura.io/v3/" + process.env.INFURA_ID);
        l2Provider = new providers.JsonRpcProvider("https://rinkeby.arbitrum.io/rpc");
    } else {
        throw new Error("network not support");
    }
    const l1Wallet = new Wallet(walletPrivateKey, l1Provider);
    const l2Wallet = new Wallet(walletPrivateKey, l2Provider);

    const bridge = await Bridge.init(l1Wallet, l2Wallet);

    const dripToComptrollerBytes = encodeParameters(["uint256"], ["800000000000000000"]);
    const dripToComptrollerBytesLength = hexDataLength(dripToComptrollerBytes) + 4;

    const [_submissionPriceWei] = await bridge.l2Bridge.getTxnSubmissionPrice(dripToComptrollerBytesLength);

    const submissionPriceWei = _submissionPriceWei.mul(5);
    const maxGas = 275000;
    let gasPriceBid = await bridge.l2Provider.getGasPrice();
    //gasPriceBid = gasPriceBid.mul(ethers.BigNumber.from("2"));
    const callValue = submissionPriceWei.add(gasPriceBid.mul(maxGas));

    console.log({
        gasPriceBid: gasPriceBid.toString(),
        submissionPriceWei: submissionPriceWei.toString(),
        callValue: callValue.toString() //ethers.utils.formatUnits(callValue)
    });

    const connector = await ethers.getContract("ArbConnector");
    console.log({ArbConnector: connector.address});

    const tx = await connector.bridge(maxGas, gasPriceBid, submissionPriceWei, {
        value: callValue
    });

    console.log(`Send Union to Arbitrum succeeded! 🙌 ${(await tx.wait()).transactionHash}`);
};

main()
    .then(() => process.exit(0))
    .catch(error => {
        console.error(error);
        process.exit(1);
    });
