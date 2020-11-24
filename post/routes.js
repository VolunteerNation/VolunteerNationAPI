const express = require("express");
const router = express.Router();
const Post = require("./models/post.model");
const User = require("../login/models/user.model");
const bcrypt = require("bcryptjs");
const {body, validationResult} = require('express-validator');
const vntUtil = require('../vntUtil');
const {authMiddleware} = require("../vntUtil");

router.post('/create', authMiddleware, (req, res) => {
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

    console.log(req.user.email);

    User.findOne({email: req.user.email}).then((email) => {
        console.log("Find one initiated");
        let user_email = email.email;
        console.log(user_email);
        if (!email) {
            errors.push({msg: "Not a registered user"});
            console.log("User mismatch");
            return res.status(400).json(errors);
        } else {
            const newPost = new Post({
                "email": user_email,
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

router.get('/', authMiddleware, (req, res) => {
    console.log('Get all posts called.');

    User.findOne({email: req.user.email}).then((email) => {
        console.log("Find one initiated");
        console.log(email);
        if (!email) {
            errors.push({msg: "Not a registered user"});
            console.log("User mismatch");
            return res.status(400).json(errors);
        } else {
            allPosts = []

            //From here you can take all posts from the database and put them into the allPosts array.

            return res.status(200).send(allPosts);
        }
    });
});

router.get('/my_posts', authMiddleware, (req, res) => {
    console.log('Get all users\' posts called.');

    User.findOne({email: req.user.email}).then((email) => {
        console.log("Find one initiated");
        console.log(email);
        if (!email) {
            errors.push({msg: "Not a registered user"});
            console.log("User mismatch");
            return res.status(400).json(errors);
        } else {
            userPosts = []

            //From here you can take all posts from the database from the given email.

            return res.status(200).send(userPosts);
        }
    });
});

module.exports = router;
