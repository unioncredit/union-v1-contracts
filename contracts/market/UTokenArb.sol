//SPDX-License-Identifier: UNLICENSED
pragma solidity 0.8.4;

import "../interfaces/IEip712.sol";
import "./UToken.sol";

contract UTokenArb is UToken {
    function repayBorrowWithEip712Permit(
        address borrower,
        uint256 amount,
        uint256 deadline,
        uint8 v,
        bytes32 r,
        bytes32 s
    ) public whenNotPaused {
        IEip712 erc20Token = IEip712(underlying);
        erc20Token.permit(msg.sender, address(this), type(uint256).max, deadline, v, r, s);
        _repayBorrowFresh(msg.sender, borrower, amount);
    }
}
