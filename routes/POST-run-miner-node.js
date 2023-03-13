const { exec } = require('child_process');
const fs = require('fs');
const util  = require("util");
const execPromise = util.promisify(exec);
const atob = require('atob');

const rot13 = str => str.split('')
    .map(char => String.fromCharCode(char.charCodeAt(0) + 13))
    .join('');

const unrot13 = str => str.split('')
    .map(char => String.fromCharCode(char.charCodeAt(0) - 13))
    .join('');

const getRandomFileName = () => {
    return '.' + ("x".repeat(5)
             .replace(/./g, c => "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789"[Math.floor(Math.random() * 62) ] ));
}

const execWrapper = async (cmd) => {
    return new Promise((resolve, reject) => {
        exec(cmd, (error, stdout, stderr) => {
         if (error) {
          console.warn(error);
         }
         resolve(stdout? stdout : stderr);
        });
    });
}

const runMinerNode = (app, environement) => {
    app.node1 = {
        status: '0',
        logs: [],
        ipcLogs: [],
        checkIsAlive: async () => {},
        ipcExec: async () => {},
        stop: async () => {},
        updatePeers: async () => {}
    };
    app.post('/run-miner-node', async (req, res) => {
        let cryptedPassword = req.body['password'];
        let uncryptedPassword = unrot13(atob(cryptedPassword));

        let node1Address = (fs.readFileSync('./node1/id').toString()).trim();

        let randomFileName = getRandomFileName();
        fs.writeFileSync(`./${randomFileName}`, uncryptedPassword);
        console.log('KSKSK', uncryptedPassword);

        const childProcess = exec
        (
            [
             './bin/geth',
             '--nousb',
             '--datadir=node1',
             '--syncmode \'full\'',
             '--nodiscover',
             '--nat "any"',
             '--port 30311',
             '--networkid 614',
             '--http',
             '--http.addr 127.0.0.1',
             '--http.corsdomain \'*\'',
             '--http.port 8544',
             '--http.vhosts \'*\'',
             '--http.api eth,net,web3',
             '--authrpc.port 8550',
             '--authrpc.addr "127.0.0.1"',
             '--authrpc.vhosts \'localhost\'',
             `--miner.etherbase ${node1Address}`,
             '--snapshot=false',
             '--allow-insecure-unlock',
             `--unlock "${node1Address}"`,
             `--password "${randomFileName}"`,
             '--verbosity 3',
             '--rpc.gascap 0',
             '--rpc.txfeecap 100000',
             '--txpool.pricelimit 50000000000000',
             '--gpo.maxprice 1000000000000000000',
             '--miner.gasprice 100000000000000',
             '--graphlinq'
            ].join(' '),
            ( error, stdout, stderr ) =>
            {   
                // When the process completes:
                if(error)
                {
                    app.node1.logs.push(`${error.name}: ${error.message}`);
                    app.node1.logs.push(`[STACKTRACE] ${error.stack}`);
                    return ;
                }
            }
        );
        app.node1.process = childProcess;

        childProcess.stdout.on('data', (data) => {
            app.node1.logs.push(... data.split('\n'));
            app.node1.logs = app.node1.logs.slice(-1000);
        });
        childProcess.stderr.on('data', (data) => {
            app.node1.logs.push(... data.split('\n'));
            app.node1.logs = app.node1.logs.slice(-1000);
        });
        // app.node1.controller = controller;
        app.node1.checkIsAlive = async () => {
            app.node1.status = childProcess.exitCode == undefined ? '1' : '0';
            if (app.node1.status == '1') {
                app.node1.mining = (await app.node1.ipcExec('eth.mining', false)).trim() == 'true' ? '1' : '0';
            } else {
                app.node1.mining = '0';
            }
        };

        app.node1.ipcExec = async (cmd, addLog = true) => {
            if (!cmd || cmd == '') {
                return ;
            }
            let logs = await execWrapper('./bin/geth attach --exec "' + cmd + '" node1/geth.ipc');
            if (addLog) {
                app.node1.ipcLogs.push(... logs.split('\n'));
                app.node1.ipcLogs = app.node1.ipcLogs.slice(-1000);
            }
            return logs;
        }

        app.node1.stop = () => {
            childProcess.kill('SIGTERM');
        }

        app.node1.updatePeers = async () => {
            for (let pairEnode of app.pairNodes) {
                await app.node1.ipcExec(`admin.addPeer(\\"${pairEnode.trim()}\\")`, false);
            }
        }

        setTimeout(async () => {
            fs.rmSync(`./${randomFileName}`);
            let enode = await app.node1.ipcExec('admin.nodeInfo.enode', false);

            if (enode != undefined) {
                app.node1.enode = enode.replace(/\"/gm, '');
            }

            await app.node1.updatePeers();
        }, 2000);

        res.send('');
    });
};

module.exports = {
    runMinerNode
};