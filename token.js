const fs = require("fs");
const crc32 = require("crc/crc32");
const myArgs = process.argv.slice(2);
const { format, add } = require("date-fns");
const { tokenTempl } = require("./templates");
const myEmitter = require("./logEvents");

function tokenCount() {
  if (DEBUG) console.log("--count");
  return new Promise(function (resolve, reject) {
    fs.readFile(__dirname + "/json/tokens.json", "utf-8", (err, data) => {
      if (err) {
        reject(err);
        myEmitter.emit(
          "log",
          "ERROR",
          `Failed to read tokens file: ${err.message}`
        );
      } else {
        let tokens = JSON.parse(data);
        let count = tokens.length;
        console.log(`The amount of tokens are: ${count}`);
        myEmitter.emit("log", "INFO", `Token count: ${count}`);
        resolve(count);
      }
    });
  });
}

function newToken(username) {
  if (DEBUG) console.log("--new");
  let newToken = { ...tokenTempl };
  let now = new Date();
  let expire = add(now, { days: 3 });

  newToken.created = format(now, "dd-MM-yyyy ss:mm:HH");
  newToken.username = username;
  newToken.token = crc32(username).toString(8);
  newToken.expires = format(expire, "dd-MM-yyyy ss:mm:HH");

  fs.readFile(__dirname + "/json/tokens.json", "utf-8", (error, data) => {
    if (error) {
      myEmitter.emit(
        "log",
        "ERROR",
        `Failed to read tokens file: ${error.message}`
      );
      throw error;
    }
    let tokens = JSON.parse(data);
    tokens.push(newToken);
    let userTokens = JSON.stringify(tokens, null, 2);

    fs.writeFile(__dirname + "/json/tokens.json", userTokens, (err) => {
      if (err) {
        console.log(err);
        myEmitter.emit(
          "log",
          "ERROR",
          `Failed to write new token: ${err.message}`
        );
      } else {
        console.log(`New token: ${newToken.token} was made`);
        myEmitter.emit(
          "log",
          "INFO",
          `New token created for user: ${username}`
        );
      }
    });
  });
  return newToken.token;
}

function updP(username, phone) {
  if (DEBUG) console.log("--upd phone");
  upd(username, { phone: phone });
}

function updE(username, email) {
  if (DEBUG) console.log("--upd email");
  upd(username, { email: email });
}

function upd(username, newData) {
  if (DEBUG) console.log("upd()");
  fs.readFile(__dirname + "/json/tokens.json", "utf-8", (error, data) => {
    if (error) {
      myEmitter.emit(
        "log",
        "ERROR",
        `Failed to read tokens file for update: ${error.message}`
      );
      throw error;
    }
    let tokens = JSON.parse(data);
    let user = tokens.find((u) => u.username === username);
    if (user) {
      Object.assign(user, newData);
      fs.writeFile(
        __dirname + "/json/tokens.json",
        JSON.stringify(tokens, null, 2),
        "utf-8",
        (err) => {
          if (err) {
            console.log(err);
            myEmitter.emit(
              "log",
              "ERROR",
              `Failed to update user ${username}: ${err.message}`
            );
          } else {
            console.log(
              `user ${username} has been updated with ${JSON.stringify(
                newData
              )}`
            );
            myEmitter.emit(
              "log",
              "INFO",
              `User ${username} updated with ${JSON.stringify(newData)}`
            );
          }
        }
      );
    } else {
      console.log("A user with that username was not found");
      myEmitter.emit(
        "log",
        "WARN",
        `Update attempted for non-existent user: ${username}`
      );
    }
  });
}

function searchByUsername(username) {
  if (DEBUG) console.log("--search username");
  fs.readFile(__dirname + "/json/tokens.json", "utf-8", (err, data) => {
    if (err) {
      myEmitter.emit(
        "log",
        "ERROR",
        `Failed to read tokens file for username search: ${err.message}`
      );
      throw err;
    }

    let users = JSON.parse(data);
    let results = users.filter((user) => user.username === username);

    console.log(results.length > 0 ? results : "No users found.");
    myEmitter.emit(
      "log",
      "INFO",
      `Username search for ${username}: ${results.length} results found`
    );
  });
}

function searchByEmail(email) {
  if (DEBUG) console.log("--search email");
  fs.readFile(__dirname + "/json/tokens.json", "utf-8", (err, data) => {
    if (err) {
      myEmitter.emit(
        "log",
        "ERROR",
        `Failed to read tokens file for email search: ${err.message}`
      );
      throw err;
    }

    let users = JSON.parse(data);
    let results = users.filter((user) => user.email === email);

    console.log(results.length > 0 ? results : "No users found.");
    myEmitter.emit(
      "log",
      "INFO",
      `Email search for ${email}: ${results.length} results found`
    );
  });
}

function searchByPhone(phone) {
  if (DEBUG) console.log("--search phone");
  fs.readFile(__dirname + "/json/tokens.json", "utf-8", (err, data) => {
    if (err) {
      myEmitter.emit(
        "log",
        "ERROR",
        `Failed to read tokens file for phone search: ${err.message}`
      );
      throw err;
    }

    let users = JSON.parse(data);
    let results = users.filter((user) => user.phone === phone);

    console.log(results.length > 0 ? results : "No users found.");
    myEmitter.emit(
      "log",
      "INFO",
      `Phone search for ${phone}: ${results.length} results found`
    );
  });
}

function tokenApp() {
  if (DEBUG) console.log("tokenApp()");
  switch (myArgs[1]) {
    case "--count":
      tokenCount();
      myEmitter.emit("log", "INFO", "Token count requested");
      break;
    case "--new":
      if (myArgs.length < 3) {
        console.log("ERROR: Invalid syntax");
        myEmitter.emit("log", "WARN", "Invalid syntax for new token command");
      } else {
        newToken(myArgs[2]);
        myEmitter.emit(
          "log",
          "INFO",
          `New token requested for user: ${myArgs[2]}`
        );
      }
      break;
    case "--upd":
      if (myArgs.length < 5) {
        console.log("ERROR: Invalid syntax");
        myEmitter.emit(
          "log",
          "WARN",
          "Invalid syntax for update token command"
        );
      } else {
        const field = myArgs[2];
        const username = myArgs[3];
        const newValue = myArgs[4];
        if (field === "p") {
          updP(username, newValue);
          myEmitter.emit(
            "log",
            "INFO",
            `Phone update requested for user: ${username}`
          );
        } else if (field === "e") {
          updE(username, newValue);
          myEmitter.emit(
            "log",
            "INFO",
            `Email update requested for user: ${username}`
          );
        } else {
          console.log("ERROR: Unknown update field");
          myEmitter.emit("log", "WARN", `Unknown update field: ${field}`);
        }
      }
      break;
    case "--search":
      if (myArgs.length < 4) {
        console.log("ERROR: Invalid syntax");
        myEmitter.emit(
          "log",
          "WARN",
          "Invalid syntax for search token command"
        );
      } else {
        const field = myArgs[2];
        const query = myArgs[3];
        if (field === "u") {
          searchByUsername(query);
          myEmitter.emit("log", "INFO", `Token search by username: ${query}`);
        } else if (field === "e") {
          searchByEmail(query);
          myEmitter.emit("log", "INFO", `Token search by email: ${query}`);
        } else if (field === "p") {
          searchByPhone(query);
          myEmitter.emit("log", "INFO", `Token search by phone: ${query}`);
        } else {
          console.log("ERROR: Unknown search field");
          myEmitter.emit("log", "WARN", `Unknown search field: ${field}`);
        }
      }
      break;
    default:
      console.log(
        "Invalid token command. Use --help to see available options."
      );
      myEmitter.emit("log", "WARN", "Invalid token command used");
      break;
  }
}

module.exports = {
  tokenApp,
  newToken,
};
