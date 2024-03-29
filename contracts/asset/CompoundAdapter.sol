//SPDX-License-Identifier: MIT
pragma solidity 0.8.4;
pragma abicoder v1;

import "@openzeppelin/contracts-upgradeable/token/ERC20/IERC20Upgradeable.sol";
import "@openzeppelin/contracts-upgradeable/token/ERC20/utils/SafeERC20Upgradeable.sol";
import "../interfaces/IMoneyMarketAdapter.sol";
import "../Controller.sol";

abstract contract CToken is IERC20Upgradeable {
    function supplyRatePerBlock() external view virtual returns (uint256);

    function mint(uint256 mintAmount) external virtual returns (uint256);

    function redeemUnderlying(uint256 redeemAmount) external virtual returns (uint256);

    function balanceOfUnderlying(address owner) external virtual returns (uint256);

    function exchangeRateStored() external view virtual returns (uint256);
}

abstract contract CComptroller {
    function getCompAddress() external view virtual returns (address);

    // Claim all the COMP accrued by holder in all markets
    function claimComp(address holder) external virtual;

    // Claim all the COMP accrued by holder in specific markets
    function claimComp(address holder, CToken[] memory cTokens) external virtual;

    // Claim all the COMP accrued by specific holders in specific markets for their supplies and/or borrows
    function claimComp(
        address[] memory holders,
        CToken[] memory cTokens,
        bool borrowers,
        bool suppliers
    ) external virtual;
}

/**
 * @title CompoundAdapter
 *  @dev The implementation of Compound.Finance MoneyMarket that integrates with AssetManager.
 */
contract CompoundAdapter is Controller, IMoneyMarketAdapter {
    using SafeERC20Upgradeable for IERC20Upgradeable;

    mapping(address => address) public tokenToCToken;

    address public assetManager;
    CComptroller public comptroller;
    mapping(address => uint256) public override floorMap;
    mapping(address => uint256) public override ceilingMap;

    modifier checkTokenSupported(address tokenAddress) {
        require(_supportsToken(tokenAddress), "Token not supported");
        _;
    }

    modifier onlyAssetManager() {
        require(msg.sender == assetManager, "Only asset manager can call");
        _;
    }

    function __CompoundAdapter_init(address _assetManager, address _comptroller) public initializer {
        Controller.__Controller_init(msg.sender);
        assetManager = _assetManager;
        comptroller = CComptroller(_comptroller);
    }

    function setAssetManager(address _assetManager) external onlyAdmin {
        assetManager = _assetManager;
    }

    function setComptroller(address _comptroller) external onlyAdmin {
        comptroller = CComptroller(_comptroller);
    }

    function setFloor(address tokenAddress, uint256 floor) external onlyAdmin {
        floorMap[tokenAddress] = floor;
    }

    function setCeiling(address tokenAddress, uint256 ceiling) external onlyAdmin {
        ceilingMap[tokenAddress] = ceiling;
    }

    function mapTokenToCToken(address tokenAddress, address cTokenAddress) external onlyAdmin {
        tokenToCToken[tokenAddress] = cTokenAddress;
    }

    function getRate(address tokenAddress) external view override returns (uint256) {
        address cTokenAddress = tokenToCToken[tokenAddress];
        CToken cToken = CToken(cTokenAddress);

        return cToken.supplyRatePerBlock();
    }

    function deposit(address tokenAddress) external override checkTokenSupported(tokenAddress) {
        // get cToken
        IERC20Upgradeable token = IERC20Upgradeable(tokenAddress);
        address cTokenAddress = tokenToCToken[tokenAddress];
        CToken cToken = CToken(cTokenAddress);
        uint256 amount = token.balanceOf(address(this));
        // mint cTokens
        token.safeApprove(cTokenAddress, 0);
        token.safeApprove(cTokenAddress, amount);
        uint256 result = cToken.mint(amount);
        // slither-disable-next-line incorrect-equality
        require(result == 0, "Error minting the cToken");
    }

    function withdraw(
        address tokenAddress,
        address recipient,
        uint256 tokenAmount
    ) external override onlyAssetManager checkTokenSupported(tokenAddress) {
        IERC20Upgradeable token = IERC20Upgradeable(tokenAddress);
        address cTokenAddress = tokenToCToken[tokenAddress];
        CToken cToken = CToken(cTokenAddress);

        uint256 result = cToken.redeemUnderlying(tokenAmount);
        // slither-disable-next-line incorrect-equality
        require(result == 0, "Error redeeming the cToken");
        token.safeTransfer(recipient, tokenAmount);
    }

    function withdrawAll(address tokenAddress, address recipient)
        external
        override
        onlyAssetManager
        checkTokenSupported(tokenAddress)
    {
        IERC20Upgradeable token = IERC20Upgradeable(tokenAddress);
        address cTokenAddress = tokenToCToken[tokenAddress];
        CToken cToken = CToken(cTokenAddress);

        uint256 result = cToken.redeemUnderlying(cToken.balanceOfUnderlying(address(this)));
        // slither-disable-next-line incorrect-equality
        require(result == 0, "Error redeeming the cToken");
        token.safeTransfer(recipient, token.balanceOf(address(this)));
    }

    function claimTokens(address tokenAddress, address recipient) external override onlyAssetManager {
        _claimTokens(tokenAddress, recipient);
    }

    function getSupply(address tokenAddress) external override returns (uint256) {
        address cTokenAddress = tokenToCToken[tokenAddress];
        CToken cToken = CToken(cTokenAddress);

        // hack for preventing a rounding issue in `redeemUnderlying`
        if (cToken.balanceOf(address(this)) <= 10) {
            return 0;
        }

        return cToken.balanceOfUnderlying(address(this));
    }

    function getSupplyView(address tokenAddress) external view override returns (uint256) {
        address cTokenAddress = tokenToCToken[tokenAddress];
        CToken cToken = CToken(cTokenAddress);

        // hack for preventing a rounding issue in `redeemUnderlying`
        if (cToken.balanceOf(address(this)) <= 10) {
            return 0;
        }

        uint256 exchangeRate = cToken.exchangeRateStored();
        uint256 balance = cToken.balanceOf(address(this));
        return (balance * exchangeRate) / 10**18;
    }

    function supportsToken(address tokenAddress) external view override returns (bool) {
        return _supportsToken(tokenAddress);
    }

    function _supportsToken(address tokenAddress) internal view returns (bool) {
        return tokenToCToken[tokenAddress] != address(0);
    }

    function _claimTokens(address tokenAddress, address recipient) private {
        require(recipient != address(0), "Recipient can not be zero");
        IERC20Upgradeable token = IERC20Upgradeable(tokenAddress);
        uint256 balance = token.balanceOf(address(this));
        token.safeTransfer(recipient, balance);
    }

    function claimRewards(address tokenAddress) external override onlyAdmin {
        IERC20Upgradeable comp = IERC20Upgradeable(comptroller.getCompAddress());
        address cTokenAddress = tokenToCToken[tokenAddress];
        CToken cToken = CToken(cTokenAddress);
        CToken[] memory assets = new CToken[](1);
        assets[0] = cToken;
        comptroller.claimComp(address(this), assets);
        comp.safeTransfer(msg.sender, comp.balanceOf(address(this)));
    }
}
