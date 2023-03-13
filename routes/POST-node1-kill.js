const fs = require('fs');

const status = (app, environement) => {
    app.post('/node1-kill', async (req, res) => {
        if (!app.node1) {
            res.send(false);
            return ;
        }
        app.node1.stop();
        res.send(true);
    });
};

module.exports = {
    status
};