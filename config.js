const fs = require("fs");
const fsPromise = require("fs").promises;

const myArgs = process.argv.slice(2);

async function resetConfig() {
  const defaultStatus = {
    initialized: false,
    filesCreated: false,
    foldersCreated: false,
    error: null,
  };

  try {
    await fsPromise.writeFile(
      "./status.json",
      JSON.stringify(defaultStatus, null, 2)
    );
    console.log("Status has been reset to default.");
  } catch (err) {
    console.log("Error resetting status:", err);
  }
}

async function setConfig(attribute, value) {
  try {
    const data = await fsPromise.readFile("./status.json", "utf-8");
    const config = JSON.parse(data);

    // Convert value to boolean if necessary
    if (value === "true") {
      value = true;
    } else if (value === "false") {
      value = false;
    }

    if (config.hasOwnProperty(attribute)) {
      config[attribute] = value;
      await fsPromise.writeFile(
        "./status.json",
        JSON.stringify(config, null, 2)
      );
      console.log(
        `Configuration attribute ${attribute} has been set to ${value}.`
      );
    } else {
      console.log(`Attribute ${attribute} not found in configuration.`);
    }
  } catch (err) {
    console.log("Error setting configuration:", err);
  }
}

function configApp() {
  if (DEBUG) console.log("configApp()");
  switch (myArgs[1]) {
    case "--show":
      fs.readFile(__dirname + "/status.json", (error, data) => {
        if (error) {
          console.log("Status file not found or could not be read.");
        } else {
          console.log("Initialization and Configuration Status:");
          console.log(data.toString());
        }
      });
      break;
    case "--reset":
      resetConfig();
      break;
    case "--set":
      if (myArgs.length < 4) {
        console.log(
          "ERROR: Invalid syntax. Usage: config --set <attribute> <value>"
        );
      } else {
        setConfig(myArgs[2], myArgs[3]);
      }
      break;
    default:
      console.log(
        "Invalid config command. Use --help to see available options."
      );
      break;
  }
}

module.exports = {
  configApp,
};
