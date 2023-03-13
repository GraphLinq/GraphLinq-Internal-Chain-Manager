const fs = require('fs');

const getHtmlContent = (environement) => {
    let content = (fs.readFileSync('./html/status.html')).toString();

    content = content.replace(/\$password/, environement.password);
    return content;
}

const keyth = require('keythereum');

const status = (app, environement) => {
    app.get('/status', async (req, res) => {

        let htmlContent = getHtmlContent(environement);

        htmlContent = htmlContent.replace(/\$status/, 'ONLINE');

        let setup = fs.existsSync('./node1');
        htmlContent = htmlContent.replace(/\$setup/, setup ? 'true' : 'false');

        if (setup) {
            let node1Address = fs.readFileSync('./node1/id').toString();
            htmlContent = htmlContent.replace(/\$node1Address/, node1Address);
            let node2Address = fs.readFileSync('./node2/id').toString();
            htmlContent = htmlContent.replace(/\$node2Address/, node2Address);
        }

        res.send(htmlContent);
    });
};

module.exports = {
    status
};