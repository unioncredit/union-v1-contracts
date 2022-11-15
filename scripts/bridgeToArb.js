const {providers} = require("ethers");
const hre = require("hardhat");
const {ethers} = hre;
const {L1ToL2MessageGasEstimator} = require("@arbitrum/sdk/dist/lib/message/L1ToL2MessageGasEstimator");
const {hexDataLength} = require("@ethersproject/bytes");

const encodeParameters = (types, values) => {
    const abi = new ethers.utils.AbiCoder();
    return abi.encode(types, values);
};

//mainnet
const CONNECTOR_ADDR = "0x307ED81138cA91637E432DbaBaC6E3A42699032a";

const main = async () => {
    let l1Provider, l2Provider;
    l1Provider = new providers.JsonRpcProvider("https://eth-mainnet.alchemyapi.io/v2/" + process.env.ALCHEMY_API_KEY);
    l2Provider = new providers.JsonRpcProvider("https://arb1.arbitrum.io/rpc");
    const dripToComptrollerBytes = encodeParameters(["uint256"], ["800000000000000000"]);
    const dripToComptrollerBytesLength = hexDataLength(dripToComptrollerBytes) + 4;
    const l1ToL2MessageGasEstimate = new L1ToL2MessageGasEstimator(l2Provider);
    console.log(`dripToComptrollerBytesLength:${dripToComptrollerBytesLength}`);
    const _submissionPriceWei = await l1ToL2MessageGasEstimate.estimateSubmissionFee(
        l1Provider,
        await l1Provider.getGasPrice(),
        dripToComptrollerBytesLength
    );
    console.log(`_submissionPriceWei:${_submissionPriceWei}`);
    const submissionPriceWei = _submissionPriceWei.mul(5);
    const maxGas = 275000;
    const gasPriceBid = await l2Provider.getGasPrice();
    const callValue = submissionPriceWei.add(gasPriceBid.mul(maxGas));

    console.log({
        gasPriceBid: gasPriceBid.toString(),
        submissionPriceWei: submissionPriceWei.toString(),
        callValue: callValue.toString()
    });

    const connector = await ethers.getContract(CONNECTOR_ADDR, CONNECTOR_ABI, signer);
    const bridgeTx = await connector.bridge(maxGas, gasPriceBid, submissionPriceWei, {
        value: callValue
    });

    console.log(`Send Union to Arbitrum succeeded! 🙌 ${(await bridgeTx.wait()).transactionHash}`);
};

main()
    .then(() => process.exit(0))
    .catch(error => {
        console.error(error);
        process.exit(1);
    });

const CONNECTOR_ABI = [
    {
        inputs: [
            {
                internalType: "uint256",
                name: "maxGas",
                type: "uint256"
            },
            {
                internalType: "uint256",
                name: "gasPriceBid",
                type: "uint256"
            },
            {
                internalType: "uint256",
                name: "maxSubmissionCost",
                type: "uint256"
            }
        ],
        name: "bridge",
        outputs: [],
        stateMutability: "payable",
        type: "function"
    }
];
