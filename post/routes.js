const express = require("express");
const router = express.Router();
const Post = require("./models/post.model");
const User = require("../login/models/user.model");
const bcrypt = require("bcryptjs");
const { body, validationResult } = require("express-validator");
const vntUtil = require("../vntUtil");
const { authMiddleware } = require("../vntUtil");
const mongoose = require("mongoose");

router.post("/create", authMiddleware, (req, res) => {
  console.log("Create called.");

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
    completionDate,
  } = req.body;

  console.log(req.user.email);

  User.findOne({ email: req.user.email }).then((email) => {
    console.log("Find one initiated");
    let user_email = email.email;
    console.log(user_email);
    if (!email) {
      errors.push({ msg: "Not a registered user" });
      console.log("User mismatch");
      return res.status(400).json(errors);
    } else {
      const newPost = new Post({
        email: user_email,
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
        completionDate,
      });
      console.log(newPost);

      //From here you can take the newPost object and send to Database
      allPosts.push(newPost);
      newPost
        .save()
        .then((post) => {
          res.send("post saved to database");
        })
        .catch((err) => {
          res.status(400).send(`unable to save to database ${err}`);
        });

      // return res.status(200).send("Return create called.");
    }
  });
});

router.get("/", authMiddleware, (req, res) => {
  console.log("Get all posts called.");

  const allPosts = [];
  Post.find({}).then(posts => {
    allPosts.push(res.json(posts));
  }).catch(err => res.status(400).send(`unable to save to database ${err}`));

  return res.status(200).send(allPosts);


  // User.findOne({ email: req.user.email }).then((email) => {
  //   console.log("Find one initiated");
  //   console.log(email);
  //   if (!email) {
  //     // errors.push({ msg: "Not a registered user" });
  //     console.log("User mismatch");
  //     return res.status(400);
  //   } else {
  //     //From here you can take all posts from the database and put them into the allPosts array.
  //
  //   }
  // });
});

router.get("/my_posts", authMiddleware, (req, res) => {
  console.log("Get all users' posts called.");

  const userPosts = [];
  Post.find({"email": req.user.email}, (err, posts) => {
    if (err) {
      console.log(err);
    } else {
      userPosts.push(res.json(posts));
      // res.render('/my_posts', {currentUser: req.user, posts: posts})
    }
    return res.status(200).send(userPosts);
  })

  // User.findOne({ email: req.user.email }).then((email) => {
  //   console.log("Find one initiated");
  //   console.log(email);
  //   if (!email) {
  //     // errors.push({ msg: "Not a registered user" });
  //     console.log("User mismatch");
  //     return res.status(400).json(errors);
  //   } else {
  //     userPosts = [];
  //
  //     //From here you can take all posts from the database from the given email.
  //
  //     return res.status(200).send(userPosts);
  //   }
  // });
});

module.exports = router;
