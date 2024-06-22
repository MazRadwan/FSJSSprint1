global.DEBUG = process.env.DEBUG === "true";
const express = require("express");
const path = require("path");
const myEmitter = require("./logEvents");
const tokenRoutes = require("./routes/tokenRoutes");
const { tokenCount } = require("./token");

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(express.urlencoded({ extended: false }));
app.use(express.json());
app.use(express.static(path.join(__dirname, "public")));

// Logging middleware for page access
app.use((req, res, next) => {
  myEmitter.emit("log", "PAGE_ACCESS", "INFO", `${req.method} ${req.url}`);
  next();
});

// Set EJS as the view engine
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));

// Routes
app.get("/", (req, res) => {
  res.redirect("/home");
});

app.get("/home", (req, res) => {
  res.render("pages/home");
});

app.use("/token", tokenRoutes);

app.get("/count", async (req, res) => {
  try {
    const count = await tokenCount();
    res.render("pages/count", { count });
  } catch (error) {
    myEmitter.emit(
      "log",
      "ERROR",
      `Error fetching token count: ${error.message}`,
      req
    );
    res.status(500).render("pages/error", { error });
  }
});

// 404 handler
app.use((req, res) => {
  myEmitter.emit("log", "NOT_FOUND", "WARN", `404 - ${req.method} ${req.url}`);
  res.status(404).render("pages/404");
});

// Error handler
app.use((err, req, res, next) => {
  console.error(err.stack);
  myEmitter.emit("log", "SERVER_ERROR", "ERROR", `${err.name}: ${err.message}`);
  res.status(500).render("pages/error", { error: err });
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
  myEmitter.emit(
    "log",
    "SERVER_START",
    "INFO",
    `Server started on port ${PORT}`
  );
});

module.exports = app;
