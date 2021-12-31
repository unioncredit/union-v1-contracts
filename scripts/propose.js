const hre = require("hardhat");
const {ethers, getChainId} = hre;

const propose_id = "UIP001";

const networks = {
    1: "mainnet",
    42: "kovan",
    31337: "hardhat"
};

const checkFileExist = path => {
    try {
        return require(path);
    } catch (error) {
        throw new Error("file not found");
    }
};

(async () => {
    const chainId = await getChainId();
    const getProposeParams = checkFileExist(`../proposes/${networks[chainId]}/${propose_id}.js`);

    const governorPath = `../deployments/${networks[chainId]}/UnionGovernor.json`;
    const governorParams = checkFileExist(governorPath);
    const governance = await ethers.getContractAt("UnionGovernor", governorParams.address);

    const {targets, values, calldatas, msg} = await getProposeParams();
    await governance["propose(address[],uint256[],bytes[],string)"](targets, values, calldatas, msg);
})();
