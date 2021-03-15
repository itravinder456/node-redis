// Import the installed modules.
const express = require('express');
const responseTime = require('response-time');
const redisClient = require("./redis");
var session = require('express-session');
var redisStore = require('connect-redis')(session);
const cookieParser = require('cookie-parser');

const app = express();


app.use(cookieParser());

app.use(session({
    secret: 'HAsheDsEcrEtKey$$646#'
    , key: 'session'
    // , proxy: 'true'
    , store: new redisStore({
        client: redisClient, ttl: 1 * 60 // in seconds (60 * 1 = 1 Minute)
    })
    ,
    saveUninitialized: false,
    resave: false,
    // cookie: { secure: true }
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
    req.session.user = { username: "ravinder", "email": "asdafwvd@gmail.com" };
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