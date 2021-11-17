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
            console.log("############");
            console.log("element reverse order setting");
            arr = new Array(counts[i]);
            //element reverse order setting
            for (let j = 0; j < arr.length; j++) {
                arr[j] = ethers.utils.parseEther((arr.length - j).toString());
            }
            console.log(`params length: ${arr.length}`);
            await sortContract.gasCostSortInsertion(arr);
            console.log("************");
            console.log("random element setting");
            arr = new Array(counts[i]);
            for (let j = 0; j < arr.length; j++) {
                arr[j] = ethers.utils.parseEther(parseInt(Math.random() * 100).toString());
            }
            console.log(`params length: ${arr.length}`);
            await sortContract.gasCostSortInsertion(arr);
        }
    });
});
