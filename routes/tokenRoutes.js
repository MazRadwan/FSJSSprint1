const express = require("express");
const router = express.Router();
const path = require("path");
const fs = require("fs");
const { newToken } = require("../token");

router.get("/", (req, res, next) => {
  const viewPath = path.join(__dirname, "..", "views", "pages", "newToken.ejs");
  console.log("Attempting to render:", viewPath);

  if (fs.existsSync(viewPath)) {
    console.log("File exists:", viewPath);
  } else {
    console.log("File does not exist:", viewPath);
  }

  try {
    res.render("pages/newToken");
  } catch (error) {
    next(error);
  }
});

router.post("/", (req, res, next) => {
  try {
    const { username } = req.body;
    const token = newToken(username);
    res.render("pages/token", { username, token });
  } catch (error) {
    next(error);
  }
});

module.exports = router;
