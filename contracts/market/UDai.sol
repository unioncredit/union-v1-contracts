//SPDX-License-Identifier: UNLICENSED
pragma solidity 0.8.4;

import "./UToken.sol";

interface IDai is IERC20Upgradeable {
    function permit(
        address holder,
        address spender,
        uint256 nonce,
        uint256 expiry,
        bool allowed,
        uint8 v,
        bytes32 r,
        bytes32 s
    ) external;
}

contract UDai is UToken {
    function repayBorrowWithPermit(
        address borrower,
        uint256 amount,
        uint256 nonce,
        uint256 expiry,
        uint8 v,
        bytes32 r,
        bytes32 s
    ) public whenNotPaused {
        IDai erc20Token = IDai(underlying);
        erc20Token.permit(msg.sender, address(this), nonce, expiry, true, v, r, s);

        _repayBorrowFresh(msg.sender, borrower, amount);
    }
}
