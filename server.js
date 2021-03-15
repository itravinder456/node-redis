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
    name: "_redis_test",
    // create new redis store.
    store: new redisStore({
        host: config.redisEndPoint, port: config.redisPort, client: redisClient, ttl: 60 * 1 // in seconds (60 * 1 = 1 Minute)
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


// create an api/search route
app.get('/api/search', (req, res) => {
    // Extract the query from url and trim trailing spaces
    const query = (req.query.query).trim();
    // Build the Wikipedia API url
    const searchUrl = `https://en.wikipedia.org/w/api.php?action=parse&format=json&section=0&page=${query}`;

    // Try fetching the result from Redis first in case we have it cached
    return redisClient.get(`wikipedia:${query}`, (err, result) => {
        // If that user exist in Redis store
        if (result) {
            const resultJSON = JSON.parse(result);
            return res.status(200).json(resultJSON);
        } else { // user does not exist in Redis store
            // Fetch directly from Wikipedia API
            return axios.get(searchUrl)
                .then(response => {
                    const responseJSON = response.data;
                    // Save the Wikipedia API response in Redis store
                    redisClient.setex(`wikipedia:${query}`, 3600, JSON.stringify({ source: 'Redis Cache', ...responseJSON, }));
                    // Send JSON response to client
                    return res.status(200).json({ source: 'Wikipedia API', ...responseJSON, });
                })
                .catch(err => {
                    return res.json(err);
                });
        }
    });
});

app.listen(3000, () => {
    console.log('Server listening on port: ', 3000);
});