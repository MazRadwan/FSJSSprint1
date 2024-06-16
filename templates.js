const folders = ['models', 'views', 'routes', 'logs', 'json'];

const configjson = { 
    name: 'AppConfigCLI',
    version: '1.0.0',
    description: 'The Command Line Interface (CLI) for the MyApp.',
    main: 'myapp.js',
    superuser: 'admin',
    database: 'exampledb'
};

module.exports = {
    folders,
    configjson,
};