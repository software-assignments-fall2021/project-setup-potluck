// import and instantiate express
const express = require("express") // CommonJS import style!
const app = express() // instantiate an Express object
const router = require("express").Router(); // Router object to define a route
require("dotenv").config({ silent: true }) // load environmental variables from a hidden file named .env

// the following are used for authentication with JSON Web Tokens
const _ = require("lodash") // the lodash module has some convenience functions for arrays that we use to sift through our mock user data... you don't need this if using a real database with user info
const jwt = require("jsonwebtoken")
const passport = require("passport")
const firstStrategy = require('passport-local').Strategy;
app.use(passport.initialize()) // tell express to use passport middleware
app.use(passport.session());

//Function that attempts to log in the user
const attemptLogin = async (req, res) => {

  passport.authenticate('local',
  { successRedirect: '/register', failureRedirect: '/login' });

}

router.route("/").post((req, res) => {
    attemptLogin(req, res);
});

router.route("/login").post((req, res) => {

  try {
    attemptLogin(req, res);
  }
  catch (err){
    res.send(err)
  }
    
})

module.exports = router;
