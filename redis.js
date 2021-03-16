const config = require("./config")
// create and connect redis client to server instance.
console.log(config.redisEndPoint);
// var client = require('redis').createClient(config.redisPort, config.redisEndPoint, {
//     no_ready_check: true
// });

const client = require('redis').createClient({ host: redisEndPoint, port: redisPort, auth_pass: 'BT786khgbvgf896Bhgff4ffdvb_gyujht6htc76', tls: { checkServerIdentity: () => undefined } })


// Print redis errors to the console
client.on('error', (err) => {
    console.log("Error " + err);
});
module.exports = client;