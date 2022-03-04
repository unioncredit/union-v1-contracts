const ADMIN_ROLE = ethers.utils.id("TIMELOCK_ADMIN_ROLE");
const PROPOSER_ROLE = ethers.utils.id("PROPOSER_ROLE");
const EXECUTOR_ROLE = ethers.utils.id("EXECUTOR_ROLE");

async function getProposalParams({timelockAddress, governorAddress, newGovernorAddress}) {
    if (!timelockAddress || !governorAddress || !newGovernorAddress) {
        // Make sure new governor is deployed before proposing
        throw new Error("address error");
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

# Prerequisites

- New governor deployed at: ${newGovernorAddress}.

# Proposals

- Set timelock controller to use the new governor.
- Revoke the old governor from timelock.

    `;
    console.log("Proposal contents");
    console.log({targets, values, calldatas, msg});

    return {targets, values, calldatas, msg};
}

async function getNewGovernorProposalParams({userManagerAddress}) {
    const userManager = await ethers.getContractAt("UserManager", userManagerAddress);

    const targets = [userManagerAddress];
    const values = ["0"];
    const sigs = ["setNewMemberFee(uint256)"];
    const calldatas = [ethers.utils.defaultAbiCoder.encode(["uint256"], [ethers.utils.parseUnits("0.1")])];
    const msg = `Change New Member Fee to 0.1 Union`;
    console.log("Proposal contents");
    console.log({targets, values, sigs, calldatas, msg});
    return {targets, values, sigs, calldatas, msg};
}

module.exports = {
    getProposalParams,
    getNewGovernorProposalParams,
    ADMIN_ROLE,
    PROPOSER_ROLE,
    EXECUTOR_ROLE
};
