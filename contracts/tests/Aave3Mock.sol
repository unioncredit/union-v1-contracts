//SPDX-License-Identifier: MIT
pragma solidity 0.8.4;

import "@openzeppelin/contracts-upgradeable/proxy/utils/Initializable.sol";
import "@openzeppelin/contracts-upgradeable/token/ERC20/IERC20Upgradeable.sol";

interface IErc20 is IERC20Upgradeable {
    function mint(address account, uint256 amount) external;

    function burn(address account, uint256 amount) external;
}

contract Aave3Mock is Initializable {
    uint128 public rate;
    address public aToken;

    struct Data {
        uint256 d1;
        uint128 d2;
        uint128 d3;
        uint128 d4;
        uint128 d5;
        uint128 d6;
        uint40 d7;
        uint16 d8;
        address d9;
        address d10;
        address d11;
        address d12;
        uint128 d13;
        uint128 d14;
        uint128 d15;
    }

    function __AaveMock_init(uint128 _rate, address _aToken) public initializer {
        rate = _rate;
        aToken = _aToken;
    }

    function getReserveData(address) external view returns (Data memory) {
        return Data(0, 0, rate, 0, 0, 0, 0, 0, aToken, address(0), address(0), address(0), 0, 0, 0);
    }

    function deposit(
        address asset,
        uint256 amount,
        address onBehalfOf,
        uint16
    ) external {
        IErc20(asset).transferFrom(onBehalfOf, address(this), amount);
        IErc20(aToken).mint(msg.sender, amount);
    }

    function withdraw(
        address asset,
        uint256 amount,
        address to
    ) external returns (uint256) {
        uint256 userBalance = IErc20(aToken).balanceOf(msg.sender);
        uint256 amountToWithdraw = amount;
        if (amount == type(uint256).max) {
            amountToWithdraw = userBalance;
        }
        IErc20(aToken).burn(msg.sender, amountToWithdraw);
        IErc20(asset).transfer(to, amountToWithdraw);
        return amountToWithdraw;
    }
}
