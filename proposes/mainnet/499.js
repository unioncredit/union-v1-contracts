const {ethers} = require("hardhat");
const parseEther = ethers.utils.parseEther;

const daiAddress = "0x6b175474e89094c44da98b954eedeac495271d0f";
const aaveAdapterAddress = "0xE8c77A541c933Aa1320Aa2f89a61f91130e4012d";
const compoundAdapterAddress = "0x303CbdADF370F6bBa79651f680498E829cB860D5";
const pureAdapterAddress = "0x62DD06026F5f8e874eEfF362b1280CD9A2057b7d";
const comptrollerAddress = "0x216dE4089dCdD7B95BC34BdCe809669C788a9A5d";

const aaveCeil = parseEther("500000");
const compoundCeil = parseEther("500000");
const pureFloor = parseEther("100000");
const halfDecayPoint = 1000000;

async function main() {
    const aaveAdapter = await ethers.getContractAt("AaveAdapter", aaveAdapterAddress);
    const compoundAdapter = await ethers.getContractAt("CompoundAdapter", compoundAdapterAddress);
    const pureAdapter = await ethers.getContractAt("PureTokenAdapter", pureAdapterAddress);
    const comptroller = await ethers.getContractAt("Comptroller", comptrollerAddress);

    const targets = [aaveAdapterAddress, compoundAdapterAddress, pureAdapterAddress, comptrollerAddress];
    const values = ["0", "0", "0", "0"];
    const calldatas = [
        aaveAdapter.interface.encodeFunctionData("setCeiling(address,uint256)", [daiAddress, aaveCeil]),
        compoundAdapter.interface.encodeFunctionData("setCeiling(address,uint256)", [daiAddress, compoundCeil]),
        pureAdapter.interface.encodeFunctionData("setFloor(address,uint256)", [daiAddress, pureFloor]),
        comptroller.interface.encodeFunctionData("setHalfDecayPoint(uint256)", [halfDecayPoint])
    ];
    const msg = "adapter and decay rate parameter changes";

    return {targets, values, calldatas, msg};
}

module.exports = main;
