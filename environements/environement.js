const fs = require('fs');

module.exports = {
    load: () => {
        const envOptIndex = process.argv.indexOf("-c");

        if (envOptIndex == -1) {
            console.log(`[GraphLinq Node - API] help:\n -c <env> (testnet,mainnet)`);
            process.exit(0);
        }

        const envVar = process.argv[envOptIndex + 1];

        if (envVar == undefined) {
            console.log(`[GraphLinq Node - API] help:\n -c <env> (testnet,mainnet)`);
            process.exit(0);
        }

        let environement = undefined;
        try {
            environement = fs.readFileSync(`./environements/${envVar}.json`);
        } catch (e) {
            console.log(`[GraphLinq Node - API] Environement file ${envVar}.json not found`);
            process.exit(0);
        }
        return JSON.parse(environement);
    }
};