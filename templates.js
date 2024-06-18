const folders = ['models', 'views', 'routes', 'logs', 'json'];

const configjson = { 
    name: 'AppConfigCLI',
    version: '1.0.0',
    description: 'The Command Line Interface (CLI) for the MyApp.',
    main: 'myapp.js',
    superuser: 'admin',
    database: 'exampledb'
};


const tokenTempl = {
    created: '1969-01-31 12:30:00',
    username: 'username',
    email: 'user@example.com',
    phone: '5556597890',
    token: 'token',
    expires: '1969-02-03 12:30:00'
  };

const tokenjson = [{
    created: '1969-01-31 12:30:00',
    username: 'username',
    email: 'user@example.com',
    phone: '5556597890',
    token: 'token',
    expires: '1969-02-03 12:30:00'
  }];

module.exports = {
    folders,
    configjson,
    tokenjson,
    tokenTempl,
};