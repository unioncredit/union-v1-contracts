const hre = require("hardhat");
const {ethers, getChainId} = hre;

const configs = require("../deployConfig.js");

const networks = {
    1: "mainnet",
    4: "rinkeby",
    42: "kovan",
    31337: "hardhat",
    421611: "arbitrumRinkeby"
};

const checkFileExist = path => {
    try {
        return require(path);
    } catch (error) {
        throw new Error("file not found");
    }
};

const checkAssetManager = async chainId => {
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

    let DAI;
    if (chainId != 31337) {
        DAI = configs[chainId]["DAI"];
    } else {
        const erc20 = checkFileExist(`../deployments/${networks[chainId]}/FaucetERC20.json`);
        DAI = erc20.address;
    }
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

    let DAI;
    if (chainId != 31337) {
        DAI = configs[chainId]["DAI"];
    } else {
        const erc20 = checkFileExist(`../deployments/${networks[chainId]}/FaucetERC20.json`);
        DAI = erc20.address;
    }
    const ceiling = await pureTokenAdapter.ceilingMap(DAI);
    if (parseFloat(ceiling) != parseFloat(configs[chainId]["PureTokenAdapter"]["ceiling"])) {
        throw new Error("PureTokenAdapter setCeiling error");
    }

    const floor = await pureTokenAdapter.floorMap(DAI);
    if (parseFloat(floor) != parseFloat(configs[chainId]["PureTokenAdapter"]["floor"])) {
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

    let DAI;
    if (chainId != 31337) {
        DAI = configs[chainId]["DAI"];
    } else {
        const erc20 = checkFileExist(`../deployments/${networks[chainId]}/FaucetERC20.json`);
        DAI = erc20.address;
    }
    const ceiling = await compoundAdapter.ceilingMap(DAI);
    if (parseFloat(ceiling) != parseFloat(configs[chainId]["CompoundAdapter"]["ceiling"])) {
        throw new Error("CompoundAdapter setCeiling error");
    }

    const floor = await compoundAdapter.floorMap(DAI);
    if (parseFloat(floor) != parseFloat(configs[chainId]["CompoundAdapter"]["floor"])) {
        throw new Error("CompoundAdapter setFloor error");
    }

    const cToken = await compoundAdapter.tokenToCToken(DAI);
    if (cToken.toLowerCase() != configs[chainId]["CompoundAdapter"]["cDAI"]?.toLowerCase()) {
        throw new Error("CompoundAdapter setCToken error");
    }

    const assetManager = await compoundAdapter.assetManager();
    const assetManagerParams = checkFileExist(`../deployments/${networks[chainId]}/AssetManager.json`);
    if (assetManager.toLowerCase() != assetManagerParams.address?.toLowerCase()) {
        throw new Error("CompoundAdapter set assetManager error");
    }

    console.log("CompoundAdapter success");
};

const checkAaveAdapter = async chainId => {
    const path = `../deployments/${networks[chainId]}/AaveAdapter.json`;
    const params = checkFileExist(path);
    const aaveAdapter = await ethers.getContractAt("AaveAdapter", params.address);

    let DAI;
    if (chainId != 31337) {
        DAI = configs[chainId]["DAI"];
    } else {
        const erc20 = checkFileExist(`../deployments/${networks[chainId]}/FaucetERC20.json`);
        DAI = erc20.address;
    }
    const ceiling = await aaveAdapter.ceilingMap(DAI);
    if (parseFloat(ceiling) != parseFloat(configs[chainId]["AaveAdapter"]["ceiling"])) {
        throw new Error("AaveAdapter setCeiling error");
    }

    const floor = await aaveAdapter.floorMap(DAI);
    if (parseFloat(floor) != parseFloat(configs[chainId]["AaveAdapter"]["floor"])) {
        throw new Error("AaveAdapter setFloor error");
    }

    const aToken = await aaveAdapter.tokenToAToken(DAI);
    if (aToken.toLowerCase() != configs[chainId]["AaveAdapter"]["aDAI"]?.toLowerCase()) {
        throw new Error("AaveAdapter setCToken error");
    }

    const assetManager = await aaveAdapter.assetManager();
    const assetManagerParams = checkFileExist(`../deployments/${networks[chainId]}/AssetManager.json`);
    if (assetManager.toLowerCase() != assetManagerParams.address?.toLowerCase()) {
        throw new Error("AaveAdapter set assetManager error");
    }

    console.log("AaveAdapter success");
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

    const uTokenParams = checkFileExist(`../deployments/${networks[chainId]}/UDai.json`);
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
        throw new Error("Timelock set governor error");
    }

    const admin = configs[chainId]["Admin"];
    if (admin && !(await timelock.hasRole(ethers.utils.id("TIMELOCK_ADMIN_ROLE"), admin))) {
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
        configs[chainId]["Treasury"]["dripStart"] &&
        parseFloat(schedule.dripStart) != parseFloat(configs[chainId]["Treasury"]["dripStart"])
    ) {
        throw new Error("Treasury set dripStart error");
    }
    if (
        parseFloat(schedule.dripRate) != parseFloat(configs[chainId]["Treasury"]["dripRate"]) &&
        parseFloat(schedule.dripAmount) != parseFloat(configs[chainId]["Treasury"]["dripAmount"])
    ) {
        throw new Error("Treasury set dripRate or dripAmount error");
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
    const uTokenParams = checkFileExist(`../deployments/${networks[chainId]}/UDai.json`);
    const uToken = await userManager.uToken();
    if (uToken.toLowerCase() != uTokenParams.address?.toLowerCase()) {
        throw new Error("UserManager set uToken error");
    }
    const maxStakeAmount = await userManager.maxStakeAmount();
    if (maxStakeAmount.toString() != configs[chainId]["UserManager"]["maxStakeAmount"]) {
        throw new Error("UserManager set maxStakeAmount error");
    }
    const newMemberFee = await userManager.newMemberFee();
    if (newMemberFee.toString() != configs[chainId]["UserManager"]["newMemberFee"]) {
        throw new Error("UserManager new member fee error");
    }
    console.log("UserManager success");
};

const checkUToken = async chainId => {
    const path = `../deployments/${networks[chainId]}/UDai.json`;
    const params = checkFileExist(path);
    const uToken = await ethers.getContractAt("UDai", params.address);
    const data = configs[chainId]["UDai"];

    const name = await uToken.name();
    if (name != configs[chainId]["UDai"]["name"]) {
        throw new Error("UDai set name error");
    }
    const symbol = await uToken.symbol();
    if (symbol != configs[chainId]["UDai"]["symbol"]) {
        throw new Error("UDai set name error");
    }
    const underlying = await uToken.underlying();
    if (chainId != 31337) {
        if (underlying.toLowerCase() != configs[chainId]["DAI"].toLowerCase()) {
            throw new Error("UDai set underlying error");
        }
    }
    const reserveFactorMantissa = await uToken.reserveFactorMantissa();
    if (parseFloat(reserveFactorMantissa) != parseFloat(data.reserveFactorMantissa)) {
        throw new Error("UDai set reserveFactorMantissa error");
    }
    const originationFee = await uToken.originationFee();
    if (parseFloat(originationFee) != parseFloat(data.originationFee)) {
        throw new Error("UDai set originationFee error");
    }
    const debtCeiling = await uToken.debtCeiling();
    if (parseFloat(debtCeiling) != parseFloat(data.debtCeiling)) {
        throw new Error("UDai set debtCeiling error");
    }
    const maxBorrow = await uToken.maxBorrow();
    if (parseFloat(maxBorrow) != parseFloat(data.maxBorrow)) {
        throw new Error("UDai set maxBorrow error");
    }
    const minBorrow = await uToken.minBorrow();
    if (parseFloat(minBorrow) != parseFloat(data.minBorrow)) {
        throw new Error("UDai set minBorrow error");
    }
    const overdueBlocks = await uToken.overdueBlocks();
    if (parseFloat(overdueBlocks) != parseFloat(data.overdueBlocks)) {
        throw new Error("UDai set overdueBlocks error");
    }
    const assetManager = await uToken.assetManager();
    const assetManagerParams = checkFileExist(`../deployments/${networks[chainId]}/AssetManager.json`);
    if (assetManager.toLowerCase() != assetManagerParams.address.toLowerCase()) {
        throw new Error("UDai set assetManager error");
    }
    const userManager = await uToken.userManager();
    const userManagerParams = checkFileExist(`../deployments/${networks[chainId]}/UserManager.json`);
    if (userManager.toLowerCase() != userManagerParams.address.toLowerCase()) {
        throw new Error("UDai set userManager error");
    }
    const interestRateModel = await uToken.interestRateModel();
    const interestRateModelParams = checkFileExist(`../deployments/${networks[chainId]}/FixedInterestRateModel.json`);
    if (interestRateModel.toLowerCase() != interestRateModelParams.address.toLowerCase()) {
        throw new Error("UDai set interestRateModel error");
    }

    console.log("UDai success");
};

const checkGovernance = async chainId => {
    const path = `../deployments/${networks[chainId]}/UnionGovernor.json`;
    const params = checkFileExist(path);
    const unionGovernor = await ethers.getContractAt("UnionGovernor", params.address);
    const data = configs[chainId]["UnionGovernor"];

    const votingDelay = await unionGovernor.votingDelay();
    if (votingDelay != data.initialVotingDelay) {
        throw new Error("unionGovernor set votingDelay error");
    }
    const votingPeriod = await unionGovernor.votingPeriod();
    if (votingPeriod != data.initialVotingPeriod) {
        throw new Error("unionGovernor set votingPeriod error");
    }
    const proposalThreshold = await unionGovernor.proposalThreshold();
    if (proposalThreshold.toString() != data.initialProposalThreshold.toString()) {
        throw new Error("unionGovernor set proposalThreshold error");
    }
};

async function main() {
    const chainId = await getChainId();
    await checkAssetManager(chainId);
    await checkPureTokenAdapter(chainId);
    if (chainId == 1 || chainId == 4 || chainId == 42) {
        await checkCompoundAdapter(chainId);
    }
    if (chainId == 1) {
        await checkAaveAdapter(chainId);
    }
    await checkComptroller(chainId);
    await checkFixedInterestRateModel(chainId);
    await checkMarketRegistry(chainId);
    await checkSumOfTrust(chainId);
    await checkTimelock(chainId);
    await checkTreasury(chainId);
    await checkTreasuryVester(chainId);
    await checkUnionToken(chainId);
    await checkUserManager(chainId);
    await checkUToken(chainId);
    await checkGovernance(chainId);
}

module.exports = main;
