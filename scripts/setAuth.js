const hre = require("hardhat");
const {ethers, getChainId} = hre;

const configs = require("../deployConfig.js");

const networks = {
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

const setAaveAdapter = async (chainId, timelockAddress, admin, guardian) => {
    if (configs[chainId]["AaveAdapter"]) {
        const aaveAdapterPath = `../deployments/${networks[chainId]}/AaveAdapter.json`;
        const aaveAdapterParams = checkFileExist(aaveAdapterPath);
        const aaveAdapter = await ethers.getContractAt("AaveAdapter", aaveAdapterParams.address);
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
        const compoundAdapterPath = `../deployments/${networks[chainId]}/CompoundAdapter.json`;
        const compoundAdapterParams = checkFileExist(compoundAdapterPath);
        const compoundAdapter = await ethers.getContractAt("CompoundAdapter", compoundAdapterParams.address);
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
    const pureTokenAdapterPath = `../deployments/${networks[chainId]}/PureTokenAdapter.json`;
    const pureTokenAdapterParams = checkFileExist(pureTokenAdapterPath);
    const pureTokenAdapter = await ethers.getContractAt("PureTokenAdapter", pureTokenAdapterParams.address);
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
    const comptrollerPath = `../deployments/${networks[chainId]}/Comptroller.json`;
    const comptrollerParams = checkFileExist(comptrollerPath);
    const comptroller = await ethers.getContractAt("Comptroller", comptrollerParams.address);
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

const setUnionToken = async (chainId, timelockAddress) => {
    const unionTokenPath = `../deployments/${networks[chainId]}/UnionToken.json`;
    const unionTokenParams = checkFileExist(unionTokenPath);
    const unionToken = await ethers.getContractAt("UnionToken", unionTokenParams.address);
    if ((await unionToken.owner()) != timelockAddress) {
        tx = await unionToken.transferOwnership(timelockAddress);
        console.log("UnionToken transferOwnership, tx is:", tx.hash);
    }
};

const setFixedInterestRateModel = async (chainId, admin) => {
    const fixedInterestRateModelPath = `../deployments/${networks[chainId]}/FixedInterestRateModel.json`;
    const fixedInterestRateModelParams = checkFileExist(fixedInterestRateModelPath);
    const fixedInterestRateModel = await ethers.getContractAt(
        "FixedInterestRateModel",
        fixedInterestRateModelParams.address
    );
    if (admin && (await fixedInterestRateModel.owner()) != admin) {
        tx = await fixedInterestRateModel.transferOwnership(admin);
        console.log("FixedInterestRateModel transferOwnership, tx is:", tx.hash);
    }
};

const setSumOfTrust = async (chainId, admin) => {
    const sumOfTrustPath = `../deployments/${networks[chainId]}/SumOfTrust.json`;
    const sumOfTrustParams = checkFileExist(sumOfTrustPath);
    const sumOfTrust = await ethers.getContractAt("SumOfTrust", sumOfTrustParams.address);
    if (admin && (await sumOfTrust.owner()) != admin) {
        tx = await sumOfTrust.transferOwnership(admin);
        console.log("SumOfTrust transferOwnership, tx is:", tx.hash);
    }
};

const setTreasury = async (chainId, admin) => {
    const treasuryPath = `../deployments/${networks[chainId]}/Treasury.json`;
    const treasuryParams = checkFileExist(treasuryPath);
    const treasury = await ethers.getContractAt("Treasury", treasuryParams.address);
    if (admin && (await treasury.admin()) != admin && (await treasury.newAdmin()) != admin) {
        tx = await treasury.changeAdmin(admin);
        console.log("Treasury changeAdmin, tx is:", tx.hash);
        //TODO: Also need to be called acceptAdmin by admin
    }
};

const setAssetManager = async (chainId, timelockAddress, admin, guardian) => {
    const assetManagerPath = `../deployments/${networks[chainId]}/AssetManager.json`;
    const assetManagerParams = checkFileExist(assetManagerPath);
    const assetManager = await ethers.getContractAt("AssetManager", assetManagerParams.address);
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
    const marketRegistryPath = `../deployments/${networks[chainId]}/MarketRegistry.json`;
    const marketRegistryParams = checkFileExist(marketRegistryPath);
    const marketRegistry = await ethers.getContractAt("MarketRegistry", marketRegistryParams.address);
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
    const userManagerPath = `../deployments/${networks[chainId]}/UserManager.json`;
    const userManagerParams = checkFileExist(userManagerPath);
    const userManager = await ethers.getContractAt("UserManager", userManagerParams.address);
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
    const uTokenPath = `../deployments/${networks[chainId]}/UDai.json`;
    const uTokenParams = checkFileExist(uTokenPath);
    const uToken = await ethers.getContractAt("UToken", uTokenParams.address);
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
    const timelockPath = `../deployments/${networks[chainId]}/TimelockController.json`;
    const timelockParams = checkFileExist(timelockPath);
    const timelockAddress = timelockParams.address;
    const admin = configs[chainId]["Admin"];
    const guardian = configs[chainId]["Guardian"];

    await setAaveAdapter(chainId, timelockAddress, admin, guardian);
    await setCompoundAdapter(chainId, timelockAddress, admin, guardian);
    await setPureTokenAdapter(chainId, timelockAddress, admin, guardian);
    await setComptroller(chainId, timelockAddress, admin, guardian);
    await setUnionToken(chainId, timelockAddress);
    await setFixedInterestRateModel(chainId, admin);
    await setSumOfTrust(chainId, admin);
    await setTreasury(chainId, admin);
    await setAssetManager(chainId, timelockAddress, admin, guardian);
    await setMarketRegistry(chainId, timelockAddress, admin, guardian);
    await setUserManager(chainId, timelockAddress, admin, guardian);
    await setUToken(chainId, timelockAddress, admin, guardian);
})();
