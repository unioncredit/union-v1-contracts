//SPDX-License-Identifier: MIT
pragma solidity ^0.8.4;

import "./UserManager.sol";

contract UserManagerArb is UserManager {
    using SafeERC20Upgradeable for IERC20Upgradeable;

    /**
     *  @dev Register member with a fee, send fees back to comptroller
     *  @param newMember New member address
     */
    function registerMember(address newMember) public override whenNotPaused {
        if (checkIsMember(newMember)) revert NoExistingMember();

        IERC20Upgradeable unionTokenContract = IERC20Upgradeable(unionToken);
        uint256 effectiveStakerNumber = 0;
        address stakerAddress;
        uint256 addressesLength = members[newMember].creditLine.stakerAddresses.length;
        for (uint256 i = 0; i < addressesLength; i++) {
            stakerAddress = members[newMember].creditLine.stakerAddresses[i];
            if (checkIsMember(stakerAddress) && getVouchingAmount(stakerAddress, newMember) > 0)
                effectiveStakerNumber += 1;
        }

        // slither-disable-next-line reentrancy-no-eth
        if (effectiveStakerNumber < creditLimitModel.effectiveNumber()) revert NotEnoughStakers();

        members[newMember].isMember = true;

        unionTokenContract.safeTransferFrom(msg.sender, address(comptroller), newMemberFee);

        emit LogRegisterMember(msg.sender, newMember);
    }

    /**
     *  @dev Max number of vouches for a member can get, for ddos protection
     */
    function _maxTrust() internal pure virtual override returns (uint256) {
        return 50;
    }
}
