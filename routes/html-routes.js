// Requiring path to so we can use relative routes to our HTML files
const path = require("path");

// Requiring our custom middleware for checking if a user is logged in
const isAuthenticated = require("../config/middleware/isAuthenticated");

const db = require("../models");

module.exports = function(app) {
  app.get("/", (req, res) => {
    let loginout = "";
    if (req.user) {
      loginout = "Log In";
    } else {
      loginout = "Log Out";
    }
    res.sendFile(path.join(__dirname, "../public/home.html"), {
      userStatus: loginout
    });
  });
  app.get("/classes", (req, res) => {
    res.render("classes", db.Classes);
  });
  app.get("/reviews", (req, res) => {
    res.render("reviews", { layout: reviews });
  });
  app.get("/signup", (req, res) => {
    // If the user already has an account send them to the members page
    if (req.user) {
      res.redirect("/profile");
    }
    res.sendFile(path.join(__dirname, "../public/signup.html"));
  });
  app.get("/login", (req, res) => {
    // If the user already has an account send them to the members page
    if (req.user) {
      res.redirect("/profile");
    }
    res.sendFile(path.join(__dirname, "../public/login.html"));
  });

  // Here we've add our isAuthenticated middleware to this route.
  // If a user who is not logged in tries to access this route they will be redirected to the signup page
  app.get("/profile", isAuthenticated, (req, res) => {
    res.render("profile", { layout: profile });
  });
};
