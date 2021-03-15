// Import the installed modules.
const express = require('express');
const responseTime = require('response-time');
const axios = require('axios');
const redisClient = require("./redis");
var session = require('express-session');
var redisStore = require('connect-redis')(session);
const config = require("./config")

const app = express();

app.use(session({
    secret: 'mysecret$HFRYJJj218$$',
    name: "session",
    // create new redis store.
    store: new redisStore({
        client: redisClient, ttl: 60 * 1 // in seconds (60 * 1 = 1 Minute)
    }),
    saveUninitialized: false,
    resave: false
}));



app.get('/', function (req, res) {
    // create new session object.
    if (req.session.user) {
        // user is already logged in
        res.send("Welocme to chat page");
    } else {
        // no session found, go to login page
        res.send("Welocme to login page");
    }
});


app.get("/login", (req, res) => {
    req.session.user = { username: "ravinder", "password": "asdafwvd" };
    // add username and password validation logic here if you want.If user is authenticated send the response as success
    res.end("success")
});
app.get("/logout", (req, res) => {
    req.session.destroy(err => {
        if (err) {
            return console.log(err);
        }
        cookie = req.cookies;
        for (var prop in cookie) {
            if (!cookie.hasOwnProperty(prop)) {
                continue;
            }
            res.cookie(prop, '', { expires: new Date(0) });
        }
        res.redirect("/")
    });
});


// use response-time as a middleware
app.use(responseTime());


let port = process.env.PORT || 3000;
app.listen(port, () => {
    console.log('Server listening on port: ', port);
});