const fs = require("fs");
const path = require("path");
const myEmitter = require("./logEvents");

const myArgs = process.argv.slice(2);

const configFilePath = path.join(__dirname, "json", "config.json");
const defaultConfig = {
  database: {
    host: "localhost",
    port: 5432,
    user: "myuser",
    password: "mypassword",
    database: "exampledb",
  },
  server: {
    port: 3000,
  },
  debug: true,
};

function getConfig() {
  if (fs.existsSync(configFilePath)) {
    const configFile = fs.readFileSync(configFilePath);
    return JSON.parse(configFile);
  } else {
    myEmitter.emit(
      "log",
      "WARN",
      "Config file not found, using default config"
    );
    return null;
  }
}

function setConfig(config) {
  fs.writeFileSync(configFilePath, JSON.stringify(config, null, 2));
  myEmitter.emit("log", "INFO", "Config file updated");
}

function configApp() {
  const command = myArgs[1];
  let config;

  switch (command) {
    case "--show":
      config = getConfig();
      if (config) {
        console.log(config);
        myEmitter.emit("log", "INFO", "Config displayed");
      } else {
        console.log("Config file not found.");
        myEmitter.emit("log", "WARN", "Attempted to show non-existent config");
      }
      break;
    case "--reset":
      setConfig(defaultConfig);
      console.log("Config has been reset to default.");
      myEmitter.emit("log", "INFO", "Config reset to default");
      break;
    case "--set":
      const key = myArgs[2];
      const value = myArgs[3];
      config = getConfig() || defaultConfig;
      config[key] = value;
      setConfig(config);
      console.log(`Set ${key} to ${value} in config.`);
      myEmitter.emit("log", "INFO", `Config updated: ${key} set to ${value}`);
      break;
    default:
      console.log("Invalid config command.");
      myEmitter.emit("log", "WARN", "Invalid config command used");
      break;
  }
}

module.exports = {
  configApp,
  DEBUG: true,
};
