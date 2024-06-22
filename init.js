const fs = require("fs");
const fsPromise = require("fs").promises;
const path = require("path");

const myArgs = process.argv.slice(2);

const { folders, configjson, ejs } = require("./templates");

async function createDirectory(dirPath) {
  try {
    if (!fs.existsSync(dirPath)) {
      await fsPromise.mkdir(dirPath, { recursive: true });
    }
  } catch (err) {
    console.log(`Error creating directory ${dirPath}:`, err);
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
      console.log("Initialized tokens.json with an empty array.");
    } else {
      console.log("tokens.json already exists");
    }

    // Initialize config.json with configjson data
    let configData = JSON.stringify(configjson, null, 2);
    let configFileName = "./json/config.json";
    if (!fs.existsSync(path.join(__dirname, configFileName))) {
      await fsPromise.writeFile(configFileName, configData);
      console.log("Data written to config file.");
    } else {
      console.log("config.json already exists");
    }

    // Initialize newTokens.ejs with ejs template data
    let ejsData = ejs;
    let ejsFileName = "./views/newTokens.ejs";
    if (!fs.existsSync(path.join(__dirname, ejsFileName))) {
      await fsPromise.writeFile(ejsFileName, ejsData);
      console.log("Data written to newToken file.");
    } else {
      console.log("newTokens.ejs already exists");
    }
  } catch (err) {
    console.log(err);
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
        mkcount++;
      }
    } catch (err) {
      console.log(err);
    }
  }
  if (mkcount === 0) {
    console.log("All folders already exist");
  } else {
    console.log(mkcount + " folders made");
  }
}

async function initApp() {
  if (DEBUG) console.log("initApp");
  if (!myArgs[1]) {
    await makeFolders();
    await makeFiles();
    return;
  }
  switch (myArgs[1]) {
    case "--all":
      if (DEBUG) console.log("make all");
      await makeFolders();
      await makeFiles();
      break;
    case "--cat":
      await makeFiles();
      break;
    case "--mk":
      await makeFolders();
      break;
    default:
      console.log("Invalid init command. Use --help to see available options.");
      break;
  }
}

module.exports = {
  initApp,
};
