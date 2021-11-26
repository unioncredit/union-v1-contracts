const hre = require("hardhat");
const {ethers, getChainId} = hre;

const configs = require("../deployConfig.json");

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

(async () => {
    const chainId = await getChainId();
    const timelockPath = `../deployments/${networks[chainId]}/TimelockController.json`;
    const timelockParams = checkFileExist(timelockPath);
    const timelockAddress = timelockParams.address;
    const guardian = configs[chainId]["Guardian"];
    const admin = configs[chainId]["Admin"];

    if (configs[chainId]["AaveAdapter"]) {
        const aaveAdapterPath = `../deployments/${networks[chainId]}/AaveAdapter.json`;
        const aaveAdapterParams = checkFileExist(aaveAdapterPath);
        const aaveAdapter = await ethers.getContractAt("AaveAdapter", aaveAdapterParams.address);
        tx = await aaveAdapter.addAdmin(timelockAddress);
        console.log("AaveAdapter addAdmin, tx is:", tx.hash);
        tx = await aaveAdapter.addAdmin(admin);
        console.log("AaveAdapter addAdmin, tx is:", tx.hash);
        tx = await aaveAdapter.setGuardian(guardian);
        console.log("AaveAdapter setGuardian, tx is:", tx.hash);
        tx = await aaveAdapter.renounceAdmin();
        console.log("AaveAdapter renounceAdmin, tx is:", tx.hash);
    }

    if (configs[chainId]["CompoundAdapter"]) {
        const compoundAdapterPath = `../deployments/${networks[chainId]}/CompoundAdapter.json`;
        const compoundAdapterParams = checkFileExist(compoundAdapterPath);
        const compoundAdapter = await ethers.getContractAt("CompoundAdapter", compoundAdapterParams.address);
        tx = await compoundAdapter.addAdmin(timelockAddress);
        console.log("CompoundAdapter addAdmin, tx is:", tx.hash);
        tx = await compoundAdapter.addAdmin(admin);
        console.log("CompoundAdapter addAdmin, tx is:", tx.hash);
        tx = await compoundAdapter.setGuardian(guardian);
        console.log("CompoundAdapter setGuardian, tx is:", tx.hash);
        tx = await compoundAdapter.renounceAdmin();
        console.log("CompoundAdapter renounceAdmin, tx is:", tx.hash);
    }

    const pureTokenAdapterPath = `../deployments/${networks[chainId]}/PureTokenAdapter.json`;
    const pureTokenAdapterParams = checkFileExist(pureTokenAdapterPath);
    const pureTokenAdapter = await ethers.getContractAt("PureTokenAdapter", pureTokenAdapterParams.address);
    tx = await pureTokenAdapter.addAdmin(timelockAddress);
    console.log("PureTokenAdapter addAdmin, tx is:", tx.hash);
    tx = await pureTokenAdapter.addAdmin(admin);
    console.log("PureTokenAdapter addAdmin, tx is:", tx.hash);
    tx = await pureTokenAdapter.setGuardian(guardian);
    console.log("PureTokenAdapter setGuardian, tx is:", tx.hash);
    tx = await pureTokenAdapter.renounceAdmin();
    console.log("PureTokenAdapter renounceAdmin, tx is:", tx.hash);

    const comptrollerPath = `../deployments/${networks[chainId]}/Comptroller.json`;
    const comptrollerParams = checkFileExist(comptrollerPath);
    const comptroller = await ethers.getContractAt("PureTokenAdapter", comptrollerParams.address);
    tx = await comptroller.addAdmin(timelockAddress);
    console.log("Comptroller addAdmin, tx is:", tx.hash);
    tx = await comptroller.addAdmin(admin);
    console.log("Comptroller addAdmin, tx is:", tx.hash);
    tx = await comptroller.setGuardian(guardian);
    console.log("Comptroller setGuardian, tx is:", tx.hash);
    tx = await comptroller.renounceAdmin();
    console.log("Comptroller renounceAdmin, tx is:", tx.hash);

    const unionTokenPath = `../deployments/${networks[chainId]}/UnionToken.json`;
    const unionTokenParams = checkFileExist(unionTokenPath);
    const unionToken = await ethers.getContractAt("UnionToken", unionTokenParams.address);
    tx = await unionToken.transferOwnership(timelockAddress);

    const assetManagerPath = `../deployments/${networks[chainId]}/AssetManager.json`;
    const assetManagerParams = checkFileExist(assetManagerPath);
    const assetManager = await ethers.getContractAt("AssetManager", assetManagerParams.address);
    tx = await assetManager.addAdmin(timelockAddress);
    console.log("AssetManager addAdmin, tx is:", tx.hash);
    tx = await assetManager.addAdmin(admin);
    console.log("AssetManager addAdmin, tx is:", tx.hash);
    tx = await assetManager.setGuardian(guardian);
    console.log("AssetManager setGuardian, tx is:", tx.hash);
    tx = await assetManager.renounceAdmin();
    console.log("AssetManager renounceAdmin, tx is:", tx.hash);

    const marketRegistryPath = `../deployments/${networks[chainId]}/MarketRegistry.json`;
    const marketRegistryParams = checkFileExist(marketRegistryPath);
    const marketRegistry = await ethers.getContractAt("MarketRegistry", marketRegistryParams.address);
    tx = await marketRegistry.addAdmin(timelockAddress);
    console.log("MarketRegistry addAdmin, tx is:", tx.hash);
    tx = await marketRegistry.addAdmin(admin);
    console.log("MarketRegistry addAdmin, tx is:", tx.hash);
    tx = await marketRegistry.setGuardian(guardian);
    console.log("MarketRegistry setGuardian, tx is:", tx.hash);
    tx = await marketRegistry.renounceAdmin();
    console.log("MarketRegistry renounceAdmin, tx is:", tx.hash);

    const userManagerPath = `../deployments/${networks[chainId]}/UserManager.json`;
    const userManagerParams = checkFileExist(userManagerPath);
    const userManager = await ethers.getContractAt("UserManager", userManagerParams.address);
    tx = await userManager.addAdmin(timelockAddress);
    console.log("UserManager addAdmin, tx is:", tx.hash);
    tx = await userManager.addAdmin(admin);
    console.log("UserManager addAdmin, tx is:", tx.hash);
    tx = await userManager.setGuardian(guardian);
    console.log("UserManager setGuardian, tx is:", tx.hash);
    tx = await userManager.renounceAdmin();
    console.log("UserManager renounceAdmin, tx is:", tx.hash);

    const uTokenPath = `../deployments/${networks[chainId]}/UToken.json`;
    const uTokenParams = checkFileExist(uTokenPath);
    const uToken = await ethers.getContractAt("UToken", uTokenParams.address);
    tx = await uToken.addAdmin(timelockAddress);
    console.log("UToken addAdmin, tx is:", tx.hash);
    tx = await uToken.addAdmin(admin);
    console.log("UToken addAdmin, tx is:", tx.hash);
    tx = await uToken.setGuardian(guardian);
    console.log("UToken setGuardian, tx is:", tx.hash);
    tx = await uToken.renounceAdmin();
    console.log("UToken renounceAdmin, tx is:", tx.hash);
})();
