//SPDX-License-Identifier: UNLICENSED
pragma solidity 0.8.4;

import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/token/ERC20/utils/SafeERC20.sol";

interface IGatewayRouter {
    function getGateway(address) external view returns (address);

    function outboundTransfer(
        address,
        address,
        uint256,
        uint256,
        uint256,
        bytes calldata _data
    ) external payable returns (bytes memory);
}

contract ArbConnector {
    using SafeERC20 for IERC20;

    IERC20 public immutable token;
    IGatewayRouter public immutable l1GatewayRouter;
    address public immutable destinationAddress;

    event LogDeposit(address indexed caller, address destination, uint256 amount);

    constructor(
        IERC20 token_,
        IGatewayRouter l1GatewayRouter_,
        address destinationAddress_
    ) {
        token = token_;
        destinationAddress = destinationAddress_;
        l1GatewayRouter = l1GatewayRouter_;
    }

    receive() external payable {}

    function approveToken() external {
        address gatewayAddress = l1GatewayRouter.getGateway(address(token));
        token.safeApprove(gatewayAddress, 0);
        token.safeApprove(gatewayAddress, type(uint256).max);
    }

    function deposit(
        uint256 maxGas,
        uint256 gasPriceBid,
        uint256 maxSubmissionCost
    ) external payable {
        uint256 amount = token.balanceOf(address(this));
        if (amount > 0) {
            bytes memory data = abi.encode(maxSubmissionCost, "");
            l1GatewayRouter.outboundTransfer{value: msg.value}(
                address(token),
                destinationAddress,
                amount,
                maxGas,
                gasPriceBid,
                data
            );
            emit LogDeposit(msg.sender, destinationAddress, amount);
        }
    }
}
