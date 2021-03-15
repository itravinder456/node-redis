const config = require("./config")
// create and connect redis client to server instance.
console.log(config.redisEndPoint);
// var client = require('redis').createClient(config.redisPort, config.redisEndPoint, {
//     no_ready_check: true
// });

var client = require('redis').createClient(
    config.redisPort, config.redisEndPoint,
    {
        no_ready_check: true,
        // host: config.redisEndPoint,
        // port: config.redisPort,
        // password: config.redis_auth_token
    });



// Print redis errors to the console
client.on('error', (err) => {
    console.log("Error " + err);
});
module.exports = client;