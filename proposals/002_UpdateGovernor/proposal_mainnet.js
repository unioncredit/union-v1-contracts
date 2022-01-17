const ADMIN_ROLE = ethers.utils.id("TIMELOCK_ADMIN_ROLE");
const PROPOSER_ROLE = ethers.utils.id("PROPOSER_ROLE");
const EXECUTOR_ROLE = ethers.utils.id("EXECUTOR_ROLE");
const timelockAddress = "0xBBD3321f377742c4b3fe458b270c2F271d3294D8";
const governorAddress = "0x011e5846975c6463a8c6337EECF3cbF64e328884";

async function getProposalParams(newGovernorAddress) {
    if (!newGovernorAddress) {
        // Make sure new governor is deployed before proposing
        throw new Error("New governor address is zero");
    }
    const timelock = await ethers.getContractAt("TimelockController", timelockAddress);

    const targets = [
        timelockAddress,
        timelockAddress,
        timelockAddress,
        timelockAddress,
        timelockAddress,
        timelockAddress
    ];
    const values = ["0", "0", "0", "0", "0", "0"];
    const calldatas = [
        timelock.interface.encodeFunctionData("grantRole(bytes32,address)", [ADMIN_ROLE, newGovernorAddress]),
        timelock.interface.encodeFunctionData("grantRole(bytes32,address)", [PROPOSER_ROLE, newGovernorAddress]),
        timelock.interface.encodeFunctionData("grantRole(bytes32,address)", [EXECUTOR_ROLE, newGovernorAddress]),
        timelock.interface.encodeFunctionData("revokeRole(bytes32,address)", [ADMIN_ROLE, governorAddress]),
        timelock.interface.encodeFunctionData("revokeRole(bytes32,address)", [PROPOSER_ROLE, governorAddress]),
        timelock.interface.encodeFunctionData("revokeRole(bytes32,address)", [EXECUTOR_ROLE, governorAddress])
    ];
    const msg = `
    Fix Governor propose() issues 

# prerequisite

1. New governor deployed at: ${newGovernorAddress}.

# Proposals

1. Set timelock controller to use new governor.
2. Revoke the old governor's roles from timelock.

    `;

    return {targets, values, calldatas, msg};
}

module.exports = {
    getProposalParams,
    ADMIN_ROLE,
    PROPOSER_ROLE,
    EXECUTOR_ROLE,
    timelockAddress,
    governorAddress
};
