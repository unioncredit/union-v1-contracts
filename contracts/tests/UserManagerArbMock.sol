//SPDX-License-Identifier: MIT
pragma solidity ^0.8.4;

import "../user/UserManagerArb.sol";

contract UserManagerArbMock is UserManagerArb {
    /**
     *  @dev Max number of vouches for a member can get, for ddos protection
     */
    function _maxTrust() internal pure override returns (uint256) {
        // set to a small number for easy testing
        return 3;
    }
}
