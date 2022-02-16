const hre = require("hardhat");
const {ethers, network, getChainId} = hre;

const configs = require("../deployConfig.js");

const networks = {
    1: "mainnet",
    4: "rinkeby",
    42: "kovan",
    421611: "arbitrumRinkeby",
    31337: "hardhat"
};

const checkFileExist = path => {
    try {
        return require(path);
    } catch (error) {
        throw new Error("file not found");
    }
};

const setAaveAdapter = async (chainId, timelockAddress, admin, guardian) => {
    if (configs[chainId]["AaveAdapter"]) {
        const aaveAdapter = await ethers.getContract("AaveAdapter");
        if (guardian && (await aaveAdapter.pauseGuardian()) != guardian) {
            tx = await aaveAdapter.setGuardian(guardian);
            console.log("AaveAdapter setGuardian, tx is:", tx.hash);
        }
        if (!(await aaveAdapter.isAdmin(timelockAddress))) {
            tx = await aaveAdapter.addAdmin(timelockAddress);
            console.log("AaveAdapter addAdmin, tx is:", tx.hash);
        }
        if (admin && !(await aaveAdapter.isAdmin(admin))) {
            tx = await aaveAdapter.addAdmin(admin);
            console.log("AaveAdapter addAdmin, tx is:", tx.hash);
            tx = await aaveAdapter.renounceAdmin();
            console.log("AaveAdapter renounceAdmin, tx is:", tx.hash);
        }
    }
};

const setCompoundAdapter = async (chainId, timelockAddress, admin, guardian) => {
    if (configs[chainId]["CompoundAdapter"]) {
        const compoundAdapter = await ethers.getContract("CompoundAdapter");
        if (guardian && (await compoundAdapter.pauseGuardian()) != guardian) {
            tx = await compoundAdapter.setGuardian(guardian);
            console.log("CompoundAdapter setGuardian, tx is:", tx.hash);
        }
        if (!(await compoundAdapter.isAdmin(timelockAddress))) {
            tx = await compoundAdapter.addAdmin(timelockAddress);
            console.log("CompoundAdapter addAdmin, tx is:", tx.hash);
        }
        if (admin && !(await compoundAdapter.isAdmin(admin))) {
            tx = await compoundAdapter.addAdmin(admin);
            console.log("CompoundAdapter addAdmin, tx is:", tx.hash);
            tx = await compoundAdapter.renounceAdmin();
            console.log("CompoundAdapter renounceAdmin, tx is:", tx.hash);
        }
    }
};

const setPureTokenAdapter = async (chainId, timelockAddress, admin, guardian) => {
    const pureTokenAdapter = await ethers.getContract("PureTokenAdapter");
    if (guardian && (await pureTokenAdapter.pauseGuardian()) != guardian) {
        tx = await pureTokenAdapter.setGuardian(guardian);
        console.log("PureTokenAdapter setGuardian, tx is:", tx.hash);
    }
    if (!(await pureTokenAdapter.isAdmin(timelockAddress))) {
        tx = await pureTokenAdapter.addAdmin(timelockAddress);
        console.log("PureTokenAdapter addAdmin, tx is:", tx.hash);
    }
    if (admin && !(await pureTokenAdapter.isAdmin(admin))) {
        tx = await pureTokenAdapter.addAdmin(admin);
        console.log("PureTokenAdapter addAdmin, tx is:", tx.hash);
        tx = await pureTokenAdapter.renounceAdmin();
        console.log("PureTokenAdapter renounceAdmin, tx is:", tx.hash);
    }
};

const setComptroller = async (chainId, timelockAddress, admin, guardian) => {
    const comptroller = await ethers.getContract("Comptroller");
    if (guardian && (await comptroller.pauseGuardian()) != guardian) {
        tx = await comptroller.setGuardian(guardian);
        console.log("Comptroller setGuardian, tx is:", tx.hash);
    }
    if (!(await comptroller.isAdmin(timelockAddress))) {
        tx = await comptroller.addAdmin(timelockAddress);
        console.log("Comptroller addAdmin, tx is:", tx.hash);
    }
    if (admin && !(await comptroller.isAdmin(admin))) {
        tx = await comptroller.addAdmin(admin);
        console.log("Comptroller addAdmin, tx is:", tx.hash);
        tx = await comptroller.renounceAdmin();
        console.log("Comptroller renounceAdmin, tx is:", tx.hash);
    }
};

const setUnionToken = async (chainId, admin) => {
    if (network.name !== "arbitrumRinkeby") {
        const unionToken = await ethers.getContract("UnionToken");
        if ((await unionToken.owner()) != admin) {
            tx = await unionToken.transferOwnership(admin);
            console.log("UnionToken transferOwnership, tx is:", tx.hash);
        }
    }
};

const setFixedInterestRateModel = async (chainId, admin) => {
    const fixedInterestRateModel = await ethers.getContract("FixedInterestRateModel");
    if (admin && (await fixedInterestRateModel.owner()) != admin) {
        tx = await fixedInterestRateModel.transferOwnership(admin);
        console.log("FixedInterestRateModel transferOwnership, tx is:", tx.hash);
    }
};

const setSumOfTrust = async (chainId, admin) => {
    const sumOfTrust = await ethers.getContract("SumOfTrust");
    if (admin && (await sumOfTrust.owner()) != admin) {
        tx = await sumOfTrust.transferOwnership(admin);
        console.log("SumOfTrust transferOwnership, tx is:", tx.hash);
    }
};

const setTreasury = async (chainId, admin) => {
    if (network.name !== "arbitrumRinkeby") {
        const treasury = await ethers.getContract("Treasury");
        if (admin && (await treasury.admin()) != admin && (await treasury.newAdmin()) != admin) {
            tx = await treasury.changeAdmin(admin);
            console.log("Treasury changeAdmin, tx is:", tx.hash);
            //TODO: Also need to be called acceptAdmin by admin
        }
    }
};

const setAssetManager = async (chainId, timelockAddress, admin, guardian) => {
    const assetManager = await ethers.getContract("AssetManager");
    if (guardian && (await assetManager.pauseGuardian()) != guardian) {
        tx = await assetManager.setGuardian(guardian);
        console.log("AssetManager setGuardian, tx is:", tx.hash);
    }
    if (!(await assetManager.isAdmin(timelockAddress))) {
        tx = await assetManager.addAdmin(timelockAddress);
        console.log("AssetManager addAdmin, tx is:", tx.hash);
    }
    if (admin && !(await assetManager.isAdmin(admin))) {
        tx = await assetManager.addAdmin(admin);
        console.log("AssetManager addAdmin, tx is:", tx.hash);
        tx = await assetManager.renounceAdmin();
        console.log("AssetManager renounceAdmin, tx is:", tx.hash);
    }
};

const setMarketRegistry = async (chainId, timelockAddress, admin, guardian) => {
    const marketRegistry = await ethers.getContract("MarketRegistry");
    if (guardian && (await marketRegistry.pauseGuardian()) != guardian) {
        tx = await marketRegistry.setGuardian(guardian);
        console.log("MarketRegistry setGuardian, tx is:", tx.hash);
    }
    if (!(await marketRegistry.isAdmin(timelockAddress))) {
        tx = await marketRegistry.addAdmin(timelockAddress);
        console.log("MarketRegistry addAdmin, tx is:", tx.hash);
    }
    if (admin && !(await marketRegistry.isAdmin(admin))) {
        tx = await marketRegistry.addAdmin(admin);
        console.log("MarketRegistry addAdmin, tx is:", tx.hash);
        tx = await marketRegistry.renounceAdmin();
        console.log("MarketRegistry renounceAdmin, tx is:", tx.hash);
    }
};

const setUserManager = async (chainId, timelockAddress, admin, guardian) => {
    const userManager =
        network.name === "arbitrum" || network.name === "arbitrumRinkeby"
            ? await ethers.getContract("UserManagerArbi")
            : await ethers.getContract("UserManager");
    if (guardian && (await userManager.pauseGuardian()) != guardian) {
        tx = await userManager.setGuardian(guardian);
        console.log("UserManager setGuardian, tx is:", tx.hash);
    }
    if (!(await userManager.isAdmin(timelockAddress))) {
        tx = await userManager.addAdmin(timelockAddress);
        console.log("UserManager addAdmin, tx is:", tx.hash);
    }
    if (admin && !(await userManager.isAdmin(admin))) {
        tx = await userManager.addAdmin(admin);
        console.log("UserManager addAdmin, tx is:", tx.hash);
        tx = await userManager.renounceAdmin();
        console.log("UserManager renounceAdmin, tx is:", tx.hash);
    }
};

const setUToken = async (chainId, timelockAddress, admin, guardian) => {
    const uToken = await ethers.getContract("UDai");
    if (guardian && (await uToken.pauseGuardian()) != guardian) {
        tx = await uToken.setGuardian(guardian);
        console.log("UToken setGuardian, tx is:", tx.hash);
    }
    if (!(await uToken.isAdmin(timelockAddress))) {
        tx = await uToken.addAdmin(timelockAddress);
        console.log("UToken addAdmin, tx is:", tx.hash);
    }
    if (admin && !(await uToken.isAdmin(admin))) {
        tx = await uToken.addAdmin(admin);
        console.log("UToken addAdmin, tx is:", tx.hash);
        tx = await uToken.renounceAdmin();
        console.log("UToken renounceAdmin, tx is:", tx.hash);
    }
};

(async () => {
    const chainId = await getChainId();
    console.log(`Setting permissions for network ${network.name} ...`);
    const timelockAddress =
        network.name === "arbitrum" || network.name === "arbitrumRinkeby"
            ? configs[chainId]["Timelock"]
            : (await ethers.getContract("TimelockController")).address;
    console.log({timelockAddress});

    const admin = configs[chainId]["Admin"];
    const guardian = configs[chainId]["Guardian"];

    await setAaveAdapter(chainId, timelockAddress, admin, guardian);
    await setCompoundAdapter(chainId, timelockAddress, admin, guardian);
    await setPureTokenAdapter(chainId, timelockAddress, admin, guardian);
    await setComptroller(chainId, timelockAddress, admin, guardian);
    await setUnionToken(chainId, admin);
    await setFixedInterestRateModel(chainId, admin);
    await setSumOfTrust(chainId, admin);
    await setAssetManager(chainId, timelockAddress, admin, guardian);
    await setMarketRegistry(chainId, timelockAddress, admin, guardian);
    await setUserManager(chainId, timelockAddress, admin, guardian);
    await setUToken(chainId, timelockAddress, admin, guardian);
    await setTreasury(chainId, admin);
})();
