// SPDX-License-Identifier: MIT
pragma solidity 0.8.4;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import {IArbToken} from "../interfaces/IArbToken.sol";
import {Whitelistable} from "./Whitelistable.sol";

contract ArbUnion is ERC20, Whitelistable, IArbToken {
    address public immutable override l1Address;
    address public l2Gateway;

    constructor(address _l2Gateway, address _l1TokenAddress) ERC20("Arbitrum UNION", "arbUNION") {
        l2Gateway = _l2Gateway;
        l1Address = _l1TokenAddress;
        whitelistEnabled = false;
        whitelist(l2Gateway);
    }

    function getChainId() public view returns (uint256 chainId) {
        assembly {
            chainId := chainid()
        }
    }

    modifier onlyL2Gateway() {
        require(msg.sender == l2Gateway, "NOT_GATEWAY");
        _;
    }

    /**
     * @notice should increase token supply by amount, and should (probably) only be callable by the L1 bridge.
     */
    function bridgeMint(address account, uint256 amount) external override onlyL2Gateway {
        _mint(account, amount);
    }

    /**
     * @notice should decrease token supply by amount, and should (probably) only be callable by the L1 bridge.
     */
    function bridgeBurn(address account, uint256 amount) external override onlyL2Gateway {
        _burn(account, amount);
    }

    function _beforeTokenTransfer(
        address from,
        address to,
        uint256 amount
    ) internal override {
        super._beforeTokenTransfer(from, to, amount);

        if (whitelistEnabled) {
            require(isWhitelisted(msg.sender) || to == address(0), "Whitelistable: address not whitelisted");
        }
    }

    function _afterTokenTransfer(
        address from,
        address to,
        uint256 amount
    ) internal override {
        super._afterTokenTransfer(from, to, amount);
    }
}
