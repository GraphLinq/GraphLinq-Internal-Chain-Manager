import('./ethstats-cli/app-cli.mjs').then(mod =>
    mod.default({
        clientUrl: 'http://103.125.216.32:8545',
        serverUrl: 'http://165.192.111.62:3000',
        accountEmail: 'info@graphlinq.io',
        nodeName: 'GraphLinq_Chain_Node_Official_In_Docker_Manager',
        register: true,
    })
);