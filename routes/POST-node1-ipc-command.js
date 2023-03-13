const fs = require('fs');

const keyth = require('keythereum');

const status = (app, environement) => {
    app.post('/node1-ipc-command', async (req, res) => {
        let command = req.body['command'];
        let ignore = req.body['ignore'];

        if (!app.node1) {
            res.send([]);
            return ;
        }
        console.log('exec ', command);
        await app.node1.ipcExec(command, ignore == true ? false : true);
        res.send(app.node1.ipcLogs);
    });
};

module.exports = {
    status
};