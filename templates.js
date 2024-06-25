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

module.exports = {
  folders,
  configjson,
  tokenTempl,
};
