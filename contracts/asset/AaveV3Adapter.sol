//SPDX-License-Identifier: MIT
pragma solidity 0.8.4;
pragma abicoder v1;

import "@openzeppelin/contracts-upgradeable/token/ERC20/IERC20Upgradeable.sol";
import "@openzeppelin/contracts-upgradeable/token/ERC20/utils/SafeERC20Upgradeable.sol";
import "../interfaces/IMoneyMarketAdapter.sol";
import "../Controller.sol";
import "./AToken.sol";

abstract contract LendingPool3 {
    function deposit(
        address asset,
        uint256 amount,
        address onBehalfOf,
        uint16 referralCode
    ) external virtual;

    function withdraw(
        address asset,
        uint256 amount,
        address to
    ) external virtual returns (uint256);

    function getReserveData(address asset)
        external
        view
        virtual
        returns (
            uint256,
            uint128,
            uint128,
            uint128,
            uint128,
            uint128,
            uint40,
            uint16,
            address,
            address,
            address,
            address,
            uint128,
            uint128,
            uint128
        );
}

abstract contract AMarket3 {
    function claimAllRewards(address[] calldata assets, address to) external virtual returns (uint256);
}

/**
 * @title AaveAdapter
 *  @dev The implementation of Aave.Finance MoneyMarket that integrates with AssetManager.
 */
contract AaveV3Adapter is Controller, IMoneyMarketAdapter {
    using SafeERC20Upgradeable for IERC20Upgradeable;

    uint256 private constant UINT256_MAX = type(uint256).max;
    mapping(address => address) public tokenToAToken;
    address public assetManager;
    mapping(address => uint256) public override floorMap;
    mapping(address => uint256) public override ceilingMap;
    AMarket3 public market;
    LendingPool3 public lendingPool;

    modifier checkTokenSupported(address tokenAddress) {
        require(_supportsToken(tokenAddress), "AaveAdapter: Token not supported");
        _;
    }

    modifier onlyAssetManager() {
        require(msg.sender == assetManager, "AaveAdapter: only asset manager can call");
        _;
    }

    function __AaveAdapter_init(
        address _assetManager,
        LendingPool3 _lendingPool,
        AMarket3 _market
    ) public initializer {
        Controller.__Controller_init(msg.sender);
        assetManager = _assetManager;
        lendingPool = _lendingPool;
        market = _market;
    }

    function setAssetManager(address _assetManager) external onlyAdmin {
        assetManager = _assetManager;
    }

    function setFloor(address tokenAddress, uint256 floor) external onlyAdmin {
        require(tokenAddress != address(0), "AaveAdapter: tokenAddress can not be zero");
        floorMap[tokenAddress] = floor;
    }

    function setCeiling(address tokenAddress, uint256 ceiling) external onlyAdmin {
        require(tokenAddress != address(0), "AaveAdapter: tokenAddress can not be zero");
        ceilingMap[tokenAddress] = ceiling;
    }

    function mapTokenToAToken(address tokenAddress) external onlyAdmin {
        address aTokenAddress;
        (, , , , , , , , aTokenAddress, , , , , , ) = lendingPool.getReserveData(tokenAddress);
        IERC20Upgradeable token = IERC20Upgradeable(tokenAddress);
        token.safeApprove(address(lendingPool), 0);
        token.safeApprove(address(lendingPool), UINT256_MAX);
        tokenToAToken[tokenAddress] = aTokenAddress;
    }

    function getRate(address tokenAddress) external view override returns (uint256) {
        uint128 currentLiquidityRate;
        (, , currentLiquidityRate, , , , , , , , , , , , ) = lendingPool.getReserveData(tokenAddress);
        return uint256(currentLiquidityRate);
    }

    function deposit(address tokenAddress) external override checkTokenSupported(tokenAddress) {
        IERC20Upgradeable token = IERC20Upgradeable(tokenAddress);
        uint256 amount = token.balanceOf(address(this));
        lendingPool.deposit(tokenAddress, amount, address(this), 0);
    }

    function withdraw(
        address tokenAddress,
        address recipient,
        uint256 tokenAmount
    ) external override onlyAssetManager checkTokenSupported(tokenAddress) {
        // slither-disable-next-line unused-return
        lendingPool.withdraw(tokenAddress, tokenAmount, recipient);
    }

    function withdrawAll(address tokenAddress, address recipient)
        external
        override
        onlyAssetManager
        checkTokenSupported(tokenAddress)
    {
        // slither-disable-next-line unused-return
        lendingPool.withdraw(tokenAddress, UINT256_MAX, recipient);
    }

    function claimTokens(address tokenAddress, address recipient) external override onlyAssetManager {
        _claimTokens(tokenAddress, recipient);
    }

    function _getSupply(address tokenAddress) private view returns (uint256) {
        address aTokenAddress = tokenToAToken[tokenAddress];
        AToken aToken = AToken(aTokenAddress);
        uint256 balance = aToken.balanceOf(address(this));
        if (balance <= 10) {
            return 0;
        }
        return balance;
    }

    function getSupply(address tokenAddress) external view override returns (uint256) {
        return _getSupply(tokenAddress);
    }

    function getSupplyView(address tokenAddress) external view override returns (uint256) {
        return _getSupply(tokenAddress);
    }

    function supportsToken(address tokenAddress) external view override returns (bool) {
        return _supportsToken(tokenAddress);
    }

    function claimRewards(address tokenAddress) external override onlyAdmin {
        address aTokenAddress = tokenToAToken[tokenAddress];
        address[] memory assets = new address[](1);
        assets[0] = aTokenAddress;
        // slither-disable-next-line unused-return
        market.claimAllRewards(assets, msg.sender);
    }

    function _supportsToken(address tokenAddress) internal view returns (bool) {
        return tokenToAToken[tokenAddress] != address(0);
    }

    function _claimTokens(address tokenAddress, address recipient) private {
        require(recipient != address(0), "AaveAdapter: Recipient can not be zero");
        IERC20Upgradeable token = IERC20Upgradeable(tokenAddress);
        uint256 balance = token.balanceOf(address(this));
        token.safeTransfer(recipient, balance);
    }
}
