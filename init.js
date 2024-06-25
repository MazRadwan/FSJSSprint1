global.DEBUG = process.env.DEBUG === "true";

const fs = require("fs");
const fsPromise = require("fs").promises;
const path = require("path");
const myEmitter = require("./logEvents");

const { folders, configjson } = require("./templates");

const myArgs = process.argv.slice(2);

async function createDirectory(folder) {
  const dirPath = path.join(__dirname, folder);
  try {
    if (!fs.existsSync(dirPath)) {
      await fsPromise.mkdir(dirPath, { recursive: true });
      console.log(`Directory created: ${folder}`);
      myEmitter.emit("log", "INFO", `Directory created: ${folder}`);
    } else {
      console.log(`Directory already exists: ${folder}`);
      myEmitter.emit("log", "INFO", `Directory already exists: ${folder}`);
    }
  } catch (err) {
    console.log(`Error creating directory ${folder}:`, err);
    myEmitter.emit("log", "ERROR", `Failed to create directory: ${folder}`);
  }
}

async function makeFolders() {
  if (DEBUG) console.log("init.makeFolders");
  let createdFolders = [];
  let existingFolders = [];
  for (const folder of folders) {
    if (DEBUG) console.log(folder);
    await createDirectory(folder);
    const dirPath = path.join(__dirname, folder);
    if (fs.existsSync(dirPath)) {
      createdFolders.push(folder);
    } else {
      existingFolders.push(folder);
    }
  }
  if (createdFolders.length > 0) {
    console.log(
      `${createdFolders.length} folders created: ${createdFolders.join(", ")}`
    );
    myEmitter.emit(
      "log",
      "INFO",
      `${createdFolders.length} folders created: ${createdFolders.join(", ")}`
    );
  }
  if (existingFolders.length > 0) {
    console.log(`Existing folders: ${existingFolders.join(", ")}`);
    myEmitter.emit(
      "log",
      "INFO",
      `Existing folders: ${existingFolders.join(", ")}`
    );
  }
}
async function makeFiles() {
  if (DEBUG) console.log("init.makeFiles");

  try {
    const jsonDir = path.join(__dirname, "json");

    // Check if json directory exists
    if (!fs.existsSync(jsonDir)) {
      console.log(
        "Error: 'json' directory does not exist. Please run 'init --mk' first."
      );
      myEmitter.emit("log", "ERROR", "'json' directory does not exist");
      return;
    }

    // Initialize tokens.json with an empty array
    let initialTokensData = JSON.stringify([], null, 2);
    let tokensFileName = path.join(jsonDir, "tokens.json");
    if (!fs.existsSync(tokensFileName)) {
      await fsPromise.writeFile(tokensFileName, initialTokensData);
      console.log(`File created: tokens.json`);
      myEmitter.emit("log", "INFO", `File created: tokens.json`);
    } else {
      console.log("tokens.json already exists");
    }

    // Initialize config.json with configjson data
    let configData = JSON.stringify(configjson, null, 2);
    let configFileName = path.join(jsonDir, "config.json");
    if (!fs.existsSync(configFileName)) {
      await fsPromise.writeFile(configFileName, configData);
      console.log(`File created: config.json`);
      myEmitter.emit("log", "INFO", `File created: config.json`);
    } else {
      console.log("config.json already exists");
    }
  } catch (err) {
    console.log(err);
    myEmitter.emit("log", "ERROR", `Failed to create files: ${err.message}`);
  }
}

async function initApp() {
  if (DEBUG) console.log("initApp");
  if (!myArgs[1]) {
    await makeFolders();
    await makeFiles();
    myEmitter.emit("log", "INFO", "Application initialized");
    return;
  }
  switch (myArgs[1]) {
    case "--all":
      if (DEBUG) console.log("make all");
      await makeFolders();
      await makeFiles();
      myEmitter.emit("log", "INFO", "Application fully initialized");
      break;
    case "--cat":
      if (DEBUG) console.log("make files only");
      await makeFiles();
      myEmitter.emit("log", "INFO", "Application files created");
      break;
    case "--mk":
      if (DEBUG) console.log("make folders only");
      await makeFolders();
      myEmitter.emit("log", "INFO", "Application folders created");
      break;
    default:
      console.log("Invalid init command. Use --help to see available options.");
      myEmitter.emit("log", "WARN", "Invalid init command used");
      break;
  }
}

module.exports = {
  initApp,
};
