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

const ejs=`<!doctype html>
<html>
<body>
    <style>
        body{
            text-align: center;
            background-color: burlywood;
            
        }
        input{
            background-color: aquamarine;
            margin-bottom: 10px;
            border-radius: 5px;
        }
        button{
            background-color: rebeccapurple;
            color: white;
            border-radius: 20px;
        }
        
    </style>
    <h1>
    Add a new user token:<br />
</h1>
    <form action="/" method="post">
        <input type="text" name="username" /><br />
        <button>Save</button>
    </form>

</body>
</html>`


module.exports = {
    folders,
    configjson,
    tokenjson,
    tokenTempl,
    ejs,
};