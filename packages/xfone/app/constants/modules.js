const ModulesApp = [
    {
        moduleName: 'SUPERXFONE',
        featureName: 'LiveStream'
    },
    {
        moduleName: 'SUPERXFONE',
        featureName: 'CallCenter'
    },
    {
        moduleName: 'SUPERXFONE',
        featureName: 'Comment'
    }
];

const portsModule = [
    {
        name: 'LiveStream',
        port: 9000
    },
    {
        name: 'CallCenter',
        port: 9001
    },
    {
        name: 'Comment',
        port: 9001
    }
];

export { ModulesApp, portsModule };
