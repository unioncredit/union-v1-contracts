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

const checkAssetManage = async chainId => {
    const path = `../deployments/${networks[chainId]}/AssetManager.json`;
    const params = checkFileExist(path);
    const assetManager = await ethers.getContractAt("AssetManager", params.address);

    const newSeq = configs[chainId]["AssetManager"]["newSeq"];
    for (let i = 0; i < newSeq.length; i++) {
        const seq = await assetManager.withdrawSeq(i);
        if (parseFloat(seq) !== parseFloat(newSeq[i])) {
            throw new Error("assetManager sequence set error");
        }
    }

    const DAI = configs[chainId]["DAI"];
    const isSupported = await assetManager.supportedMarkets(DAI);
    if (!isSupported) {
        throw new Error("assetManager DAI not add");
    }

    const marketRegistry = await assetManager.marketRegistry();
    const marketRegistryParams = checkFileExist(`../deployments/${networks[chainId]}/MarketRegistry.json`);
    if (marketRegistry.toLowerCase() != marketRegistryParams.address?.toLowerCase()) {
        throw new Error("AssetManager set marketRegistry error");
    }

    console.log("AssetManager success");
};

const checkPureTokenAdapter = async chainId => {
    const path = `../deployments/${networks[chainId]}/PureTokenAdapter.json`;
    const params = checkFileExist(path);
    const pureTokenAdapter = await ethers.getContractAt("PureTokenAdapter", params.address);

    const DAI = configs[chainId]["DAI"];
    const ceiling = await pureTokenAdapter.ceilingMap(DAI);
    if (parseFloat(ceiling) != parseFloat(configs[chainId]["PureTokenAdapter"]["pureTokenCeiling"])) {
        throw new Error("PureTokenAdapter setCeiling error");
    }

    const floor = await pureTokenAdapter.floorMap(DAI);
    if (parseFloat(floor) != parseFloat(configs[chainId]["PureTokenAdapter"]["pureTokenFloor"])) {
        throw new Error("PureTokenAdapter setFloor error");
    }

    const assetManager = await pureTokenAdapter.assetManager();
    const assetManagerParams = checkFileExist(`../deployments/${networks[chainId]}/AssetManager.json`);
    if (assetManager.toLowerCase() != assetManagerParams.address?.toLowerCase()) {
        throw new Error("PureTokenAdapter set assetManager error");
    }

    console.log("PureTokenAdapter success");
};

const checkCompoundAdapter = async chainId => {
    const path = `../deployments/${networks[chainId]}/CompoundAdapter.json`;
    const params = checkFileExist(path);
    const compoundAdapter = await ethers.getContractAt("CompoundAdapter", params.address);

    const DAI = configs[chainId]["DAI"];
    const ceiling = await compoundAdapter.ceilingMap(DAI);
    if (parseFloat(ceiling) != parseFloat(configs[chainId]["CompoundAdapter"]["compoundTokenCeiling"])) {
        throw new Error("CompoundAdapter setCeiling error");
    }

    const floor = await compoundAdapter.floorMap(DAI);
    if (parseFloat(floor) != parseFloat(configs[chainId]["CompoundAdapter"]["compoundTokenFloor"])) {
        throw new Error("CompoundAdapter setFloor error");
    }

    const cToken = await compoundAdapter.tokenToCToken(DAI);
    if (cToken.toLowerCase() != configs[chainId]["cDAI"]?.toLowerCase()) {
        throw new Error("CompoundAdapter setCToken error");
    }

    const assetManager = await compoundAdapter.assetManager();
    const assetManagerParams = checkFileExist(`../deployments/${networks[chainId]}/AssetManager.json`);
    if (assetManager.toLowerCase() != assetManagerParams.address?.toLowerCase()) {
        throw new Error("CompoundAdapter set assetManager error");
    }

    console.log("CompoundAdapter success");
};

const checkComptroller = async chainId => {
    const path = `../deployments/${networks[chainId]}/Comptroller.json`;
    const params = checkFileExist(path);
    const comptroller = await ethers.getContractAt("Comptroller", params.address);

    const unionToken = await comptroller.unionToken();
    const unionTokenParams = checkFileExist(`../deployments/${networks[chainId]}/UnionToken.json`);
    if (unionToken.toLowerCase() != unionTokenParams.address?.toLowerCase()) {
        throw new Error("Comptroller set unionToken error");
    }

    const marketRegistry = await comptroller.marketRegistry();
    const marketRegistryParams = checkFileExist(`../deployments/${networks[chainId]}/MarketRegistry.json`);
    if (marketRegistry.toLowerCase() != marketRegistryParams.address?.toLowerCase()) {
        throw new Error("Comptroller set marketRegistry error");
    }

    console.log("Comptroller success");
};

const checkFixedInterestRateModel = async chainId => {
    const path = `../deployments/${networks[chainId]}/FixedInterestRateModel.json`;
    const params = checkFileExist(path);
    const fixedInterestRateModel = await ethers.getContractAt("FixedInterestRateModel", params.address);
    const interestRatePerBlock = await fixedInterestRateModel.interestRatePerBlock();
    if (
        parseFloat(interestRatePerBlock) !=
        parseFloat(configs[chainId]["FixedInterestRateModel"]["interestRatePerBlock"])
    ) {
        throw new Error("FixedInterestRateModel set interestRatePerBlock error");
    }
    console.log("FixedInterestRateModel success");
};

const checkMarketRegistry = async chainId => {
    const path = `../deployments/${networks[chainId]}/MarketRegistry.json`;
    const params = checkFileExist(path);
    const marketRegistry = await ethers.getContractAt("MarketRegistry", params.address);

    const uTokenParams = checkFileExist(`../deployments/${networks[chainId]}/UToken.json`);
    const uTokens = await marketRegistry.getUTokens();
    let uTokenIsExist;
    for (let i = 0; i < uTokens.length; i++) {
        if (uTokens[i] === uTokenParams.address) {
            uTokenIsExist = true;
            break;
        }
    }
    if (!uTokenIsExist) {
        throw new Error("MarketRegistry set uToken error");
    }

    const userManagerParams = checkFileExist(`../deployments/${networks[chainId]}/UserManager.json`);
    const userManagerList = await marketRegistry.getUserManagers();
    let userManagerIsExist;
    for (let i = 0; i < userManagerList.length; i++) {
        if (userManagerList[i] === userManagerParams.address) {
            userManagerIsExist = true;
            break;
        }
    }
    if (!userManagerIsExist) {
        throw new Error("MarketRegistry set userManager error");
    }

    console.log("MarketRegistry success");
};

const checkSumOfTrust = async chainId => {
    const path = `../deployments/${networks[chainId]}/SumOfTrust.json`;
    const params = checkFileExist(path);
    const sumOfTrust = await ethers.getContractAt("SumOfTrust", params.address);
    const effectiveNumber = await sumOfTrust.effectiveNumber();
    if (parseFloat(effectiveNumber) != parseFloat(configs[chainId]["SumOfTrust"]["effectiveNumber"])) {
        throw new Error("SumOfTrust set effectiveNumber error");
    }

    console.log("SumOfTrust success");
};

const checkTimelock = async chainId => {
    const path = `../deployments/${networks[chainId]}/TimelockController.json`;
    const params = checkFileExist(path);
    const timelock = await ethers.getContractAt("TimelockController", params.address);
    const minDelay = await timelock.getMinDelay();
    if (parseFloat(minDelay) != parseFloat(configs[chainId]["TimelockController"]["minDelay"])) {
        throw new Error("Timelock set minDelay error");
    }
    const governorParams = checkFileExist(`../deployments/${networks[chainId]}/UnionGovernor.json`);
    const isAdmin = await timelock.hasRole(ethers.utils.id("TIMELOCK_ADMIN_ROLE"), governorParams.address);
    if (!isAdmin) {
        throw new Error("Timelock set admin error");
    }
    const isProposer = await timelock.hasRole(ethers.utils.id("PROPOSER_ROLE"), governorParams.address);
    if (!isProposer) {
        throw new Error("Timelock set proposer error");
    }

    console.log("Timelock success");
};

const checkTreasury = async chainId => {
    const path = `../deployments/${networks[chainId]}/Treasury.json`;
    const params = checkFileExist(path);
    const treasury = await ethers.getContractAt("Treasury", params.address);
    const unionToken = await treasury.token();
    const unionTokenParams = checkFileExist(`../deployments/${networks[chainId]}/UnionToken.json`);
    if (unionToken.toLowerCase() != unionTokenParams.address?.toLowerCase()) {
        throw new Error("Treasury set unionToken error");
    }

    const comptrollerParams = checkFileExist(`../deployments/${networks[chainId]}/Comptroller.json`);
    const schedule = await treasury.tokenSchedules(comptrollerParams.address);
    if (
        parseFloat(schedule.dripStart) != parseFloat(configs[chainId]["Treasury"]["dripStart"]) &&
        parseFloat(schedule.dripRate) != parseFloat(configs[chainId]["Treasury"]["dripRate"]) &&
        parseFloat(schedule.dripAmount) != parseFloat(configs[chainId]["Treasury"]["dripAmount"])
    ) {
        throw new Error("Treasury set data error");
    }

    console.log("Treasury success");
};

const checkTreasuryVester = async chainId => {
    const path = `../deployments/${networks[chainId]}/TreasuryVester.json`;
    const params = checkFileExist(path);
    const treasuryVester = await ethers.getContractAt("TreasuryVester", params.address);
    const unionToken = await treasuryVester.unionToken();
    const recipient = await treasuryVester.recipient();
    const vestingAmount = await treasuryVester.vestingAmount();
    const vestingBegin = await treasuryVester.vestingBegin();
    const vestingCliff = await treasuryVester.vestingCliff();
    const vestingEnd = await treasuryVester.vestingEnd();
    const data = configs[chainId]["TreasuryVester"];
    const unionTokenParams = checkFileExist(`../deployments/${networks[chainId]}/UnionToken.json`);
    const treasuryParams = checkFileExist(`../deployments/${networks[chainId]}/Treasury.json`);
    if (unionToken.toLowerCase() != unionTokenParams.address?.toLowerCase()) {
        throw new Error("TreasuryVester set unionToken error");
    }
    if (recipient.toLowerCase() != treasuryParams.address?.toLowerCase()) {
        throw new Error("TreasuryVester set treasury error");
    }
    if (parseFloat(vestingAmount) != parseFloat(data.vestingAmount)) {
        throw new Error("TreasuryVester set vestingAmount error");
    }
    if (parseFloat(vestingBegin) != parseFloat(data.vestingBegin)) {
        throw new Error("TreasuryVester set vestingBegin error");
    }
    if (parseFloat(vestingCliff) != parseFloat(data.vestingCliff)) {
        throw new Error("TreasuryVester set vestingCliff error");
    }
    if (parseFloat(vestingEnd) != parseFloat(data.vestingEnd)) {
        throw new Error("TreasuryVester set vestingEnd error");
    }

    console.log("TreasuryVester success");
};

const checkUErc20 = async chainId => {
    const path = `../deployments/${networks[chainId]}/UErc20.json`;
    const params = checkFileExist(path);
    const uErc20 = await ethers.getContractAt("UErc20", params.address);
    const name = await uErc20.name();
    if (name != configs[chainId]["UErc20"]["name"]) {
        throw new Error("UErc20 set name error");
    }
    const symbol = await uErc20.symbol();
    if (symbol != configs[chainId]["UErc20"]["symbol"]) {
        throw new Error("UErc20 set name error");
    }
    const owner = await uErc20.owner();
    const uTokenParams = checkFileExist(`../deployments/${networks[chainId]}/UToken.json`);
    if (owner.toLowerCase() != uTokenParams.address?.toLowerCase()) {
        throw new Error("UErc20 set owner error");
    }

    console.log("UErc20 success");
};

const checkUnionToken = async chainId => {
    const path = `../deployments/${networks[chainId]}/UnionToken.json`;
    const params = checkFileExist(path);
    const unionToken = await ethers.getContractAt("UnionToken", params.address);
    const name = await unionToken.name();
    if (name != configs[chainId]["UnionToken"]["name"]) {
        throw new Error("UnionToken set name error");
    }
    const symbol = await unionToken.symbol();
    if (symbol != configs[chainId]["UnionToken"]["symbol"]) {
        throw new Error("UnionToken set name error");
    }
    const mintingAllowedAfter = await unionToken.mintingAllowedAfter();
    if (parseFloat(mintingAllowedAfter) != parseFloat(configs[chainId]["UnionToken"]["mintingAllowedAfter"])) {
        throw new Error("UnionToken set mintingAllowedAfter error");
    }

    console.log("UnionToken success");
};

const checkUserManager = async chainId => {
    const path = `../deployments/${networks[chainId]}/UserManager.json`;
    const params = checkFileExist(path);
    const userManager = await ethers.getContractAt("UserManager", params.address);
    const assetManagerParams = checkFileExist(`../deployments/${networks[chainId]}/AssetManager.json`);
    const assetManager = await userManager.assetManager();
    if (assetManager.toLowerCase() != assetManagerParams.address?.toLowerCase()) {
        throw new Error("UserManager set assetManager error");
    }
    const unionTokenParams = checkFileExist(`../deployments/${networks[chainId]}/UnionToken.json`);
    const unionToken = await userManager.unionToken();
    if (unionToken.toLowerCase() != unionTokenParams.address?.toLowerCase()) {
        throw new Error("UserManager set unionToken error");
    }
    const creditLimitModelParams = checkFileExist(`../deployments/${networks[chainId]}/SumOfTrust.json`);
    const creditLimitModel = await userManager.creditLimitModel();
    if (creditLimitModel.toLowerCase() != creditLimitModelParams.address?.toLowerCase()) {
        throw new Error("UserManager set sumOfTrust error");
    }
    const comptrollerParams = checkFileExist(`../deployments/${networks[chainId]}/Comptroller.json`);
    const comptroller = await userManager.comptroller();
    if (comptroller.toLowerCase() != comptrollerParams.address?.toLowerCase()) {
        throw new Error("UserManager set comptroller error");
    }
    const uTokenParams = checkFileExist(`../deployments/${networks[chainId]}/UToken.json`);
    const uToken = await userManager.uToken();
    if (uToken.toLowerCase() != uTokenParams.address?.toLowerCase()) {
        throw new Error("UserManager set uToken error");
    }
    console.log("UserManager success");
};

const checkUToken = async chainId => {
    const path = `../deployments/${networks[chainId]}/UToken.json`;
    const params = checkFileExist(path);
    const uToken = await ethers.getContractAt("UToken", params.address);
    const data = configs[chainId]["UToken"];
    const uErc20 = await uToken.uErc20();
    const uErc20Params = checkFileExist(`../deployments/${networks[chainId]}/UErc20.json`);
    if (uErc20.toLowerCase() != uErc20Params.address.toLowerCase()) {
        throw new Error("UToken set uErc20 error");
    }
    const underlying = await uToken.underlying();
    if (underlying.toLowerCase() != configs[chainId]["DAI"].toLowerCase()) {
        throw new Error("UToken set underlying error");
    }
    const reserveFactorMantissa = await uToken.reserveFactorMantissa();
    if (parseFloat(reserveFactorMantissa) != parseFloat(data.reserveFactorMantissa)) {
        throw new Error("UToken set reserveFactorMantissa error");
    }
    const originationFee = await uToken.originationFee();
    if (parseFloat(originationFee) != parseFloat(data.originationFee)) {
        throw new Error("UToken set originationFee error");
    }
    const debtCeiling = await uToken.debtCeiling();
    if (parseFloat(debtCeiling) != parseFloat(data.debtCeiling)) {
        throw new Error("UToken set debtCeiling error");
    }
    const maxBorrow = await uToken.maxBorrow();
    if (parseFloat(maxBorrow) != parseFloat(data.maxBorrow)) {
        throw new Error("UToken set maxBorrow error");
    }
    const minBorrow = await uToken.minBorrow();
    if (parseFloat(minBorrow) != parseFloat(data.minBorrow)) {
        throw new Error("UToken set minBorrow error");
    }
    const overdueBlocks = await uToken.overdueBlocks();
    if (parseFloat(overdueBlocks) != parseFloat(data.overdueBlocks)) {
        throw new Error("UToken set overdueBlocks error");
    }
    const assetManager = await uToken.assetManager();
    const assetManagerParams = checkFileExist(`../deployments/${networks[chainId]}/AssetManager.json`);
    if (assetManager.toLowerCase() != assetManagerParams.address.toLowerCase()) {
        throw new Error("UToken set assetManager error");
    }
    const userManager = await uToken.userManager();
    const userManagerParams = checkFileExist(`../deployments/${networks[chainId]}/UserManager.json`);
    if (userManager.toLowerCase() != userManagerParams.address.toLowerCase()) {
        throw new Error("UToken set userManager error");
    }
    const interestRateModel = await uToken.interestRateModel();
    const interestRateModelParams = checkFileExist(`../deployments/${networks[chainId]}/FixedInterestRateModel.json`);
    if (interestRateModel.toLowerCase() != interestRateModelParams.address.toLowerCase()) {
        throw new Error("UToken set interestRateModel error");
    }

    console.log("UToken success");
};

(async () => {
    const chainId = await getChainId();
    await checkAssetManage(chainId);
    await checkPureTokenAdapter(chainId);
    await checkCompoundAdapter(chainId);
    await checkComptroller(chainId);
    await checkFixedInterestRateModel(chainId);
    await checkMarketRegistry(chainId);
    await checkSumOfTrust(chainId);
    await checkTimelock(chainId);
    await checkTreasury(chainId);
    await checkTreasuryVester(chainId);
    await checkUErc20(chainId);
    await checkUnionToken(chainId);
    await checkUserManager(chainId);
    await checkUToken(chainId);
})();
