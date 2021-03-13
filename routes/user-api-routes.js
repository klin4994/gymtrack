// Requiring our models and passport as we've configured it
const db = require("../models");
const passport = require("../config/passport");

module.exports = function(app) {
  // Using the passport.authenticate middleware with our local strategy.
  // If the user has valid login credentials, send them to the members page.
  // Otherwise the user will be sent an error

  // Route for login
  app.post("/api/login", passport.authenticate("local"), (req, res) => {
    res.json(req.user);
  });

  // Route for signup
  app.post("/api/signup", (req, res) => {
    db.user
      .create({
        firstName: req.body.firstName,
        lastName: req.body.lastName,
        dob: req.body.dob,
        email: req.body.email,
        password: req.body.password
      })
      .then(() => {
        res.redirect("/profile");
      })
      .catch(err => {
        res.status(401).json(err);
      });
  });

  // Route for get member data, for the one that's logged in
  app.get("/api/user_data", (req, res) => {
    if (!req.user) {
      // The user is not logged in, send back an empty object
      res.json({});
    } else {
      // Otherwise send back the user's info
      res.json({
        firstName: req.user.firstName,
        lastName: req.user.lastName,
        dob: req.user.dob,
        email: req.user.email,
        instructor: req.user.instructor
      });
    }

    // **************** ALL BELOW DON'T WORK FOR NOW, JUST IGNORE **************
    // // Route for logging user out
    // app.get("/logout", (req, res) => {
    //   req.logout();
    //   res.redirect("/");
    // });

    // // Route for getting some data about our user to be used client side
    // app.get("/api/user_data", (req, res) => {
    //   if (!req.user) {
    //     // The user is not logged in, send back an empty object
    //     res.json({});
    //   } else {
    //     // Otherwise send back the user's email and id
    //     // Sending back a password, even a hashed password, isn't a good idea
    //     res.json({
    //       email: req.user.email,
    //       id: req.user.id
    //     });
    //   }
    // });
    // // Route for members to make bookings --
    // app.post("/api/booking", (req, res) => {
    //   if (!req.user) {
    //     // The user is not logged in, send back an empty object
    //     res.json({});
    //   } else {
    //     // Otherwise send back the user's email and id
    //     // Sending back a password, even a hashed password, isn't a good idea
    //     res.json({
    //       memberId: req.user.id,
    //       id: req.user.id
    //     });
    //   }
    // });
    // //Route for instructors to add classes
    // app.post("/api/add_class", (req, res) => {
    //   db.Classes.create({
    //     email: req.body.email,
    //     password: req.body.password
    //   })
    //     .then(() => {
    //       res.redirect(307, "/api/add_class");
    //     })
    //     .catch(err => {
    //       res.status(401).json(err);
    //     });
    // });
  });
};
