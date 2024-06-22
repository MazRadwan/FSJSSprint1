global.DEBUG = true; // Set to true if you want to enable debug logging

const fs = require("fs");
const path = require("path");

const myArgs = process.argv.slice(2);

const { initApp } = require("./init.js");
const { configApp } = require("./config.js");
const { tokenApp } = require("./token.js");
const { initHelp, configHelp, tokenHelp } = require("./helpTemplates");

function displayHelp(helpFile) {
  fs.readFile(helpFile, (error, data) => {
    if (error) {
      if (DEBUG)
        console.log("Help file not found or could not be read:", helpFile);
    } else {
      console.log(data.toString());
    }
  });
}

function createHelpFiles() {
  const helpDir = path.join(__dirname, "help");
  if (!fs.existsSync(helpDir)) {
    fs.mkdirSync(helpDir);
  }

  fs.writeFileSync(path.join(helpDir, "initHelp.txt"), initHelp);
  fs.writeFileSync(path.join(helpDir, "configHelp.txt"), configHelp);
  fs.writeFileSync(path.join(helpDir, "tokenHelp.txt"), tokenHelp);
}

// Create help files on startup
createHelpFiles();

if (DEBUG) if (myArgs.length >= 1) console.log("myArgs: ", myArgs);

switch (myArgs[0]) {
  case "init":
  case "i":
    if (!myArgs[1] || myArgs[1] === "--help") {
      if (DEBUG) console.log("this is the init help");
      displayHelp(path.join(__dirname, "help", "initHelp.txt"));
    } else {
      if (DEBUG) console.log("this is the init");
      initApp();
    }
    break;
  case "config":
  case "c":
    if (myArgs[1] === "--help") {
      if (DEBUG) console.log("this is the config help");
      displayHelp(path.join(__dirname, "help", "configHelp.txt"));
    } else {
      if (DEBUG) console.log("this is the config");
      configApp();
    }
    break;
  case "token":
  case "t":
    if (myArgs[1] === "--help") {
      if (DEBUG) console.log("this is the token help");
      displayHelp(path.join(__dirname, "help", "tokenHelp.txt"));
    } else {
      if (DEBUG) console.log("this is the token");
      tokenApp();
    }
    break;
  case "help":
  case "h":
  case "--help":
    if (DEBUG) console.log("this is the help");
    displayHelp(path.join(__dirname, "help.txt"));
    break;
  default:
    if (DEBUG) console.log("this is the default help");
    displayHelp(path.join(__dirname, "help.txt"));
    break;
}
