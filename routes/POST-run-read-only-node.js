const fs = require('fs');

const getHtmlContent = (environement) => {
    let content = (fs.readFileSync('./html/status.html')).toString();

    content = content.replace(/\$password/, environement.password);
    return content;
}

const status = (app, environement) => {
    app.post('/run-read-only-node', async (req, res) => {
        let htmlContent = getHtmlContent(environement);

        htmlContent = htmlContent.replace(/\$status/, 'ONLINE');
        
        res.send(htmlContent);
    });
};

module.exports = {
    status
};