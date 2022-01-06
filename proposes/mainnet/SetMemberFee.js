async function main() {
    const userManagerAddress = "0x49c910Ba694789B58F53BFF80633f90B8631c195";

    const userManager = await ethers.getContractAt("UserManager", userManagerAddress);

    const targets = [userManagerAddress];
    const values = ["0"];
    const sigs = ["setNewMemberFee(uint256)"];
    const calldatas = [ethers.utils.defaultAbiCoder.encode(["uint256"], ["500000000000000000"])];
    // const sigs = [""];
    // const calldatas = [userManager.interface.encodeFunctionData("setNewMemberFee(uint256)", ["500000000000000000"])];
    const msg = `
    Change New Member Fee to 0.5 UNION

# Proposal

1. Set UserManager's new member fee to 0.5 (500000000000000000) UNION.

    `;

    return {targets, values, sigs, calldatas, msg};
}

module.exports = main;
