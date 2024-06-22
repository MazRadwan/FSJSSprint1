const fs = require("fs");
const fsPromises = require("fs").promises;
const path = require("path");
const { format } = require("date-fns");
const { v4: uuid } = require("uuid");

const EventEmitter = require("events");
class MyEmitter extends EventEmitter {}
const myEmitter = new MyEmitter();

myEmitter.on("log", async (level, message, req = null) => {
  const dateTime = format(new Date(), "yyyyMMdd\tHH:mm:ss");
  let logItem = `${dateTime}\t${level}\t${message}\t${uuid()}`;

  // Express-specific information if request object is provided
  if (req) {
    const { method, url, ip } = req;
    logItem += `\t${method}\t${url}\t${ip}`;
  }

  try {
    const logsDir = path.join(__dirname, "logs");
    const yearDir = path.join(logsDir, format(new Date(), "yyyy"));
    const monthDir = path.join(yearDir, format(new Date(), "MM"));

    // Create directory structure if it doesn't exist
    await fsPromises.mkdir(logsDir, { recursive: true });
    await fsPromises.mkdir(yearDir, { recursive: true });
    await fsPromises.mkdir(monthDir, { recursive: true });

    const fileName = `${format(new Date(), "yyyyMMdd")}_${
      level === "ERROR" ? "errors" : "events"
    }.log`;
    await fsPromises.appendFile(path.join(monthDir, fileName), logItem + "\n");

    if (DEBUG) console.log(logItem);
  } catch (err) {
    console.error("Error writing to log file:", err);
  }
});

module.exports = myEmitter;
