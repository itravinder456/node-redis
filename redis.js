const config = require("./config")
// create and connect redis client to server instance.
console.log(config.redisEndPoint);
// var client = require('redis').createClient(config.redisPort, config.redisEndPoint, {
//     no_ready_check: true
// });

const client = require('redis').createClient({ host: config.redisEndPoint, port: config.redisPort, auth_pass: config.redis_auth_token, tls: { checkServerIdentity: () => undefined } })


// Print redis errors to the console
client.on('error', (err) => {
    console.log("Error " + err);
});
module.exports = client;