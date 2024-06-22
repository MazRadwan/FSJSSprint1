const fs = require("fs");
const fsPromise = require("fs").promises;
const path = require("path");
const myEmitter = require("./logEvents");

const myArgs = process.argv.slice(2);

const { folders, configjson, ejs } = require("./templates");

async function createDirectory(dirPath) {
  try {
    if (!fs.existsSync(dirPath)) {
      await fsPromise.mkdir(dirPath, { recursive: true });
      myEmitter.emit("log", "INFO", `Directory created: ${dirPath}`);
    }
  } catch (err) {
    console.log(`Error creating directory ${dirPath}:`, err);
    myEmitter.emit("log", "ERROR", `Failed to create directory: ${dirPath}`);
  }
}

async function makeFiles() {
  if (DEBUG) console.log("init.makeFiles");

  // Ensure directories exist
  await createDirectory(path.join(__dirname, "json"));
  await createDirectory(path.join(__dirname, "views"));

  try {
    // Initialize tokens.json with an empty array
    let initialTokensData = JSON.stringify([], null, 2);
    let tokensFileName = "./json/tokens.json";
    if (!fs.existsSync(path.join(__dirname, tokensFileName))) {
      await fsPromise.writeFile(tokensFileName, initialTokensData);
      myEmitter.emit("log", "INFO", `File created: ${tokensFileName}`);
    } else {
      console.log("tokens.json already exists");
    }

    // Initialize config.json with configjson data
    let configData = JSON.stringify(configjson, null, 2);
    let configFileName = "./json/config.json";
    if (!fs.existsSync(path.join(__dirname, configFileName))) {
      await fsPromise.writeFile(configFileName, configData);
      myEmitter.emit("log", "INFO", `File created: ${configFileName}`);
    } else {
      console.log("config.json already exists");
    }

    // Initialize newTokens.ejs with ejs template data
    let ejsData = ejs;
    let ejsFileName = "./views/newTokens.ejs";
    if (!fs.existsSync(path.join(__dirname, ejsFileName))) {
      await fsPromise.writeFile(ejsFileName, ejsData);
      myEmitter.emit("log", "INFO", `File created: ${ejsFileName}`);
    } else {
      console.log("newTokens.ejs already exists");
    }
  } catch (err) {
    console.log(err);
    myEmitter.emit("log", "ERROR", `Failed to create files: ${err.message}`);
  }
}

async function makeFolders() {
  if (DEBUG) console.log("init.makeFolders");
  let mkcount = 0;
  for (const folder of folders) {
    if (DEBUG) console.log(folder);
    try {
      if (!fs.existsSync(path.join(__dirname, folder))) {
        await fsPromise.mkdir(path.join(__dirname, folder));
        myEmitter.emit("log", "INFO", `Folder created: ${folder}`);
        mkcount++;
      }
    } catch (err) {
      console.log(err);
      myEmitter.emit(
        "log",
        "ERROR",
        `Failed to create folder ${folder}: ${err.message}`
      );
    }
  }
  if (mkcount === 0) {
    console.log("All folders already exist");
  } else {
    console.log(mkcount + " folders made");
    myEmitter.emit("log", "INFO", `${mkcount} folders created`);
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
      await makeFiles();
      myEmitter.emit("log", "INFO", "Application files created");
      break;
    case "--mk":
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
