const fs = require('fs');

const status = (app, environement) => {
    app.post('/node2-kill', async (req, res) => {
        if (!app.node2) {
            res.send(false);
            return ;
        }
        app.node2.stop();
        res.send(true);
    });
};

module.exports = {
    status
};