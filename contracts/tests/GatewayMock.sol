//SPDX-License-Identifier: MIT
pragma solidity 0.8.4;
import "../token/ArbUnionWrapper.sol";

contract GatewayMock {
    constructor() {}

    function registerTokenToL2(
        address,
        uint256,
        uint256,
        uint256
    ) public view {
        require(ArbUnionWrapper(msg.sender).isArbitrumEnabled() == uint16(0xa4b1));
    }
}
