const hre = require("hardhat");
const {ethers, getChainId} = hre;
const getProposeParams = require("../proposes/mainnet/UIP001.js");

const checkFileExist = path => {
    try {
        return require(path);
    } catch (error) {
        throw new Error("file not found");
    }
};

const networks = {
    1: "mainnet",
    42: "kovan",
    31337: "hardhat"
};

(async () => {
    const chainId = await getChainId();

    const governorPath = `../deployments/${networks[chainId]}/UnionGovernor.json`;
    const governorParams = checkFileExist(governorPath);
    const governance = await ethers.getContractAt("UnionGovernor", governorParams.address);

    const {targets, values, calldatas, msg} = await getProposeParams();
    await governance["propose(address[],uint256[],bytes[],string)"](targets, values, calldatas, msg);
})();
