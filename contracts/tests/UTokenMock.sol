pragma solidity ^0.8.4;

import "@openzeppelin/contracts-upgradeable/token/ERC20/IERC20Upgradeable.sol";
import "@openzeppelin/contracts-upgradeable/token/ERC20/ERC20Upgradeable.sol";

import "../interfaces/IUserManager.sol";

/**
 *  @title UToken Contract
 *  @dev Union accountBorrows can borrow and repay thru this component.
 */
contract UTokenMock is ERC20Upgradeable {
    bool public constant IS_UTOKEN = true;
    uint256 public constant WAD = 1e18;
    uint256 internal constant BORROW_RATE_MAX_MANTISSA = 0.0005e16; //Maximum borrow rate that can ever be applied (.0005% / block)
    uint256 internal constant RESERVE_FACTORY_MAX_MANTISSA = 1e18; //Maximum fraction of interest that can be set aside for reserves

    bytes32 public constant PERMIT_TYPEHASH =
        keccak256("Permit(address owner,address spender,uint256 value,uint256 nonce,uint256 deadline)");

    bool public isOverdue;

    function __UToken_init() public initializer {
        ERC20Upgradeable.__ERC20_init("uToken", "uToken");
    }

    function updateOverdueInfo(
        address userManager,
        address account,
        bool _isOverdue
    ) external {
        IUserManager(userManager).updateTotalFrozen(account, _isOverdue);
    }

    function updateLockedData(
        address userManager,
        address account,
        uint256 amount
    ) external {
        IUserManager(userManager).updateLockedData(account, amount, true);
    }

    function setIsOverdue(bool _isOverdue) public returns (bool) {
        return isOverdue = _isOverdue;
    }

    function checkIsOverdue(address account) public view returns (bool) {
        return isOverdue;
    }

    function getRemainingLoanSize() public view returns (uint256) {
        return 0;
    }

    function getLastRepay(address account) public view returns (uint256 lastRepay) {
        lastRepay = 0;
    }

    function getInterestIndex(address account) public view returns (uint256 interestIndex) {
        interestIndex = 0;
    }

    function calculatingFee(uint256 amount) public view returns (uint256) {
        return 0;
    }

    function getLoan(address member)
        public
        view
        returns (
            uint256 principal,
            uint256 totalBorrowed,
            address asset,
            uint256 apr,
            int256 limit,
            bool _isOverdue,
            uint256 lastRepay
        )
    {}

    function getBorrowed(address account) public view returns (uint256 borrowed) {}

    function borrowBalanceView(address account) public view returns (uint256) {
        return 0;
    }

    function borrowRatePerBlock() public view returns (uint256) {}

    function supplyRatePerBlock() public view returns (uint256) {
        return 0;
    }

    function exchangeRateCurrent() public returns (uint256) {
        return exchangeRateStored();
    }

    function exchangeRateStored() public view returns (uint256) {}

    /**
     *  @dev Calculating member's borrowed interest
     *  @param account Member address
     *  @return Interest amount
     */
    function calculatingInterest(address account) public view returns (uint256) {
        return 0;
    }

    function repayBorrowWithPermit(
        address borrower,
        uint256 amount,
        uint256 nonce,
        uint256 expiry,
        uint8 v,
        bytes32 r,
        bytes32 s
    ) public {}

    function accrueInterest() public returns (bool) {
        return true;
    }

    function balanceOfUnderlying(address owner) external returns (uint256) {
        return balanceOf(owner);
    }

    function mint(uint256 mintAmount) external {
        _mint(msg.sender, mintAmount);
    }

    function redeem(uint256 redeemTokens) external {}

    function redeemUnderlying(uint256 redeemAmount) external {}

    function addReserves(uint256 addAmount) external {}

    function removeReserves(address receiver, uint256 reduceAmount) external {}

    function debtWriteOff(address borrower, uint256 amount) external {}

    function getBlockNumber() internal view returns (uint256) {
        return block.number;
    }

    function batchUpdateOverdueInfos(address[] calldata accounts) external {}

    function getChainId() internal view returns (uint256) {
        uint256 chainId;
        assembly {
            chainId := chainid()
        }
        return chainId;
    }

    function permit(
        address owner,
        address spender,
        uint256 value,
        uint256 deadline,
        uint8 v,
        bytes32 r,
        bytes32 s
    ) external {}
}
