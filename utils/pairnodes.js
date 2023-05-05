const fs = require('fs');
const { fileGetContent } = require('./file-get-content');

const isIp = (str) => {
    const ipRegex = /^([0-9]{1,3}\.){3}[0-9]{1,3}$/;
    return ipRegex.test(str);
}

module.exports = {
    parsePairNodes: async () => {
        let nodes = [
            ... (fs.readFileSync('./pair-nodes-base.txt').toString()).split('\n')
        ].filter(x => x != undefined && x != '');

        let enodes = [];

        for (let x of nodes) {
            if (x.startsWith('enode://')) {
                enodes.push(x);
            } else if (isIp(x)) { // ip address
                try {
                    let response = await fileGetContent(`http://${x}`);
                    let responseEnodes = JSON.parse(response.toString());

                    for (let n of responseEnodes) {
                        if (!enodes.includes(n)) {
                            enodes.push(n);
                        }
                    }
                } catch (e) {}
            } else if (x.startsWith('https://') || x.startsWith('http://')) { // domain
                try {
                    console.log(`${x.replace(/[\/]+$/, '')}`);
                    let response = await fileGetContent(`${x.replace(/[\/]+$/, '')}`);
                    let responseEnodes = JSON.parse(response.toString());

                    for (let n of responseEnodes) {
                        if (!enodes.includes(n)) {
                            enodes.push(n);
                        }
                    }
                } catch (e) {}
            }
        }
        return enodes;
    },
    getPairNodeData: () => {
        return [
            ... (fs.readFileSync('./pair-nodes-base.txt').toString()).split('\n')
        ].filter(x => x != undefined && x != '');
    }
}