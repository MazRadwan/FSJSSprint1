const fs = require("fs");
const crc32 = require("crc/crc32");
const myArgs = process.argv.slice(2);
const { format, add } = require("date-fns");
const { tokenTempl } = require("./templates");

function tokenCount() {
  if (DEBUG) console.log("--count");
  return new Promise(function (resolve, reject) {
    fs.readFile(__dirname + "/json/tokens.json", "utf-8", (err, data) => {
      if (err) {
        reject(err);
      } else {
        let tokens = JSON.parse(data);
        let count = tokens.length;
        console.log(`The amount of tokens are: ${count}`);
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
    if (error) throw error;
    let tokens = JSON.parse(data);
    tokens.push(newToken);
    let userTokens = JSON.stringify(tokens, null, 2);

    fs.writeFile(__dirname + "/json/tokens.json", userTokens, (err) => {
      if (err) console.log(err);
      else {
        console.log(`New token: ${newToken.token} was made`);
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
    if (error) throw error;
    let tokens = JSON.parse(data);
    let user = tokens.find((u) => u.username === username);
    if (user) {
      Object.assign(user, newData);
      fs.writeFile(
        __dirname + "/json/tokens.json",
        JSON.stringify(tokens, null, 2),
        "utf-8",
        (err) => {
          if (err) console.log(err);
          else {
            console.log(
              `user ${username} has been updated with ${JSON.stringify(
                newData
              )}`
            );
          }
        }
      );
    } else {
      console.log("A user with that username was not found");
    }
  });
}

function searchByUsername(username) {
  if (DEBUG) console.log("--search username");
  fs.readFile(__dirname + "/json/tokens.json", "utf-8", (err, data) => {
    if (err) throw err;

    let users = JSON.parse(data);
    let results = users.filter((user) => user.username === username);

    console.log(results.length > 0 ? results : "No users found.");
  });
}

function searchByEmail(email) {
  if (DEBUG) console.log("--search email");
  fs.readFile(__dirname + "/json/tokens.json", "utf-8", (err, data) => {
    if (err) throw err;

    let users = JSON.parse(data);
    let results = users.filter((user) => user.email === email);

    console.log(results.length > 0 ? results : "No users found.");
  });
}

function searchByPhone(phone) {
  if (DEBUG) console.log("--search phone");
  fs.readFile(__dirname + "/json/tokens.json", "utf-8", (err, data) => {
    if (err) throw err;

    let users = JSON.parse(data);
    let results = users.filter((user) => user.phone === phone);

    console.log(results.length > 0 ? results : "No users found.");
  });
}

function tokenApp() {
  if (DEBUG) console.log("tokenApp()");
  switch (myArgs[1]) {
    case "--count":
      tokenCount();
      break;
    case "--new":
      if (myArgs.length < 3) {
        console.log("ERROR: Invalid syntax");
      } else {
        newToken(myArgs[2]);
      }
      break;
    case "--upd":
      if (myArgs.length < 5) {
        console.log("ERROR: Invalid syntax");
      } else {
        const field = myArgs[2];
        const username = myArgs[3];
        const newValue = myArgs[4];
        if (field === "p") {
          updP(username, newValue);
        } else if (field === "e") {
          updE(username, newValue);
        } else {
          console.log("ERROR: Unknown update field");
        }
      }
      break;
    case "--search":
      if (myArgs.length < 4) {
        console.log("ERROR: Invalid syntax");
      } else {
        const field = myArgs[2];
        const query = myArgs[3];
        if (field === "u") {
          searchByUsername(query);
        } else if (field === "e") {
          searchByEmail(query);
        } else if (field === "p") {
          searchByPhone(query);
        } else {
          console.log("ERROR: Unknown search field");
        }
      }
      break;
    default:
      console.log(
        "Invalid token command. Use --help to see available options."
      );
      break;
  }
}

module.exports = {
  tokenApp,
  newToken,
};
