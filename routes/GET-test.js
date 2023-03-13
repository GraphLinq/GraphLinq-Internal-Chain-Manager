const test = (app, environement) => {
    app.get('/test', async (req, res) => {

        if (app.node1) {
            await app.node1.checkIsAlive();
        }

        if (app.node2) {
            await app.node2.checkIsAlive();
        }
        
        let data = {
            node1: {
                status: app.node1?.status ? app.node1?.status : '0',
                mining: app.node1?.mining ? app.node1?.mining : '0',
                logs: app.node1?.logs ? app.node1?.logs : [],
                ipcLogs: app.node1?.ipcLogs ? app.node1?.ipcLogs : []
            },
            node2: {
                status: app.node2?.status ? app.node2?.status : '0',
                mining: '0',
                logs: app.node2?.logs ? app.node2?.logs : [],
                ipcLogs: app.node2?.ipcLogs ? app.node2?.ipcLogs : []
            },
            pairNodes: app.pairNodes
        };
        res.send(data);
    });
};//const wallet = new ethers.Wallet(environement.bridgeWallet.private);

module.exports = {
    test
};