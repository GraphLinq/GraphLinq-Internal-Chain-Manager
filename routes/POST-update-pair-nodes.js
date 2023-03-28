const fs = require('fs');
const { parsePairNodes, getPairNodeData } = require('../utils/pairnodes');

const status = (app, environement) => {
    app.post('/update-pair-nodes', async (req, res) => {
        let nodes = req.body['nodes'];

        fs.writeFileSync('./pair-nodes-base.txt', nodes.join('\n'));

        app.pairNodes = await parsePairNodes();

        if (app.node1 != undefined && app.node1?.status) {
            await app.node1.updatePeers();
        }
        if (app.node2 != undefined && app.node2?.status) {
            await app.node2.updatePeers();
        }
        res.send(getPairNodeData());
    });
};

module.exports = {
    status
};