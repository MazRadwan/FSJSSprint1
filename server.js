global.DEBUG = process.env.DEBUG === "true";

Object.keys(require.cache).forEach(function (key) {
  delete require.cache[key];
});

const express = require("express");
const path = require("path");
const tokenRoutes = require("./routes/tokenRoutes");

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(express.urlencoded({ extended: false }));
app.use(express.json());
app.use(express.static(path.join(__dirname, "public")));

// View engine setup
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));

// Routes
app.get("/", (req, res) => {
  res.render("pages/home");
});

app.use("/token", tokenRoutes);

// 404 handler
app.use((req, res) => {
  res.status(404).render("pages/404");
});

// Error handler
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).render("pages/error", { error: err });
});

// Start server
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
  console.log("Views directory:", app.get("views"));
});
