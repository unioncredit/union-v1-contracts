const {ethers, upgrades} = require("hardhat");
require("chai").should();

describe("Sort Contract", async () => {
    let sortContract;
    before(async () => {
        const Sort = await ethers.getContractFactory("Sort");
        sortContract = await Sort.deploy();
    });

    it("Test Sort Gas Cost", async () => {
        const counts = [3, 5, 10, 25, 50, 75, 100];
        let arr;
        for (let i = 0; i < counts.length; i++) {
            console.log("************");
            arr = new Array(counts[i]);
            for (let j = 0; j < arr.length; j++) {
                arr[j] = {
                    user: "user_" + j,
                    amount: ethers.utils.parseEther(parseInt(Math.random() * 100).toString())
                };
            }
            console.log(`params length: ${arr.length}`);
            await sortContract.gasCostSortInsertion(arr);
            //res = await sortContract.oddEvenSort(arr, arr.length);
            // let array = [];
            // for (let i = 0; i < res.length; i++) {
            //     array.push({
            //         user: res[i].user,
            //         amount: res[i].amount.toString()
            //     });
            // }
            // console.log(array);
        }
    });
});
