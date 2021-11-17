//SPDX-License-Identifier: UNLICENSED
pragma solidity 0.8.4;

import "hardhat/console.sol";

contract Sort {
    function quick(uint256[] memory data) internal pure {
        if (data.length > 1) {
            quickPart(data, 0, data.length - 1);
        }
    }

    function quickPart(
        uint256[] memory data,
        uint256 low,
        uint256 high
    ) internal pure {
        if (low < high) {
            uint256 pivotVal = data[(low + high) / 2];

            uint256 low1 = low;
            uint256 high1 = high;
            for (;;) {
                while (data[low1] < pivotVal) low1++;
                while (data[high1] > pivotVal) high1--;
                if (low1 >= high1) break;
                (data[low1], data[high1]) = (data[high1], data[low1]);
                low1++;
                high1--;
            }
            if (low < high1) quickPart(data, low, high1);
            high1++;
            if (high1 < high) quickPart(data, high1, high);
        }
    }

    function insertion(uint256[] memory data) internal pure {  
        uint256 length = data.length;
        int256 preIndex;
        uint256 current;
        for (uint256 i = 1; i < length; i++) {
            preIndex = int(i - 1);
            current = data[i];
            while(preIndex >= 0 && data[uint256(preIndex)] > current) {
                data[uint256(preIndex+1)] = data[uint256(preIndex)];
                preIndex--;
            }
            data[uint256(preIndex+1)] = current;
        }
    }

    function selection(uint256[] memory data) internal pure {
        uint256 length = data.length;
        uint256 minIndex;
        uint256 temp;
        for (uint256 i = 0; i < length - 1; i++) {
            minIndex = i;
            for (uint256 j = i + 1; j < length; j++) {
                if (data[j] < data[minIndex]) {    
                    minIndex = j;
                }
            }
            temp = data[i];
            data[i] = data[minIndex];
            data[minIndex] = temp;
        }
    }

    function bubble(uint256[] memory data) internal pure {
        uint256 length = data.length;
        for (uint256 i = 0; i < length; i++) {
            for (uint256 j = i + 1; j < length; j++) {
                if (data[i] > data[j]) {
                    uint256 temp = data[j];
                    data[j] = data[i];
                    data[i] = temp;
                }
            }
        }
    }

    function gasCost(string memory name, function(uint256[] memory data) internal fun, uint256[] memory data)
        internal
    {
        uint256 u0 = gasleft();
        fun(data);
        uint256 u1 = gasleft();
        uint256 diff = u0 - u1;
        console.log("%s GasCost: %s", name, diff);
    }

    function gasCostSortInsertion(uint256[] calldata data) public {
        gasCost("quick", quick, data);
        gasCost("insertion", insertion, data);
        gasCost("bubble", bubble, data);
        gasCost("selection", selection, data);
    }
}
