const express = require("express");
const expressLayouts = require("express-ejs-layouts");
const mongoose = require("mongoose");
const session = require("express-session");
const passport = require("passport");

//including from server.js
const constants = require("./constants");
// const PROFILE_API_PREFIX = '/vnt_profile';

// don't need this
const flash = require("connect-flash");

// Passport configuration
require("./Login/config/passport")(passport);

const app = express();

// switching to Jacob's connection from Mohamed's

mongoose
  .connect(constants.CONN_STRING, {
    useUnifiedTopology: true, 
    useNewUrlParser: true
  });

const connection = mongoose.connection;

connection.once('open', function() {
    console.log('MongoDB database connection established successfully');
})

// DB configureation
// const db = require("./config/keys").MongoURI;

// Connect to MOngoDB
// mongoose
//   .connect(db, {
//     useUnifiedTopology: true,
//     useNewUrlParser: true,
//   })
//   .then(console.log("MongoDB connected..."))
//   .catch((err) => console.log(`DB Connection Error: ${err.message}`));

// EJS
app.use(expressLayouts);
app.set("view engine", "ejs");

// Body - parser
app.use(express.urlencoded({ extended: false }));

// Express session
app.use(
  session({
    secret: "secret",
    resave: true,
    saveUninitialized: true,
  })
);

// Passport Middleware
app.use(passport.initialize());
app.use(passport.session());
// connect flash
app.use(flash());

// GLOBAL VARIABLES
app.use((req, res, next) => {
  res.locals.success_msg = req.flash("success_msg");
  res.locals.error_msg = req.flash("error_msg");
  res.locals.error = req.flash("error");
  next();
});

// Routers
app.use("/", require("./Login/routes/index"));
app.use("/users", require("./Login/routes/users"));

//changed from 5000 to 4000
const PORT = process.env.PORT || 4000;

app.listen(PORT, console.log(`Server started on port ${PORT}`));
