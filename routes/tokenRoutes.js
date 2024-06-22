const express = require("express");
const router = express.Router();
const { newToken } = require("../token");
const myEmitter = require("../logEvents");

// GET route for the token creation form
router.get("/", (req, res, next) => {
  try {
    myEmitter.emit("log", "INFO", "Token creation form accessed", req);
    res.render("pages/newToken");
  } catch (error) {
    myEmitter.emit(
      "log",
      "ERROR",
      `Error rendering token form: ${error.message}`,
      req
    );
    next(error);
  }
});

// POST route for creating a new token
router.post("/", (req, res, next) => {
  try {
    const { username } = req.body;
    if (!username) {
      myEmitter.emit(
        "log",
        "WARN",
        "Token creation attempted without username",
        req
      );
      return res.status(400).send("Username is required");
    }
    const token = newToken(username);
    myEmitter.emit("log", "INFO", `Token created for user: ${username}`, req);
    res.render("pages/token", { username, token });
  } catch (error) {
    myEmitter.emit(
      "log",
      "ERROR",
      `Error creating token: ${error.message}`,
      req
    );
    next(error);
  }
});

// Example of another route, e.g., for validating a token
router.get("/validate/:token", (req, res, next) => {
  try {
    const { token } = req.params;
    // Assume we have a validateToken function
    const isValid = validateToken(token);
    myEmitter.emit(
      "log",
      "INFO",
      `Token validation attempt for: ${token}`,
      req
    );
    res.json({ isValid });
  } catch (error) {
    myEmitter.emit(
      "log",
      "ERROR",
      `Error validating token: ${error.message}`,
      req
    );
    next(error);
  }
});

// Error handling middleware
router.use((err, req, res, next) => {
  myEmitter.emit("log", "ERROR", `Token route error: ${err.message}`, req);
  res.status(500).render("pages/error", { error: err });
});

module.exports = router;
