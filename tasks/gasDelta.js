const fs = require("fs");
const path = require("path");
const Table = require("cli-table3");
const colors = require("colors");

const gasReportsPath = path.resolve(__dirname, "../gasReports");

const regex = /(.*)+.json/;

const sum = arr => arr.reduce((acc, n) => acc + n, 0);

task("gasDelta", "get gas delta from gas files").setAction(async () => {
    colors.enable();
    const files = fs.readdirSync(gasReportsPath);
    const filteredFiles = files.filter(name => name.match(regex));
    const orderedFiles = filteredFiles
        .map(file => {
            return {
                name: file,
                time: fs.statSync(path.resolve(gasReportsPath, file)).mtime.getTime()
            };
        })
        .sort((a, b) => a.time - b.time)
        .map(f => f.name)
    .slice(-2);

    const results = {};

    for (const fileName of orderedFiles) {
        const content = fs.readFileSync(path.resolve(gasReportsPath, fileName));
        const json = JSON.parse(content);
        const methods = json.info.methods;
        const methodNames = Object.keys(methods);

        for (let i = 0; i < methodNames.length; i++) {
            const methodName = methodNames[i];
            const method = methods[methodName];
            const name = method.contract + "___" + method.method;

            results[name] = results[name] || {};

            const averageGas = method.numberOfCalls <= 0 ? 0 : sum(method.gasData) / method.numberOfCalls;
            results[name][fileName] = Math.floor(averageGas);
        }
    }

    const tableHeader = ["method", ...orderedFiles.map(name => name.replace(/\.json/g, "")), "delta"];
    const table = new Table({head: tableHeader.map(text => colors.white(text))});

    for (const method in results) {
        const methodResults = Object.values(results[method]);
        const delta = methodResults[1] - methodResults[0];
        const colorFn = delta < 0 ? colors.green : delta > 0 ? colors.red : colors.grey;

        if (delta !== 0) {
            table.push([method, ...methodResults, colorFn(delta)]);
        }
    }

    console.log(table.toString());
    colors.disable();
});
