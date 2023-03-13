const fs = require('fs');

const keyth = require('keythereum');

const status = (app, environement) => {
    app.post('/node2-ipc-command', async (req, res) => {
        let command = req.body['command'];
        let ignore = req.body['ignore'];

        if (!app.node2) {
            res.send([]);
            return ;
        }
        console.log('exec ', command);
        await app.node2.ipcExec(command, ignore == true ? false : true);
        res.send(app.node2.ipcLogs);
    });
};

module.exports = {
    status
};