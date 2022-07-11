//SPDX-License-Identifier: MIT
pragma solidity 0.8.4;

contract RouterMock {
    constructor() {}

    function setGateway(
        address,
        uint256,
        uint256,
        uint256
    ) public returns (uint256) {}

    function outboundTransfer(
        address _l1Token,
        address _to,
        uint256 _amount,
        uint256 _maxGas,
        uint256 _gasPriceBid,
        bytes calldata _data
    ) external payable returns (bytes memory res) {}
}
