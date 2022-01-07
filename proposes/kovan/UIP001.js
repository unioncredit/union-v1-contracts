const {ethers} = require("hardhat");
const parseEther = ethers.utils.parseEther;

const daiAddress = "0x4f96fe3b7a6cf9725f59d353f723c1bdb64ca6aa";
const compoundAdapterAddress = "0xD3FfB854C11096e0d5EFD6Ba6d3c1BeF4B89add9";
const pureAdapterAddress = "0x48941f5Ad4E6b313cC691e088c7E241617C5a9B2";
const comptrollerAddress = "0x85FD0fA5Cc2f0B3A12C146C5B5A37d9e269b3Ba8";

const compoundCeil = parseEther("500000");
const pureFloor = parseEther("100000");
const halfDecayPoint = 1000000;

async function main() {
    const compoundAdapter = await ethers.getContractAt("CompoundAdapter", compoundAdapterAddress);
    const pureAdapter = await ethers.getContractAt("PureTokenAdapter", pureAdapterAddress);
    const comptroller = await ethers.getContractAt("Comptroller", comptrollerAddress);

    const targets = [compoundAdapterAddress, pureAdapterAddress, comptrollerAddress];
    const values = ["0", "0", "0"];
    const calldatas = [
        compoundAdapter.interface.encodeFunctionData("setCeiling(address,uint256)", [daiAddress, compoundCeil]),
        pureAdapter.interface.encodeFunctionData("setFloor(address,uint256)", [daiAddress, pureFloor]),
        comptroller.interface.encodeFunctionData("setHalfDecayPoint(uint256)", [halfDecayPoint])
    ];
    const msg = `
    UIP001: Adapter and Decay Rate Parameter Changes

# Proposal
1. Raise the Compound Adapter Ceiling to 500k
2. Raise the Pure Adapter floor to 100k
3. Set the Half_Decay_Point to 1,000,000 (One Million)

# Part1: Adapters

The goal with the adapters is to have as many tx's be drawn from the more gas efficient pure token adapter, while having the majority of undrawn funds earning interest in money markets.

# Part2: Comptroller

In order to increase the rate of decentralization and distribute voting power during this launch period, we are proposing increasing the Half_Decay_Point to 1 Million. Effectively doubling the rate of UNION per block.
    `;

    return {targets, values, calldatas, msg};
}

module.exports = main;
