const express = require("express");
const router = express.Router();
const User = require("./models/user.model");
const bcrypt = require("bcryptjs");
const vntUtil = require('../vntUtil');

// Login User
// router.get("/login", (req, res) => res.render("login"));
//
// // Registering User
// router.get("/register", (req, res) => res.render("register"));

// Dashboard
// router.get("/dashboard", )

router.post('/auth', (req, res) => {
    const email = req.email;
    const password = req.password;

    User.findOne({email: email})
        .then((user) => {
            if (!user) {
                return res.status(401).json(vntUtil.errorMsg('That email is not registered'));
            }
            // Match password
            bcrypt.compare(password, user.password, (err, isMatched) => {
                if (err) throw err;
                if (isMatched) {
                    const token = vntUtil.createToken();
                    return res.status(200).json(token);
                } else {
                    return res.status(401).json(vntUtil.errorMsg('Password incorrect.'));
                }
            });
        })
        .catch((err) => res.status(500).send(vntUtil.errorMsg("user find failure.")));
})


// Registeration handler
router.post("/register", (req, res) => {
    console.log(req.body);

    const {name, email, password, password2} = req.body;

    console.log(name);

    let errors = [];
    if (!name || !email || !password || !password2) {
        errors.push(vntUtil.errorMsg("Please fill all fields"));
    }
    if (password != password2) {
        errors.push(vntUtil.errorMsg("Passwords do not match"));
    }
    const pass = String(password);
    if (pass.length < 6) {
        errors.push(vntUtil.errorMsg("Password should be at least 6 characters"));
    }

    console.log("Error_length");
    console.log(errors[0]);
    if (errors.length > 0) {

        return res.status(400).json(errors);

    } else {
        // if the validation is successful
        User.findOne({email: email}).then((user) => {
            console.log("Find one initiated");
            console.log(user);
            if (user) {
                errors.push({msg: "User is already registered"});
                console.log("Dupe user");
                return res.status(400).json(errors);
            } else {
                const newUser = new User({
                    name,
                    email,
                    password,
                });

                // Hashing the password
                bcrypt.genSalt(10, (err, salt) =>
                    bcrypt.hash(newUser.password, salt, (err, hash) => {
                        console.log("Inside bcrypt");
                        if (err) throw err;
                        newUser.password = hash;
                        // Save the user to Mongodb
                        newUser
                            .save()
                            .then((user) => {
                                const token = vntUtil.createToken();
                                return res.status(200).json(token);
                            })
                            .catch((err) => res.status(500).send(err));
                    })
                );
            }
        });
    }
});

module.exports = router;
