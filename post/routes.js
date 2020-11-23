const express = require("express");
const router = express.Router();
const Post = require("./models/post.model");
const User = require("../login/models/user.model");
const bcrypt = require("bcryptjs");
const {body, validationResult} = require('express-validator');
const vntUtil = require('../vntUtil');
const { authMiddleware } = require("../vntUtil");

router.post('/create', authMiddleware, (req,res) => {
    console.log('Create called.');

    const {
        firstName,
        lastInitial,
        assignedVolunteer,
        postId,
        description,
        category,
        thumbnailType,
        city,
        state,
        completionStatus,
        completionDate
    } = req.body;

    User.findOne({email: req.user.email}).then((user) => {
        console.log("Find one initiated");
        console.log(user);
        if (!user) {
            errors.push({msg: "Not a registered user"});
            console.log("User mismatch");
            return res.status(400).json(errors);
        } else {
            const newPost = new Post({
                firstName,
                lastInitial,
                assignedVolunteer,
                postId,
                description,
                category,
                thumbnailType,
                city,
                state,
                completionStatus,
                completionDate
            });
            console.log(newPost);

            //From here you can take the newPost object and send to Database

            return res.status(200).send('Return create called.');    
        }
    });
});

// // Registeration handler
// router.post("/register", body('email').isEmail(), body('password').isLength({min: 5}), (req, res) => {
//     console.log(req.body);

//     const validationResult1 = validationResult(req);
//     if (!validationResult1.isEmpty()) {
//         return res.status(400).json(vntUtil.errorMsg(validationResult1.array()));
//     }

//     const {name, email, password, password2} = req.body;

//     console.log(name);

//     let errors = [];
//     if (!name || !email || !password || !password2) {
//         errors.push(vntUtil.errorMsg("Please fill all fields"));
//     }
//     if (password != password2) {
//         errors.push(vntUtil.errorMsg("Passwords do not match"));
//     }
//     const pass = String(password);
//     if (pass.length < 6) {
//         errors.push(vntUtil.errorMsg("Password should be at least 6 characters"));
//     }

//     if (errors.length > 0) {

//         return res.status(400).json(errors);

//     } else {
//         // if the validation is successful
//         User.findOne({email: email}).then((user) => {
//             console.log("Find one initiated");
//             console.log(user);
//             if (user) {
//                 errors.push({msg: "User is already registered"});
//                 console.log("Dupe user");
//                 return res.status(400).json(errors);
//             } else {
//                 const newUser = new User({
//                     name,
//                     email,
//                     password,
//                 });

//                 // Hashing the password
//                 bcrypt.genSalt(10, (err, salt) =>
//                     bcrypt.hash(newUser.password, salt, (err, hash) => {
//                         console.log("Inside bcrypt");
//                         if (err) throw err;
//                         newUser.password = hash;
//                         // Save the user to Mongodb
//                         newUser
//                             .save()
//                             .then((user) => {
//                                 const token = vntUtil.createToken();
//                                 return res.status(200).json(token);
//                             })
//                             .catch((err) => res.status(500).send(err));
//                     })
//                 );
//             }
//         });
//     }
// });

module.exports = router;
