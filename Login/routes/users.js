const express = require("express");
const router = express.Router();
const User = require("../models/User");
const bcrypt = require("bcryptjs");
const passport = require("passport");

// Login User
router.get("/login", (req, res) => res.render("login"));

// Registering User
router.get("/register", (req, res) => res.render("register"));

// Dashboard
// router.get("/dashboard", )

// Registeration handler
router.post("/register", (req, res) => {
  const { name, email, password, password2 } = req.body;

  let errors = [];
  if (!name || !email || !password || !password2) {
    errors.push({ msg: "Please fill all fields" });
  }
  if (password != password2) {
    errors.push({ msg: "Passwords do not match" });
  }
  const pass = new String(password);
  if (pass.length < 6) {
    errors.push({ msg: "Password should be at least 6 characters" });
  }

  if (errors.length > 0) {
    res.render("register", {
      errors,
      name,
      email,
      password,
      password2,
    });
  } else {
    // if the validation is successful
    User.findOne({ email: email }).then((user) => {
      if (user) {
        errors.push({ msg: "User is already registered" });
        res.render("register", {
          errors,
          name,
          email,
          password,
          password2,
        });
      } else {
        const newUser = new User({
          name,
          email,
          password,
        });

        // Hashing the password
        bcrypt.genSalt(10, (err, salt) =>
          bcrypt.hash(newUser.password, salt, (err, hash) => {
            if (err) throw err;
            newUser.password = hash;
            // Save the user to Mongodb
            newUser
              .save()
              .then((user) => {
                req.flash("success_msg", "You are now registered and can login");
                res.redirect("/users/login");
              })
              .catch((err) => console.log(err));
          })
        );
      }
    });
  }
});

// Handling login
router.post("/login", (req, res, next) => {
  passport.authenticate("local", {
    successRedirect: "/dashboard",
    failureRedirect: "/users/login",
    failureFlash: true,
  })(req, res, next);
});

module.exports = router;

// Handling logout
router.get("/logout", (req, res) => {
  req.logout();
  req.flash("success_msg", "You are logged out");
  res.redirect("/users/login");
});
