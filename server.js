// Import the installed modules.
const express = require('express');
const redisClient = require("./redis");
var session = require('express-session');
var redisStore = require('connect-redis')(session);
const cookieParser = require('cookie-parser');
const checkAuth = require('./check-auth');
const destroy_browser_session = require('./destroy_browser_session');

const app = express();


app.use(cookieParser());

app.use(session({
    secret: 'HAsheDsEcrEtKey$$646#'
    , key: 'session'
    // , proxy: 'true'
    , store: new redisStore({
        client: redisClient, ttl: 1 * 60 * 1 // in seconds (60 * 1 = 1 Minute)
    })
    ,
    saveUninitialized: false,
    resave: false,
    // cookie: { secure: true }
}));


/**
 * Validates users authentication and serve data to the end user.
 */
app.get('/', checkAuth, function (req, res) {
    res.send("Welocme to chat page");
});


/**
 * app.get method used for testing purpose
 */
app.get("/login", (req, res) => {
    // validate username/password and then create a session for the user
    req.session.user = { username: "ravinder", "email": "asdafwvd@gmail.com" };
    // add username and password validation logic here if you want.If user is authenticated send the response as success
    res.end("Logged in. Your idle timeout is 1 min.");
});


/**
 * app.get method used for testing purpose
 */
app.get("/logout", destroy_browser_session, (req, res) => {
    // session destroys and redirect to login page
});

let port = process.env.PORT || 3000;
app.listen(port, () => {
    console.log('Server listening on port: ', port);
});