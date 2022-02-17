const {ethers} = require("hardhat");
const parseEther = ethers.utils.parseEther;
const arbProposeParams = require("../../scripts/arbProposeParams");

const daiAddress = "0x5364Dc963c402aAF150700f38a8ef52C1D7D7F14";
const pureAdapterAddress = "0xb153B6Bb0F30A7cF09EbC55Edd43E503210fa22A";
const comptrollerAddress = "0xDC42379473F629351e9bc59A8dd4785b20E21615";

const pureFloor = parseEther("120000");
const halfDecayPoint = 1200000;

async function main() {
    const pureAdapter = await ethers.getContractAt("PureTokenAdapter", pureAdapterAddress);
    const comptroller = await ethers.getContractAt("Comptroller", comptrollerAddress);

    const actions = [
        [
            ["address", "uint256"],
            [daiAddress, pureFloor],
            pureAdapterAddress,
            "0",
            pureAdapter.interface.encodeFunctionData("setFloor(address,uint256)", [daiAddress, pureFloor])
        ],
        [
            ["uint256"],
            [halfDecayPoint],
            comptrollerAddress,
            "0",
            comptroller.interface.encodeFunctionData("setHalfDecayPoint(uint256)", [halfDecayPoint])
        ]
    ];
    //L1 address
    const excessFeeRefundAddress = "0x7a0C61EdD8b5c0c5C1437AEb571d7DDbF8022Be4";
    const callValueRefundAddress = "0x7a0C61EdD8b5c0c5C1437AEb571d7DDbF8022Be4";
    let targets = [],
        values = [],
        signatures = [],
        calldatas = [];
    for (let i = 0; i < actions.length; i++) {
        const action = actions[i];
        const {target, value, signature, calldata} = await arbProposeParams(
            //types,params,target,value,calldata
            action[0],
            action[1],
            action[2],
            action[3],
            action[4],
            excessFeeRefundAddress,
            callValueRefundAddress
        );
        targets.push(target);
        values.push(value);
        signatures.push(signature);
        calldatas.push(calldata);
    }
    const msg = `
    UIP001: Adapter and Decay Rate Parameter Changes
# Proposal
1. Raise the Pure Adapter floor to 100k
2. Set the Half_Decay_Point to 1,000,000 (One Million)
# Part1: Adapters
The goal with the adapters is to have as many tx's be drawn from the more gas efficient pure token adapter, while having the majority of undrawn funds earning interest in money markets.
# Part2: Comptroller
In order to increase the rate of decentralization and distribute voting power during this launch period, we are proposing increasing the Half_Decay_Point to 1 Million. Effectively doubling the rate of UNION per block.
    `;

    return {targets, values, signatures, calldatas, msg};
}

module.exports = main;
