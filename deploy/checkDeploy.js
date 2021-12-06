const checkDeploy = require("../scripts/_checkDeploy.js");

module.exports = async () => {
    console.log("check deploy start");
    await checkDeploy();
    console.log("check deploy end");
};
module.exports.tags = ["CheckDeploy"];
module.exports.runAtTheEnd = true;
