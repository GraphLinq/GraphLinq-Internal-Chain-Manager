const fs = require('fs');
const ethers = require('ethers');
const atob = require('atob');

const generateKeyStoreNode2 = async () => {
    const generatedWallet = ethers.Wallet.createRandom();

    let privateKey = generatedWallet.privateKey;
    let password = 'password-text-default';
    const wallet = new ethers.Wallet(privateKey);
    
    // works only with ethers@5.1.4
    const json = await wallet.encrypt(password, {
        scrypt: {
            // The number must be a power of 2 (default: 131072)
            N: 64
        }
    });
    return json;
}

const setup = (app, environement) => {
    app.post('/setup', async (req, res) => {
        try {
            let keyStoreNode1 = req.body['keyStoreNode1'];
            let keyStoreNode2 = await generateKeyStoreNode2();

            fs.mkdirSync('./node1');
            fs.mkdirSync('./node2');
            fs.mkdirSync('./node1/keystore');
            fs.mkdirSync('./node2/keystore');

            let jsonKeyStoreNode1 = JSON.parse(keyStoreNode1);
            let jsonKeyStoreNode2 = JSON.parse(keyStoreNode2);

            fs.writeFileSync(`./node1/id`, jsonKeyStoreNode1.address);
            fs.writeFileSync(`./node2/id`, jsonKeyStoreNode2.address);

            fs.writeFileSync(`./node1/keystore/UTC--${(new Date()).toISOString()}--${jsonKeyStoreNode1.address}`, keyStoreNode1);
            fs.writeFileSync(`./node2/keystore/UTC--${(new Date()).toISOString()}--${jsonKeyStoreNode2.address}`, keyStoreNode2);

            res.send({
                status: 'ready'
            });
        } catch (e) {
            res.send({
                status: 'ko'
            });
            console.log(e);
        }
    });
};

module.exports = {
    setup
};