const hre = require("hardhat");
const {ethers, getChainId} = hre;
const {Bridge} = require("arb-ts");
const {hexDataLength} = require("@ethersproject/bytes");
require("dotenv").config();

const networks = {
    1: "mainnet",
    4: "rinkeby"
};

const maxGas = 275000;

const encodeParameters = (types, values) => {
    const abi = new ethers.utils.AbiCoder();
    return abi.encode(types, values);
};

async function main(types, params, destAddr, value, data, excessFeeRefundAddress, callValueRefundAddress) {
    const chainId = await getChainId();
    if (!networks[chainId]) {
        throw new Error("network not support");
    }

    let l1Provider, l2Provider, inboxAddress;
    if (chainId == 1) {
    } else if (chainId == 4) {
        l1Provider = new ethers.providers.JsonRpcProvider("https://rinkeby.infura.io/v3/" + process.env.INFURA_ID);
        l2Provider = new ethers.providers.JsonRpcProvider("https://rinkeby.arbitrum.io/rpc");
        inboxAddress = "0x578bade599406a8fe3d24fd7f7211c0911f5b29e";
    }

    const signer = new ethers.Wallet(process.env.PRIVATE_KEY);
    const l1Signer = signer.connect(l1Provider);
    const l2Signer = signer.connect(l2Provider);
    const bridge = await Bridge.init(l1Signer, l2Signer);

    const newGreetingBytes = encodeParameters(types, params);
    const newGreetingBytesLength = hexDataLength(newGreetingBytes) + 4;
    const [_submissionPriceWei] = await bridge.l2Bridge.getTxnSubmissionPrice(newGreetingBytesLength);
    const submissionPriceWei = _submissionPriceWei.mul(5);

    let gasPriceBid = await bridge.l2Provider.getGasPrice();
    gasPriceBid = gasPriceBid.mul(ethers.BigNumber.from("2"));
    const callValue = submissionPriceWei.add(gasPriceBid.mul(maxGas));
    const target = inboxAddress;
    const signature = "createRetryableTicket(address,uint256,uint256,address,address,uint256,uint256,bytes)";
    const l2CallValue = value;
    const maxSubmissionCost = submissionPriceWei;

    const calldata = encodeParameters(
        ["address", "uint256", "uint256", "address", "address", "uint256", "uint256", "bytes"],
        [
            destAddr,
            l2CallValue,
            maxSubmissionCost,
            excessFeeRefundAddress,
            callValueRefundAddress,
            maxGas,
            gasPriceBid,
            data
        ]
    );

    return {target, value: callValue.toString(), signature, calldata};
}

module.exports = main;
