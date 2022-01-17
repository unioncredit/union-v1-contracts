const {ethers, deployments, getChainId} = require("hardhat");

const configs = require("../deployConfig.js");

const getDAIAddress = async chainId => {
    return chainId != 31337 ? configs[chainId]["DAI"] : (await deployments.get("FaucetERC20")).address;
};

const checkAssetManager = async chainId => {
    const assetManager = await ethers.getContract("AssetManager");

    const newSeq = configs[chainId]["AssetManager"]["newSeq"];
    for (let i = 0; i < newSeq.length; i++) {
        const seq = await assetManager.withdrawSeq(i);
        if (parseFloat(seq) !== parseFloat(newSeq[i])) {
            throw new Error("assetManager sequence set error");
        }
    }

    const DAI = await getDAIAddress(chainId);

    const isSupported = await assetManager.supportedMarkets(DAI);
    if (!isSupported) {
        throw new Error("assetManager DAI not add");
    }

    const marketRegistry = await assetManager.marketRegistry();
    const marketRegistryParams = await ethers.getContract("MarketRegistry");
    if (marketRegistry.toLowerCase() != marketRegistryParams.address?.toLowerCase()) {
        throw new Error("AssetManager set marketRegistry error");
    }

    console.log("AssetManager success");
};

const checkPureTokenAdapter = async chainId => {
    const pureTokenAdapter = await ethers.getContract("PureTokenAdapter");

    const DAI = await getDAIAddress(chainId);

    const ceiling = await pureTokenAdapter.ceilingMap(DAI);
    if (parseFloat(ceiling) != parseFloat(configs[chainId]["PureTokenAdapter"]["ceiling"])) {
        throw new Error("PureTokenAdapter setCeiling error");
    }

    const floor = await pureTokenAdapter.floorMap(DAI);
    if (parseFloat(floor) != parseFloat(configs[chainId]["PureTokenAdapter"]["floor"])) {
        throw new Error("PureTokenAdapter setFloor error");
    }

    const assetManager = await pureTokenAdapter.assetManager();
    const assetManagerParams = await ethers.getContract("AssetManager");
    if (assetManager.toLowerCase() != assetManagerParams.address?.toLowerCase()) {
        throw new Error("PureTokenAdapter set assetManager error");
    }

    console.log("PureTokenAdapter success");
};

const checkCompoundAdapter = async chainId => {
    const compoundAdapter = await ethers.getContract("CompoundAdapter");

    const DAI = await getDAIAddress(chainId);

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
    const assetManagerParams = await ethers.getContract("AssetManager");
    if (assetManager.toLowerCase() != assetManagerParams.address?.toLowerCase()) {
        throw new Error("CompoundAdapter set assetManager error");
    }

    console.log("CompoundAdapter success");
};

const checkAaveAdapter = async chainId => {
    const aaveAdapter = await ethers.getContract("AaveAdapter");

    const DAI = await getDAIAddress(chainId);

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
    const assetManagerParams = await ethers.getContract("AssetManager");
    if (assetManager.toLowerCase() != assetManagerParams.address?.toLowerCase()) {
        throw new Error("AaveAdapter set assetManager error");
    }

    console.log("AaveAdapter success");
};

const checkComptroller = async chainId => {
    const comptroller = await ethers.getContract("Comptroller");

    const unionToken = await comptroller.unionToken();
    const unionTokenParams = await ethers.getContract("UnionToken");
    if (unionToken.toLowerCase() != unionTokenParams.address?.toLowerCase()) {
        throw new Error("Comptroller set unionToken error");
    }

    const marketRegistry = await comptroller.marketRegistry();
    const marketRegistryParams = await ethers.getContract("MarketRegistry");
    if (marketRegistry.toLowerCase() != marketRegistryParams.address?.toLowerCase()) {
        throw new Error("Comptroller set marketRegistry error");
    }

    console.log("Comptroller success");
};

const checkFixedInterestRateModel = async chainId => {
    const fixedInterestRateModel = await ethers.getContract("FixedInterestRateModel");
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
    const marketRegistry = await ethers.getContract("MarketRegistry");

    const uTokenParams = await ethers.getContract("UDai");
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

    const userManagerParams = await ethers.getContract("UserManager");
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
    const sumOfTrust = await ethers.getContract("SumOfTrust");
    const effectiveNumber = await sumOfTrust.effectiveNumber();
    if (parseFloat(effectiveNumber) != parseFloat(configs[chainId]["SumOfTrust"]["effectiveNumber"])) {
        throw new Error("SumOfTrust set effectiveNumber error");
    }

    console.log("SumOfTrust success");
};

const checkTimelock = async chainId => {
    const timelock = await ethers.getContract("TimelockController");
    const minDelay = await timelock.getMinDelay();
    if (parseFloat(minDelay) != parseFloat(configs[chainId]["TimelockController"]["minDelay"])) {
        throw new Error("Timelock set minDelay error");
    }
    const governorParams = await ethers.getContract("UnionGovernor");
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
    const treasury = await ethers.getContract("Treasury");
    const unionToken = await treasury.token();
    const unionTokenParams = await ethers.getContract("UnionToken");
    if (unionToken.toLowerCase() != unionTokenParams.address?.toLowerCase()) {
        throw new Error("Treasury set unionToken error");
    }

    const comptrollerParams = await ethers.getContract("Comptroller");
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
    const treasuryVester = await ethers.getContract("TreasuryVester");
    const unionToken = await treasuryVester.unionToken();
    const recipient = await treasuryVester.recipient();
    const vestingAmount = await treasuryVester.vestingAmount();
    const vestingBegin = await treasuryVester.vestingBegin();
    const vestingCliff = await treasuryVester.vestingCliff();
    const vestingEnd = await treasuryVester.vestingEnd();
    const data = configs[chainId]["TreasuryVester"];
    const unionTokenParams = await ethers.getContract("UnionToken");
    const treasuryParams = await ethers.getContract("Treasury");
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
    const unionToken = await ethers.getContract("UnionToken");
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
    const userManager = await ethers.getContract("UserManager");
    const assetManagerParams = await ethers.getContract("AssetManager");
    const assetManager = await userManager.assetManager();
    if (assetManager.toLowerCase() != assetManagerParams.address?.toLowerCase()) {
        throw new Error("UserManager set assetManager error");
    }
    const unionTokenParams = await ethers.getContract("UnionToken");
    const unionToken = await userManager.unionToken();
    if (unionToken.toLowerCase() != unionTokenParams.address?.toLowerCase()) {
        throw new Error("UserManager set unionToken error");
    }
    const creditLimitModelParams = await ethers.getContract("SumOfTrust");
    const creditLimitModel = await userManager.creditLimitModel();
    if (creditLimitModel.toLowerCase() != creditLimitModelParams.address?.toLowerCase()) {
        throw new Error("UserManager set sumOfTrust error");
    }
    const comptrollerParams = await ethers.getContract("Comptroller");
    const comptroller = await userManager.comptroller();
    if (comptroller.toLowerCase() != comptrollerParams.address?.toLowerCase()) {
        throw new Error("UserManager set comptroller error");
    }
    const uTokenParams = await ethers.getContract("UDai");
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
    const uToken = await ethers.getContract("UDai");
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
    const assetManagerParams = await ethers.getContract("AssetManager");
    if (assetManager.toLowerCase() != assetManagerParams.address.toLowerCase()) {
        throw new Error("UDai set assetManager error");
    }
    const userManager = await uToken.userManager();
    const userManagerParams = await ethers.getContract("UserManager");
    if (userManager.toLowerCase() != userManagerParams.address.toLowerCase()) {
        throw new Error("UDai set userManager error");
    }
    const interestRateModel = await uToken.interestRateModel();
    const interestRateModelParams = await ethers.getContract("FixedInterestRateModel");
    if (interestRateModel.toLowerCase() != interestRateModelParams.address.toLowerCase()) {
        throw new Error("UDai set interestRateModel error");
    }

    console.log("UDai success");
};

const checkGovernance = async chainId => {
    const unionGovernor = await ethers.getContract("UnionGovernor");
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
