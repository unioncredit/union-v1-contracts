const program = require("commander");
const colors = require("colors/safe");
colors.setTheme({
    input: "grey",
    verbose: "cyan",
    prompt: "grey",
    info: "brightCyan",
    warn: "yellow",
    debug: "blue",
    error: "red",
    success: "brightGreen"
});
const {SafeFactory, EthersAdapter} = require("@gnosis.pm/safe-core-sdk");
const hre = require("hardhat");
const {providers} = require("ethers");
const ethers = hre.ethers;

const createNewSafe = async ({owners, threshold}) => {
    if (threshold > owners.length) {
        console.log(colors.error("Threshold cannot be greater than the number of owners."));
        return;
    }

    var ownerAddresses = "";

    for (i = 0; i < owners.length; ++i) {
        if (ethers.utils.isAddress(owners[i])) {
            ownerAddresses += ` ${owners[i]}`;
        } else {
            console.log(colors.error(`Invalid address: ${owners[i]}`));
            return;
        }
    }

    const network = await ethers.provider.getNetwork();

    console.log(
        colors.info(
            `Deploying new Safe wallet to '${network.name}' with \nOwners:${ownerAddresses}\nThreshold: ${threshold} out of ${owners.length} owners`
        )
    );

    const [signer] = await ethers.getSigners();

    console.log(colors.debug(`Deployer account: ${signer.address}`));

    const ethAdapter = new EthersAdapter({
        ethers,
        signer: signer
    });

    const safeFactory = await SafeFactory.create({ethAdapter});

    const safeSdk = await safeFactory.deploySafe({
        owners,
        threshold
    });

    console.log(colors.success(`Success! New safe address: ${safeSdk.getAddress()}`));
};

program
    .command("create")
    .description("Create Gnosis-safe multi-sig wallet")
    .requiredOption("-o, --owners [addresses...]", "Owner addresses, separated with spaces.")
    .requiredOption(
        "-t, --threshold <number>",
        "Specify how many of owners have to confirm a transaction before it gets executed."
    )
    .action(createNewSafe);

program.program.parse(process.argv);
