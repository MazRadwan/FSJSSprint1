const folders = ["logs", "json"];

const configjson = {
  name: "AppConfigCLI",
  version: "1.0.0",
  description: "The Command Line Interface (CLI) for the MyApp.",
  main: "myapp.js",
  superuser: "admin",
  database: "exampledb",
};

const tokenTempl = {
  created: "",
  username: "",
  email: "",
  phone: "",
  token: "token",
  expires: "",
};

// const ejs = `<!doctype html>
// <html>
// <body>
//     <style>
//         body{
//             text-align: center;
//             background-color: burlywood;

//         }
//         input{
//             background-color: aquamarine;
//             margin-bottom: 10px;
//             border-radius: 5px;
//         }
//         button{
//             background-color: rebeccapurple;
//             color: white;
//             border-radius: 20px;
//         }

//     </style>
//     <h1>
//     Add a new user token:<br />
// </h1>
//     <form action="/" method="post">
//         <input type="text" name="username" /><br />
//         <button>Save</button>
//     </form>

// </body>
// </html>`;

module.exports = {
  folders,
  configjson,
  tokenTempl,
};
