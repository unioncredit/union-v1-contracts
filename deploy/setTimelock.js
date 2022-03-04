const configs = require("../deployConfig.js");

module.exports = async ({getNamedAccounts, getChainId, ethers}) => {
    const {execute, read} = deployments;
    const {deployer} = await getNamedAccounts();
    const chainId = await getChainId();

    const governor = await deployments.get("UnionGovernor");

    console.log("setTimelock start");
    if (
        !(await read(
            "TimelockController",
            {from: deployer},
            "hasRole",
            ethers.utils.id("TIMELOCK_ADMIN_ROLE"),
            governor.address
        ))
    ) {
        tx = await execute(
            "TimelockController",
            {from: deployer},
            "grantRole",
            ethers.utils.id("TIMELOCK_ADMIN_ROLE"),
            governor.address
        );
        console.log("grantRole TIMELOCK_ADMIN_ROLE governor, tx is:", tx.transactionHash);
        if (configs[chainId].Admin) {
            tx = await execute(
                "TimelockController",
                {from: deployer},
                "grantRole",
                ethers.utils.id("TIMELOCK_ADMIN_ROLE"),
                configs[chainId].Admin
            );
            console.log("grantRole TIMELOCK_ADMIN_ROLE Admin, tx is:", tx.transactionHash);
        }
    }
    if (
        !(await read(
            "TimelockController",
            {from: deployer},
            "hasRole",
            ethers.utils.id("PROPOSER_ROLE"),
            governor.address
        ))
    ) {
        tx = await execute(
            "TimelockController",
            {from: deployer},
            "grantRole",
            ethers.utils.id("PROPOSER_ROLE"),
            governor.address
        );
        console.log("grantRole PROPOSER_ROLE governor, tx is:", tx.transactionHash);
    }
    if (
        !(await read(
            "TimelockController",
            {from: deployer},
            "hasRole",
            ethers.utils.id("EXECUTOR_ROLE"),
            governor.address
        ))
    ) {
        tx = await execute(
            "TimelockController",
            {from: deployer},
            "grantRole",
            ethers.utils.id("EXECUTOR_ROLE"),
            governor.address
        );
        console.log("grantRole EXECUTOR_ROLE governor, tx is:", tx.transactionHash);
    }

    if (
        await read("TimelockController", {from: deployer}, "hasRole", ethers.utils.id("TIMELOCK_ADMIN_ROLE"), deployer)
    ) {
        tx = await execute(
            "TimelockController",
            {from: deployer},
            "renounceRole",
            ethers.utils.id("TIMELOCK_ADMIN_ROLE"),
            deployer
        );
        console.log("renounceRole tx is:", tx.transactionHash);
    }
    if (await read("TimelockController", {from: deployer}, "hasRole", ethers.utils.id("PROPOSER_ROLE"), deployer)) {
        tx = await execute(
            "TimelockController",
            {from: deployer},
            "renounceRole",
            ethers.utils.id("PROPOSER_ROLE"),
            deployer
        );
        console.log("renounceRole tx is:", tx.transactionHash);
    }
    if (await read("TimelockController", {from: deployer}, "hasRole", ethers.utils.id("EXECUTOR_ROLE"), deployer)) {
        tx = await execute(
            "TimelockController",
            {from: deployer},
            "renounceRole",
            ethers.utils.id("EXECUTOR_ROLE"),
            deployer
        );
        console.log("renounceRole tx is:", tx.transactionHash);
    }
    console.log("setTimelock end");
};
module.exports.tags = ["TimelockControllerSetting"];
module.exports.dependencies = ["TimelockController", "UnionGovernor"];
