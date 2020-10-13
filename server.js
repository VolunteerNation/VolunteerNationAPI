const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const cors = require('cors');
const mongoose = require('mongoose');
const profileRoutes = express.Router();
const PORT = 4000;

let Profile = require('./profile.model');

app.use(cors());
app.use(bodyParser.json());

const connString = "mongodb://admin:XHNlY3Rpb257RXhlY3V0aXZlIFN1bW1hcnl9Cg@3.91.214.39:9999/?authSource=admin";
mongoose.connect(connString, { useNewUrlParser: true });
const connection = mongoose.connection;

connection.once('open', function() {
    console.log('MongoDB database connection established successfully');
})

// Gives all profiles - will use for debugging in Postman but will remove later
profileRoutes.route('/').get(function(req, res) {
    Profile.find(function(err, profiles) {
        if (err) {
            console.log(err);
        } else {
            res.json(profiles);
        }
    });
});

profileRoutes.route('/:id').get(function(req, res) {
    let id = req.params.id;
    Profile.findById(id, function(err, profile) {
        res.json(profile);
    });
});

profileRoutes.route('/register').post(function(req, res) {
    let profile = new Profile(req.body);
    profile.save()
        .then(profile => {
            res.status(200).json({'profile': 'registration successfull'});
        })
        .catch(err => {
            res.status(400).send('registration failed');
        });
});

profileRoutes.route('/edit/:id').post(function(req, res) {
    Profile.findById(req.params.id, function(err, profile) {
        if (!profile)
            res.status(404).send('data is not found');
        else
            profile.first_name = req.body.first_name;
            profile.last_name = req.body.last_name;
            profile.email = req.body.email;
            profile.street_address = req.body.street_address;
            profile.city_address = req.body.city_address;
            profile.state_address = req.body.state_address;
            profile.zipcode = req.body.zipcode;

            profile.save().then(profile => {
                res.json('Profile updated');
            })
            .catch(err => {
                res.status(400).send("Update not possible");
            });
    });
});

app.use('/vnt_profile', profileRoutes);

app.listen(PORT, function() {
    console.log("Server is running on Port: " + PORT);
});
