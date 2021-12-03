//SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.4;

import "@openzeppelin/contracts/utils/math/Math.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

import "../interfaces/ICreditLimitModel.sol";

contract SumOfTrust is Ownable, ICreditLimitModel {
    using Math for uint256;

    bool public constant override isCreditLimitModel = true;
    uint256 public override effectiveNumber;

    constructor(uint256 effectiveNumber_) {
        effectiveNumber = effectiveNumber_;
    }

    function getCreditLimit(uint256[] memory vouchs) public view override returns (uint256) {
        if (vouchs.length >= effectiveNumber) {
            uint256 limit;
            for (uint256 i = 0; i < vouchs.length; i++) {
                limit += vouchs[i];
            }

            return limit;
        } else {
            return 0;
        }
    }

    function getLockedAmount(
        LockedInfo[] memory array,
        address account,
        uint256 amount,
        bool isIncrease
    ) public pure override returns (uint256) {
        if (array.length == 0) return 0;

        uint256 remaining = amount;
        uint256 newLockedAmount;
        if (isIncrease) {
            array = _sortArray(array, true);
            for (uint256 i = 0; i < array.length; i++) {
                uint256 remainingVouchingAmount;
                if (array[i].vouchingAmount > array[i].lockedAmount) {
                    remainingVouchingAmount = array[i].vouchingAmount - array[i].lockedAmount;
                } else {
                    remainingVouchingAmount = 0;
                }

                if (remainingVouchingAmount > array[i].availableStakingAmount) {
                    if (array[i].availableStakingAmount > remaining) {
                        newLockedAmount = array[i].lockedAmount + remaining;
                        remaining = 0;
                    } else {
                        newLockedAmount = array[i].lockedAmount + array[i].availableStakingAmount;
                        remaining = remaining - array[i].availableStakingAmount;
                    }
                } else {
                    if (remainingVouchingAmount > remaining) {
                        newLockedAmount = array[i].lockedAmount + remaining;
                        remaining = 0;
                    } else {
                        newLockedAmount = array[i].lockedAmount + remainingVouchingAmount;
                        remaining -= remainingVouchingAmount;
                    }
                }

                if (account == array[i].staker) {
                    return newLockedAmount;
                }
            }
        } else {
            array = _sortArray(array, false);
            for (uint256 i = 0; i < array.length; i++) {
                if (array[i].lockedAmount > remaining) {
                    newLockedAmount = array[i].lockedAmount - remaining;
                    remaining = 0;
                } else {
                    newLockedAmount = 0;
                    remaining -= array[i].lockedAmount;
                }

                if (account == array[i].staker) {
                    return newLockedAmount;
                }
            }
        }

        return 0;
    }

    function setEffectNumber(uint256 number) external onlyOwner {
        effectiveNumber = number;
    }

    //use oddEvenSort
    function _sortArray(LockedInfo[] memory arr, bool isPositive) public pure returns (LockedInfo[] memory) {
        if (arr.length == 0 || arr.length == 1) return arr;
        uint256 n = arr.length;
        // Initially array is unsorted
        bool isSorted = false;
        while (!isSorted) {
            isSorted = true;
            LockedInfo memory temp;
            if (isPositive) {
                // Perform Bubble sort on odd indexed element
                for (uint256 i = 1; i <= n - 2; i = i + 2) {
                    if (arr[i].vouchingAmount < arr[i + 1].vouchingAmount) {
                        temp = arr[i];
                        arr[i] = arr[i + 1];
                        arr[i + 1] = temp;
                        isSorted = false;
                    }
                }

                // Perform Bubble sort on even indexed element
                for (uint256 i = 0; i <= n - 2; i = i + 2) {
                    if (arr[i].vouchingAmount < arr[i + 1].vouchingAmount) {
                        temp = arr[i];
                        arr[i] = arr[i + 1];
                        arr[i + 1] = temp;
                        isSorted = false;
                    }
                }
            } else {
                // Perform Bubble sort on odd indexed element
                for (uint256 i = 1; i <= n - 2; i = i + 2) {
                    if (arr[i].vouchingAmount > arr[i + 1].vouchingAmount) {
                        temp = arr[i];
                        arr[i] = arr[i + 1];
                        arr[i + 1] = temp;
                        isSorted = false;
                    }
                }

                // Perform Bubble sort on even indexed element
                for (uint256 i = 0; i <= n - 2; i = i + 2) {
                    if (arr[i].vouchingAmount > arr[i + 1].vouchingAmount) {
                        temp = arr[i];
                        arr[i] = arr[i + 1];
                        arr[i + 1] = temp;
                        isSorted = false;
                    }
                }
            }
        }

        return arr;
    }
}
