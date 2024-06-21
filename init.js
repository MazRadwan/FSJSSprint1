const fs = require("fs");
const fsPromise = require("fs").promises;
const path = require("path");

const myArgs = process.argv.slice(2);

const { folders, configjson, tokenjson, ejs } = require("./templates");

async function updateStatus(status) {
  await fsPromise.writeFile("./status.json", JSON.stringify(status, null, 2));
}

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
  let status = {
    initialized: false,
    filesCreated: false,
    foldersCreated: false,
    error: null,
  };

  await createDirectory(path.join(__dirname, "json"));
  await createDirectory(path.join(__dirname, "views"));

  try {
    let configdata = JSON.stringify(configjson, null, 2);
    let fileName = "./json/config.json";
    if (!fs.existsSync(path.join(__dirname, fileName))) {
      await fsPromise.writeFile(fileName, configdata);
      console.log("Data written to config file.");
      status.filesCreated = true;
    } else {
      console.log("file already exists");
      status.filesCreated = true;
    }
  } catch (err) {
    console.log(err);
    status.error = err.message;
  }

  try {
    let configdata = JSON.stringify(tokenjson, null, 2);
    let fileName = "./json/tokens.json";
    if (!fs.existsSync(path.join(__dirname, fileName))) {
      await fsPromise.writeFile(fileName, configdata);
      console.log("Data written to token file.");
      status.filesCreated = true;
    } else {
      console.log("file already exists");
      status.filesCreated = true;
    }
  } catch (err) {
    console.log(err);
    status.error = err.message;
  }

  try {
    let configdata = ejs;
    let fileName = "./views/newTokens.ejs";
    if (!fs.existsSync(path.join(__dirname, fileName))) {
      await fsPromise.writeFile(fileName, configdata);
      console.log("Data written to newToken file.");
      status.filesCreated = true;
    } else {
      console.log("file already exists");
      status.filesCreated = true;
    }
  } catch (err) {
    console.log(err);
    status.error = err.message;
  }

  // Create help.txt
  try {
    const helpContent = `myapp <command> <option>

Usage:

myapp --help          displays help

myapp init --help     displays help for the init command
myapp init --mk       creates all the app folders
myapp init --cat      creates the config file with default settings and the help files
myapp init --all      creates all the folders and files

myapp config          create or change the app configuration
myapp config --show   show the contents of the config file
myapp config --reset  reset back to default the config file
myapp config --set <option> <value>  set a specific attribute of the config file

myapp token           manage the user tokens
myapp token --count   provide a count of all the tokens
myapp token --new <username>   add a new token
myapp token --upd p <username> <phone>  updates a JSON entry with new phone number
myapp token --upd e <username> <email>  updates a JSON entry with new email number
myapp token --search u <username>  gets a token for a given username
myapp token --search e <email>  gets a token for a given email
myapp token --search p <phone>  gets a token for a given phone number

myapp status          shows the current status of initialization and configuration`;
    await fsPromise.writeFile("./help.txt", helpContent);
    console.log("Data written to help.txt");
  } catch (err) {
    console.log(err);
    status.error = err.message;
  }

  // Create initHelp.txt
  try {
    const initHelpContent = `Usage: myapp init <option>

Options:
  --help      displays help for the init command
  --mk        creates all the app folders
  --cat       creates the config file with default settings and the help files
  --all       creates all the folders and files`;
    await fsPromise.writeFile("./initHelp.txt", initHelpContent);
    console.log("Data written to initHelp.txt");
  } catch (err) {
    console.log(err);
    status.error = err.message;
  }

  return status;
}

async function makeFolders() {
  if (DEBUG) console.log("init.makeFolders");
  let status = {
    initialized: false,
    filesCreated: false,
    foldersCreated: false,
    error: null,
  };
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
      status.error = err.message;
    }
  }
  if (mkcount === 0) {
    console.log("All folders already exist");
  } else {
    console.log(mkcount + " folders made");
    status.foldersCreated = true;
  }

  return status;
}

async function initApp() {
  if (DEBUG) console.log("initApp");
  let status = {
    initialized: false,
    filesCreated: false,
    foldersCreated: false,
    error: null,
  };
  if (!myArgs[1]) {
    const folderStatus = await makeFolders();
    const fileStatus = await makeFiles();
    status.foldersCreated = folderStatus.foldersCreated;
    status.filesCreated = fileStatus.filesCreated;
    status.initialized = true;
    await updateStatus(status);
    return;
  }
  switch (myArgs[1]) {
    case "--all":
      if (DEBUG) console.log("make all");
      const folderStatusAll = await makeFolders();
      const fileStatusAll = await makeFiles();
      status.foldersCreated = folderStatusAll.foldersCreated;
      status.filesCreated = fileStatusAll.filesCreated;
      status.initialized = true;
      await updateStatus(status);
      break;
    case "--cat":
      const fileStatusCat = await makeFiles();
      status.filesCreated = fileStatusCat.filesCreated;
      status.initialized = true;
      await updateStatus(status);
      break;
    case "--mk":
      const folderStatusMk = await makeFolders();
      status.foldersCreated = folderStatusMk.foldersCreated;
      status.initialized = true;
      await updateStatus(status);
      break;
    default:
      console.log("Invalid init command. Use --help to see available options.");
      status.error = "Invalid init command";
      await updateStatus(status);
      break;
  }
}

module.exports = {
  initApp,
};
