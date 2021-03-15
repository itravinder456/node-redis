const dotenv = require('dotenv');
dotenv.config();
module.exports = {
    redisEndPoint: process.env.REDIS_END_POINT_STRING_STAGING,
    redisPort: process.env.REDIS_END_POINT_PORT,
    redis_auth_token: process.env.REDIS_AUTH_TOKEN
};